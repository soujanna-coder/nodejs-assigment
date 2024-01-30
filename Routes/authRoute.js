const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router
  .route("/")
  .post(
    authController.roleCheck("user"),
    authController.protect,
    authController.signup
  );
router
  .route("/")
  .patch(
    authController.roleCheck("user"),
    authController.protect,
    authController.editUser
  );
router.route("/logout").post(authController.protect, authController.logout);
module.exports = router;
