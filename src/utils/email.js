import nodemailer from "nodemailer"

async function sendMail(to, name, body, subject) {
    const smtp = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'joao.vc2006@unochapeco.edu.br',
            pass: 'jnfi aacl jkvj erap',
        }
    });

    await smtp.sendMail({
        to,
        subject,
        html: body,

    })
}

export default sendMail