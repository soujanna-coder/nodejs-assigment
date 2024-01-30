const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
groupSchema.pre("remove", async function (next) {
  const userIds = this.members.map((member) => member.toString());
  await this.model("User").updateMany(
    { _id: { $in: userIds } },
    { $pull: { groups: this._id } }
  );

  await this.model("Message").updateMany(
    { _id: { $in: this.messages } },
    { $pull: { groups: this._id } }
  );

  next();
});
const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
