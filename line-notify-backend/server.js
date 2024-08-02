const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

app.use(express.static('public'));
app.use(bodyParser.json());

const LINE_NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN;

app.post('/send-message', async (req, res) => {
    const { message } = req.body;

    try {
        await axios.post('https://notify-api.line.me/api/notify', 
            `message=${encodeURIComponent(message)}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`
                }
            }
        );
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
