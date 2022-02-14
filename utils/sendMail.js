const nodeMailer = require("nodemailer");

const sendMail = (options) => {
//    create transporter
const transporter = nodeMailer.createTransport({
    // email service provider
    service : process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
    },
});

// mail options
const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
}

// finally send mail
transporter.sendMail(mailOptions, (err, info) => {
    if(err) console.log({err});
    if(info) console.log({info});
})

}

module.exports = sendMail;