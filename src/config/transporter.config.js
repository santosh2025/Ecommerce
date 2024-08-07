import nodemailer from "nodemailer"
import config from "../config/index.js"

const transporter = nodemailer.createTransport({
    host: config.SMTP_MAIL_HOST,
    port: config.SMTP_MAIL_PORT,
    //secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.SMTP_MAIL_USERNAME,
      pass: config.SMTP_MAIL_PASSWORD,
    },
})



export default transporter

