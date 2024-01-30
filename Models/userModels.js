const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 8,
    validate: [
      function (val) {
        return val == this.password;
      },
      "Please enter password and confirm password",
    ],
  },
  passwordChange: {
    type: Date,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const password = await bcrypt.hash(this.password, 12);
  console.log(password);
  this.password = password;
  this.confirmPassword = undefined;
  console.log(this);
  next();
});

userSchema.methods.comparePasswordInDb = async function (pwd, pwdDB) {
  console.log(pwd, pwdDB, await bcrypt.compare(pwd, pwdDB));
  return await bcrypt.compare(pwd, pwdDB);
};

userSchema.methods.getPublicProfile = function () {
  const publicProfile = {
    name: this.name,
    email: this.email,
    photo: this.photo,
    role: this.role,
  };
  return publicProfile;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
