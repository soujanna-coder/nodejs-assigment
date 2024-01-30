process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
const app = require("./app");
const server = app.listen(process.env.PORT, (err) => {
  console.log("serve");
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("rejection occur");
  server.close(() => {
    process.exit(1);
  });
});
