const express = require("express");
const groupRoute = express.Router();
const groupController = require("../Controller/groupController");
const authController = require("../Controller/authController");
groupRoute
  .route("/")
  .post(
    authController.protect,
    authController.roleCheck("user"),
    groupController.createGroup
  );
groupRoute
  .route("/members/:groupId")
  .get(
    authController.protect,
    authController.roleCheck("user"),
    groupController.getGroupMembers
  );
groupRoute
  .route("/members")
  .post(
    authController.protect,
    authController.roleCheck("user"),
    groupController.addGroupMembers
  );
groupRoute
  .route("/members/:groupId")
  .delete(
    authController.protect,
    authController.roleCheck("user"),
    groupController.deleteGroup
  );
groupRoute
  .route("/search/:name")
  .get(
    authController.protect,
    authController.roleCheck("user"),
    groupController.searchGroup
  );
module.exports = groupRoute;
