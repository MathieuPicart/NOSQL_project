const {
	getUserController,
	updateUserController,
	deleteUserController
} = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/get", getUserController)
router.post("/update", updateUserController);
router.post("/delete", deleteUserController);

module.exports = router;