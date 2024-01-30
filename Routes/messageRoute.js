const express = require("express");
const messageRoute = express.Router();
const messageController = require("../Controller/messageController");
const authController = require("../Controller/authController");
messageRoute
  .route("/like/:messageId")
  .get(
    authController.protect,
    authController.roleCheck("user"),
    messageController.messageLike
  );
messageRoute
  .route("/")
  .post(
    authController.protect,
    authController.roleCheck("user"),
    messageController.sendMessage
  );
module.exports = messageRoute;
