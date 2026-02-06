require('dotenv').config({ path: __dirname + '/../.env' });

const nodemailer = require('nodemailer');

function sendMail(name, email, message) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PWD
            }
        });

        const mailOptions = {
            from: email,
            to: process.env.MAIL_ID,
            subject: `Email request from ${name} (${email})`,
            text: message
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) reject(error);
            else resolve(info);
        });
    });
}

module.exports = { sendMail };
