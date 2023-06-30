const nodemailer = require("nodemailer");

const nodemailerConfig = require("./mail-config");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"Buxury" <no-reply@ehcc.tech>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
