const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true , 
    auth: {
        user: process.env.email, // Your email address
        pass: process.env.pass // Your password for email address
    }
});


const sendMail = (to, object, content, isHtml) => {
    if (isHtml) {
        transporter.sendMail({
            from: process.env.email, // sender address
            to: to, // list of receivers
            subject: object, // Subject line
            html: content // html body


        }, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
        }
        );
    } else {
        transporter.sendMail({
            from: process.env.email, // sender address
            to: to, // list of receivers
            subject: object, // Subject line
            text: content // html body


        }, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
    }

}
module.exports = { sendMail };
