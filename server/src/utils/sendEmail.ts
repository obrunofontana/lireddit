import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string, subject: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: 'dxjurawkkm3sz2pm@ethereal.email', // generated ethereal user
      pass: '8X263Y3pajW3VhGRe8', // generated ethereal password
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to,
    subject,
    html
  });

  console.log("Message sent: %s", info.messageId);

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}