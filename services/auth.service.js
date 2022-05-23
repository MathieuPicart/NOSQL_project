const sendEmail = require("../utils/email/sendEmail");
const bcrypt = require("bcrypt");

const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

const Auth = require('../model/Auth')
const User = require('../model/User');
const tokens = require('../tokens')

function strRandom(o) {
	var a = 10,
		b = 'abcdefghijklmnopqrstuvwxyz',
		c = '',
		d = 0,
		e = '' + b;
	if (o) {
		if (o.startsWithLowerCase) {
			c = b[Math.floor(Math.random() * b.length)];
			d = 1;
		}
		if (o.length) {
			a = o.length;
		}
		if (o.includeUpperCase) {
			e += b.toUpperCase();
		}
		if (o.includeNumbers) {
			e += '1234567890';
		}
	}
	for (; d < a; d++) {
		c += e[Math.floor(Math.random() * e.length)];
	}
	return c;
}

let generatToken = async (nb) => {
	let res = strRandom({
		includeUpperCase: true,
		includeNumbers: true,
		length: nb,
		startsWithLowerCase: true
	});
	while (tokens[res]) {
		res = strRandom({
			includeUpperCase: true,
			includeNumbers: true,
			length: nb,
			startsWithLowerCase: true
		});
	}
	return res;
}

const isSignin = async (data) => {
	const user = await User.findOne({
		email: data.email
	});

	if (!user.success) {
		let e = new Error("Email does not exist");
		e.status = 403;
		throw e;
	}
	
	try {
		const isValid = await bcrypt.compare(data.token, user.data.token);

		return (data = {
			loggedIn: true,
			user: {
				idUser: user.data.idUser,
				email: user.data.email,
				name: user.data.nom,
				token: data.token,
			}
		})
	} catch (e) {
		return (data = {
			loggedIn: false
		});
	}


};

const signin = async (data) => {
	const user = await User.findOne({
		email: data.email
	});

	if (!user.success) {
		let e = new Error("Email does not exist");
		e.status = 402;
		throw e;
	}

	const isValid = await bcrypt.compare(data.mdp, user.data.mdp);

	if (!isValid) {
		let e = new Error("Invalid or expired password");
		e.status = 403;
		throw e;
	}

	const token = await generatToken(20)
	const hash = await bcrypt.hash(token, Number(bcryptSalt));

	await Auth.setToken({
		token: hash,
		idUser: user.data.idUser
	})

	return (data = {
		token : token,
		user  : {
			idUser: user.data.idUser,
			email: user.data.email,
			nom: user.data.nom,
			prenom: user.data.prenom,
			bio: user.data.bio,
			adresse: user.data.adresse,
		}
	});
};

const signup = async (data) => {
	let user = await User.findOne({
		email: data.email
	});

	if (user.success) {
		let e = new Error("Email already exist");
		e.status = 402;
		throw e;
	}

	//generate new password
	const salt = await bcrypt.genSalt(Number(bcryptSalt));
	data.mdp = await bcrypt.hash(data.mdp, salt);
	const token = await generatToken(20)
	user = {
		nom: data.nom,
		prenom: data.prenom,
		email: data.email,
		mdp: data.mdp,
		telephone: data.telephone,
		adresse: data.adresse,
		bio: data.bio,
		token: token,
	}
	let newUser = await User.add(user);

	sendEmail(
		data.email,
		"Welcome to Fessebook!", {
			name: data.prenom,
		},
		"./template/welcome.handlebars"
	);
	return (data = {
		userId: newUser.data._id,
		email: user.email,
		name: user.nom,
		token: token,
	});
};

const requestPasswordReset = async (email) => {
	const user = await User.findOne({
		email
	});
	if (!user.success) {
		let e = new Error("Email does not exist");
		e.status = 403;
		throw e;
	}

	if (user.data.token) await Auth.removeToken({
		idUser: user.data.idUser
	});
	let resetToken = await generatToken(20);
	const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

	await Auth.setToken({
		idUser: user.data.idUser,
		token: hash,
	});
	const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user.data.idUser}`;

	sendEmail(
		user.data.email,
		"Password Reset Request", {
			name: user.data.prenom,
			link: link,
		},
		"./template/requestResetPassword.handlebars"
	);
	return link;
};

const resetPassword = async (email, token, password) => {
	const passwordResetToken = await User.findOne({
		email
	});

	if (!passwordResetToken.success || !passwordResetToken.data.token) {
		let e = new Error("Invalid or expired password reset token");
		e.status = 403
		throw e;
	}

	const isValid = await bcrypt.compare(token, passwordResetToken.data.token);

	if (!isValid) {
		let e = new Error("Invalid or expired password reset token");
		e.status = 403;
		throw e;
	}

	const hash = await bcrypt.hash(password, Number(bcryptSalt));

	await User.update(
		passwordResetToken.data.idUser, {
			mdp: hash
		});

	sendEmail(
		passwordResetToken.data.email,
		"Password Reset Successfully", {
			name: passwordResetToken.data.prenom,
		},
		"./template/resetPassword.handlebars"
	);
	// await Auth.removeToken({idUser: passwordResetToken.data.idUser})

	return true;
};

module.exports = {
	signin,
	isSignin,
	signup,
	requestPasswordReset,
	resetPassword,
};