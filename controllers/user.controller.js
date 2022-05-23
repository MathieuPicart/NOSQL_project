const {
	get,
	update,
	deleteAccount,
} = require("../services/user.service");

const getUserController = async (req, res, next) => {
	const getService = await get(req.body.data);
	return res.json(getService);
};

const updateUserController = async (req, res, next) => {
	const updateService = await update(req.body.data);
	return res.json(updateService);
};

const deleteUserController = async (req, res, next) => {
	const deleteAccountService = await deleteAccount(req.body.data);
	return res.json(deleteAccountService);
};

module.exports = {
	getUserController,
	updateUserController,
	deleteUserController,
};