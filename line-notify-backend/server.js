const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// 中間件
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

const LINE_NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN;

// 檢查 LINE_NOTIFY_TOKEN
if (!LINE_NOTIFY_TOKEN) {
    console.error('LINE_NOTIFY_TOKEN is not set in the environment variables');
    process.exit(1);
}

app.post('/send-message', async (req, res) => {
    const { message } = req.body;
    console.log('Received message:', message);

    if (!message) {
        return res.status(400).json({ success: false, error: 'Message is required' });
    }

    try {
        const response = await axios.post('https://notify-api.line.me/api/notify', 
            `message=${encodeURIComponent(message)}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`
                }
            }
        );

        console.log('LINE Notify API response:', response.data);
        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send message', 
            details: error.response ? error.response.data : error.message 
        });
    }
});

// 404 處理
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Not found' });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
