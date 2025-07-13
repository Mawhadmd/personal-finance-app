import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mohammedbus13@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export async function sendEmail(to: string, code: string) {
if (!to || !code) {
    return { error: "Invalid email or code." };
    }
transporter.sendMail({
  from: 'mohammedbus13@gmail.com',
  to: to,
  subject: "Personal Finance App - verification code",
  text: code,
  // html: '<b>This is a test email sent using Nodemailer!</b>',
}, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}