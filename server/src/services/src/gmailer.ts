import { Emailer } from "./custom-emailer"
import { OptionsAttr } from "./custom-emailer"

export class Gmailer extends Emailer {
    constructor() {
        super(
            "gmail",
            'smtp.gmail.com',
            587,
            false,
            process.env.NODEMAILER_USER!,
            process.env.NODEMAILER_PASSWORD!)
    }

    async sendMessage(options: OptionsAttr): Promise<void> {
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL!,
            to: options.email,
            subject: options.subject,
            html: options.message,
        }

        await this.transporter.sendMail(mailOptions)
    }

}