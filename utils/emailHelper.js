const nodemailer =  require("nodemailer");

const mailHelper = async (options) => {
    // create reusable transporter object using the default SMTP transport
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "752f7b536e31c9",
          pass: "717497f151c8ac"
        }
      });

  // send mail with defined transport object
  const message = {
    from: '"Aviral Singh Pal 👻" <aviralpal@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
    
  }
  let info = await transporter.sendMail();

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = mailHelper