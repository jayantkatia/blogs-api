const nodemailer = require('nodemailer');
const Users = require('../models/user')

const {MAIL_FROM_ADDRESS, MAIL_FROM_NAME, MAIL_PASS} = process.env

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_FROM_ADDRESS,
    pass: MAIL_PASS,
  },
});

exports.mailEveryone= async (subject, message) => {
  const users = await Users.findAll({
    attributes: ['email']
  })
  const toMail = users.map(user => user.email).join(', ')

  const info = await transporter.sendMail({
    from: `"${MAIL_FROM_NAME}" <${MAIL_FROM_ADDRESS}>`, // sender address
    to: toMail,
    subject,
    html: message
  });
  console.log("Message sent: %s", info.messageId);
}


