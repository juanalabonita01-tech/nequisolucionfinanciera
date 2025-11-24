// api/check-status.js - Cliente verifica el estado
export default async function handler(req, res) {
    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'userId required' });
        }

        // Verificar si existe el estado global
        if (!global.userStates) {
            global.userStates = {};
        }

        const userState = global.userStates[userId];

        if (userState) {
            // Limpiar estado después de 5 minutos
            const now = Date.now();
            if (now - userState.timestamp > 300000) {
                delete global.userStates[userId];
                return res.status(200).json({ status: 'pending' });
            }

            // Retornar estado
            return res.status(200).json({
                status: userState.status,
                nextPage: userState.nextPage,
                timestamp: userState.timestamp
            });
        }

        return res.status(200).json({ status: 'pending' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
