require('dotenv').config({ path: __dirname + '/../.env' });

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { run, chat } = require('./index');
const { sendMail } = require('./mail');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.post('/trigger-run-function', async (req, res) => {
    try {
        const { countryName } = req.body;
        const aiData = await run(countryName);
        res.json(aiData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Run function failed' });
    }
});

app.post('/chat-function', async (req, res) => {
    try {
        const { country, chatHistory, message } = req.body;
        const aiData = await chat(country, chatHistory, message);
        res.json(aiData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Chat function failed' });
    }
});

app.post('/send-email', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        await sendMail(name, email, message);
        res.send('Email sent successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error sending email');
    }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
