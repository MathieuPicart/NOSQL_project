const sendEmail = require("../utils/email/sendEmail");
const bcrypt = require("bcrypt");

const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

const User = require('../model/User');

const get = async (data) => {
	const { email, token } = data

	const user = await User.findOne({ email: email });
	
	// check if email exist
	if (!user.success) {
		let e = new Error("Email does not exist");
		e.status = 404;
		throw e;
	}

	const isValid = await bcrypt.compare(token, user.data.token);

	// check validity of token
	if (!isValid) {
		let e = new Error("Invalid or expired token, please try again after sign in");
		e.status = 403;
		throw e;
	}

	return (data = {
		nom : user.data.nom,
		prenom : user.data.prenom,
		email : user.data.email,
		adresse : user.data.adresse,
		bio : user.data.bio,
	})
}

const update = async (data) => {
	const user = await User.findOne({ email: data.email });
	
	// check if email exist
	if (!user.success) {
		let e = new Error("Email does not exist");
		e.status = 402;
		throw e;
	}

	const isValid = await bcrypt.compare(data.token, user.data.token);

	// check validity of token
	if (!isValid) {
		let e = new Error("Invalid or expired token, please try again after sign in");
		e.status = 400;
		throw e;
	}

	await User.update(user.data.idUser, {
		nom : data.nom || user.data.nom,
		prenom : data.prenom || user.data.prenom,
		mdp: data.mdp || user.data.mdp,
		bio: data.bio || user.data.bio,
		adresse: data.adresse || user.data.adresse,
		telephone: data.telephone || user.data.telephone,
	})

	return (data = {
		email: user.data.email,
		name: user.data.nom,
		token: token,
	});
};

const deleteAccount = async (data) => {
	let user = await User.findOne({
		email: data.email
	});

	if (!user.success) {
		let e = new Error("Email does not exist");
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

	return true
};

module.exports = {
	get,
	update,
	deleteAccount,
};