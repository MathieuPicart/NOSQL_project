const {
	signin,
	isSignin,
	signup,
	requestPasswordReset,
	resetPassword,
} = require("../services/auth.service");

const signInController = async (req, res, next) => {
	const signinService = await signin(req.body.data);
	return res.json(signinService);
};

const isSignInController = async (req, res, next) => {
	const isSignInService = await isSignin(req.body.data)
	return res.json(isSignInService);
};

const signUpController = async (req, res, next) => {
	const signupService = await signup(req.body.data);
	return res.json(signupService);
};

const resetPasswordRequestController = async (req, res, next) => {
	const requestPasswordResetService = await requestPasswordReset(req.body.data.email);
	return res.json(requestPasswordResetService);
};

const resetPasswordController = async (req, res, next) => {
	const resetPasswordService = await resetPassword(
		req.body.data.email,
		req.body.data.token,
		req.body.data.mdp
	);
	return res.json(resetPasswordService);
};

module.exports = {
	signInController,
	isSignInController,
	signUpController,
	resetPasswordRequestController,
	resetPasswordController,
};