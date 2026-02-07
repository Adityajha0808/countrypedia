require('dotenv').config({ path: __dirname + '/../.env' });

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

function sendMail(name, email, message) {
    return new Promise(async (resolve, reject) => {

        const timeout = setTimeout(() => {
            reject(new Error("MAIL_TIMEOUT"));
        }, 30000);

        try {
            const result = await resend.emails.send({
                from: 'Countrypedia <onboarding@resend.dev>',
                to: [process.env.MAIL_ID],
                subject: `Email request from ${name} (${email})`,
                html: `
                    <h3>New Contact Request</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `
            });

            clearTimeout(timeout);

            if (!result || result.error || !result.data?.id) {
                return reject(new Error("MAIL_API_FAILED"));
            }

            resolve(result);

        } catch (err) {
            clearTimeout(timeout);
            reject(err);
        }
    });
}

module.exports = { sendMail };
