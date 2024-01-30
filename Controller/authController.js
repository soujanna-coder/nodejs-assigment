const asyncHandle = require("../Utils/asyncHandle");
const CustomErrorHandle = require("../Utils/CustomErrorHandle");
const User = require("../Models/userModels");
const genericFunction = require("../Utils/genericFunction");
const BlacklistToken = require("../Models/BlacklistToken");

const signup = asyncHandle(async (req, res, next) => {
  if (req.user) {
    req.body.createdBy = req.user._id;
  }

  const newUser = await User.create(req.body);
  const publicProfile = newUser.getPublicProfile();
  const token = await genericFunction.jwtSignature(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: publicProfile,
    },
  });
});

const login = asyncHandle(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const err = new CustomErrorHandle(400, "Please enter credential");
    next(err);
    return;
  }
  const userPassword = await User.findOne({ email }).select("+password");
  console.log(
    111,
    await userPassword.comparePasswordInDb(password, userPassword.password)
  );
  if (
    !userPassword ||
    !(await userPassword.comparePasswordInDb(password, userPassword.password))
  ) {
    const err = new CustomErrorHandle(400, "Please enter valid credential");
    next(err);
    return;
  }
  const token = await genericFunction.jwtSignature(userPassword._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
const protect = asyncHandle(async (req, res, next) => {
  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  if (!token) {
    return next(new CustomErrorHandle(401, "you are not login "));
  }
  const isTokenBlacklisted = await BlacklistToken.findOne({ token });
  if (isTokenBlacklisted) {
    return next(
      new CustomErrorHandle(401, "Invalid token. Please log in again.")
    );
  }
  const decodeValue = await genericFunction.veryJsonData(token);
  const getUser = await User.findById(decodeValue._id);
  if (!getUser) {
    return next(new CustomErrorHandle(401, "user not exits in database"));
  }

  req.user = getUser;
  next();
});
const editUser = asyncHandle(async (req, res) => {
  const userId = req.params.userId;
  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: updatedUser.getPublicProfile(),
  });
});
const roleCheck = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      const err = new CustomErrorHandle(
        400,
        "you do not have permission to perform this action"
      );
      next(err);
      return;
    }
    next();
  };
};
const logout = asyncHandle(async (req, res) => {
  const userId = req.params.userId;
  const token = req.header("Authorization").replace("Bearer ", "");

  const blacklistedToken = new BlacklistToken({ token });
  await blacklistedToken.save();
  res.status(200).json({ message: "Logout successful" });
});
module.exports = { signup, login, protect, editUser, roleCheck, logout };
