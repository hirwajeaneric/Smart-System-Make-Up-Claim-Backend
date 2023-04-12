const nodemailer = require('nodemailer');
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, messageContent, template) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hirwaminerve25@gmail.com',
                pass: 'yiudzvlcmksmzfer',
            },
        });

        const source = fs.readFileSync(path.join(__dirname, template), "utf8");
        const compiledTemplate = handlebars.compile(source);

        const options = {
            from: "hirwaminerve25@gmail.com",
            to: email,
            subject: subject,
            html: compiledTemplate(messageContent),
        };

        await transporter.sendMail(options, function(error, infor) {
            if (error) {
                console.log("Failed to save email: "+error);
                return error;
            } else {
                console.log("Email Sent To Student: "+infor.response);
                return res.status(200).json({
                    success: true,
                });
            }
        });
    } catch (error) {
        return error;
    }
}

module.exports = sendEmail;