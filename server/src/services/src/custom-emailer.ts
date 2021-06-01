import * as nodemailer from "nodemailer"

export interface OptionsAttr {
    subject: string,
    message: string
    email: string
}

export abstract class Emailer {
    protected transporter: nodemailer.Transporter

    constructor(
        public service_name: string,
        public mail_host: string,
        public mail_port: number,
        public secure_bool: boolean,
        public mail_user: string,
        public mail_password: string
    ) {
        this.transporter = nodemailer.createTransport({
            service: service_name,
            host: mail_host,
            port: mail_port,
            secure: secure_bool,
            auth: {
                user: mail_user,
                pass: mail_password,
            },
        })
    }

    abstract sendMessage(options: OptionsAttr):Promise<void>
}