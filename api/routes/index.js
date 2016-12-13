const express = require("express");
const router = express.Router();
const ctrlMessages = require("../controllers/messages.controllers.js");
const ctrlUsers = require("../controllers/users.controllers.js");

//message routes
router
    .route("/messages")
    .get(ctrlMessages.getAllMessages)
    .post(ctrlUsers.authenticate,ctrlMessages.addOneMessage);

//user routes
router
    .route("/users");

//authentication
router
    .route("/users/register")
    .post(ctrlUsers.register);

router
    .route("/users/login")
    .post(ctrlUsers.login);

router
    .route("/users/logout")
    .post(ctrlUsers.logout);

module.exports = router;





