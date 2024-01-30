const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
dotEnv.config({ path: "./.dev.env" });
const authRouter = require("./Routes/authRoute");
const groupRouter = require("./Routes/groupRoute");
const messageRouter = require("./Routes/messageRoute");

const CustomErrorHandle = require("./Utils/CustomErrorHandle");
const errorController = require("./Controller/errorController");

const app = express();
mongoose.connect(process.env.CONNECTION_STRING).then((value) => {
  console.log("connection established");
});

app.use(express.json());
app.use("/api/user/", authRouter);
app.use("/api/group/", groupRouter);
app.use("/api/message/", messageRouter);
app.all("*", (req, res, next) => {
  const err = new CustomErrorHandle(
    404,
    `Cant find ${req.originalUrl} on the server!`
  );
  next(err);
});
app.use(errorController.globalHandle);
module.exports = app;
