const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'group3nodejs@gmail.com',
        pass:'ezfmfjbmifqqoknf'
    },
    tls: {
        rejectUnauthorized: false
    }
    
})

module.exports = transporter;