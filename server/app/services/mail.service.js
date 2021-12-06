const nodeMailer = require('nodemailer')

class MailService {
    constructor() {
        this.transporter = nodeMailer.createTransport({
            // headers: {
            //     "Authorization": `Bearer ${process.env.SMTP_JWT_TOKEN}`,
            //     "Api-Token": process.env.SMTP_API_TOKEN
            // },
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(toEmail, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: toEmail,
            subject: `Account activation on ${process.env.APP_NAME}`,
            text: '',
            html:
                `
                <div>
                    <h1>You need to click on the link in the email to activate your account.</h1>
                    <a href="${link}">${link}</a>
                </div>
                `
        })
    }
}

module.exports = new MailService()