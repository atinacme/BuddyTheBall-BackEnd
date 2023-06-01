const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

exports.sendEmailService = (send_to, subject, message, filename, path) => {

    return new Promise((resolve, reject) => {

        const email_message = {
            from: process.env.SMTP_USER,
            to: send_to,
            subject: subject,
            text: message,
            attachments: [{
                filename: filename,
                path: path,
                contentType: "application/pdf"
            }]
        };

        transporter.sendMail(email_message).then((v) => {
            resolve(true);
        }).catch((error) => {
            reject(false);
        });

    })

}