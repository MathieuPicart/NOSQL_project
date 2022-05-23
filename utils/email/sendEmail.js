const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
	try {
		// create reusable transporter object using the default SMTP transport
		const transporter = nodemailer.createTransport({
			// service : process.env.EMAIL_SERVICE,
			// host: process.env.EMAIL_HOST,
			host: 'smtp.gmail.com',
			port: 465,
			secure: true, // use SSL
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		// transporter.verify(function (error, success) {
		// 	if (error) {
		// 	  console.log(error);
		// 	} else {
		// 	  console.log("Server is ready to take our messages");
		// 	}
		//  });
		
		const source = fs.readFileSync(path.join(__dirname, template), "utf8");
		const compiledTemplate = handlebars.compile(source);
		const options = () => {
			return {
				from: process.env.FROM_EMAIL,
				to: email,
				subject: subject,
				html: compiledTemplate(payload),
			};
		};

		
		// Send email
		transporter.sendMail(options(), (error, info) => {
			if (error) {
				return error;
			} else {
				return res.status(200).json({
					success: true,
				});
			}
		});
		
	} catch (error) {
		return error;
	}
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = sendEmail;