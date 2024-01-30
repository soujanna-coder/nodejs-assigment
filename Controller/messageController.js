const asyncHandle = require("../Utils/asyncHandle");
const genericFunction = require("../Utils/genericFunction");
const Message = require("../Models/messageModels");
const Group = require("../Models/groupModels");
const CustomErrorHandle = require("../Utils/CustomErrorHandle");
const messageLike = asyncHandle(async (req, res, next) => {
  const userId = req.user._id;
  const { messageId } = req.params;

  const message = await Message.findById(messageId);
  if (!message) {
    const err = new CustomErrorHandle(400, "No message found");
    next(err);
    return;
  }
  if (message.likes.includes(userId)) {
    await Message.findByIdAndUpdate(messageId, { $pull: { likes: userId } });
    res.status(200).json({ liked: false });
  } else {
    await Message.findByIdAndUpdate(messageId, { $push: { likes: userId } });
    res.status(200).json({ liked: true });
  }
});

const sendMessage = asyncHandle(async (req, res, next) => {
  const user = req.user._id;
  const { text, groupId } = req.body;
  const group = await Group.findById(groupId);
  if (!group) {
    const err = new CustomErrorHandle(400, "No group found");
    next(err);
    return;
  }
  const message = await Message.create({ text, user, group });
  res.status(201).json(message);
});
module.exports = { messageLike, sendMessage };
