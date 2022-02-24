const express = require("express");

const password = require("../middleware/password");

const router = express.Router();

const userCtrl = require("../controllers/user");

// Mise en place des routes user :

router.post("/signup", password, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
