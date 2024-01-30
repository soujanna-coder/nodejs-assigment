const CustomErrorHandle = require("../Utils/CustomErrorHandle");
const devError = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};
const prodError = (res, error) => {
  if (error.optionError) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "Fail",
      message: "something went wrong! Please try again later",
    });
  }
};
const CastErrorHandler = (error) => {
  const err = new CustomErrorHandle(
    404,
    `this is Cast error for id :- ${error.path}`
  );
  return err;
};
const duplicateErrorHandle = (error) => {
  const err = new CustomErrorHandle(
    404,
    `this is Duplicate name error ${error.keyPattern.name} `
  );
  return err;
};
const jsonWebTokenError = (error) => {
  const err = new CustomErrorHandle(401, `please login again `);
  return err;
};
const tokenExpiredError = (error) => {
  const err = new CustomErrorHandle(401, `expire session please login again.`);
  return err;
};
const globalHandle = (err, req, res, next) => {
  err.status = err.status || "Fail";
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "error occurs";
  if (process.env.NODE_ENV === "development") {
    devError(res, err);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") {
      err = CastErrorHandler(err);
    }
    if (err.code === 11000) {
      err = duplicateErrorHandle(err);
    }
    if (err.name == "JsonWebTokenError") {
      err = jsonWebTokenError(err);
    }
    if (err.name == "TokenExpiredError") {
      err = tokenExpiredError(err);
    }
    prodError(res, err);
  }
};
module.exports = { globalHandle };
