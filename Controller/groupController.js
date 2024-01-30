const asyncHandle = require("../Utils/asyncHandle");
const User = require("../Models/userModels");
const Group = require("../Models/groupModels");
const CustomErrorHandle = require("../Utils/CustomErrorHandle");
const createGroup = asyncHandle(async (req, res, next) => {
  const createdBy = req.user._id;
  const { name } = req.body;
  const group = await Group.create({ name, createdBy });
  res.status(201).json(group);
});
const getGroupMembers = asyncHandle(async (req, res, next) => {
  const groupId = req.params.groupId;
  if (!group || !user) {
    const err = new CustomErrorHandle(400, "No group found");
    next(err);
    return;
  }
  const group = await Group.findById(groupId).populate("members");
  res.status(200).json(group);
});
const addGroupMembers = asyncHandle(async (req, res, next) => {
  const { groupId, userId } = req.body;
  const group = await Group.findById(groupId);
  const user = await User.findById(userId);
  if (!group || !user) {
    const err = new CustomErrorHandle(400, "not find");
    next(err);
    return;
  }
  if (group.members.includes(userId)) {
    const err = new CustomErrorHandle(
      400,
      "User is already a member of the group."
    );
    next(err);
    return;
  }
  if (user.groups.includes(groupId)) {
    const err = new CustomErrorHandle(
      400,
      "Group is already in the user's groups."
    );
    next(err);
    return;
  }

  await Group.findByIdAndUpdate(groupId, { $push: { members: userId } });
  await User.findByIdAndUpdate(userId, { $push: { groups: groupId } });
  res.status(200).send({ message: "member add successfully " });
});
const deleteGroup = asyncHandle(async (req, res, next) => {
  const groupId = req.params.groupId;

  const group = await Group.findById(groupId);

  if (!group) {
    const err = new CustomErrorHandle(400, "Group is not find");
    next(err);
    return;
  }

  await group.deleteOne();
  res.status(204).send();
});
const searchGroup = asyncHandle(async (req, res, next) => {
  const groupName = req.params.name;
  const groups = await Group.find({
    name: { $regex: new RegExp(groupName, "i") },
  });
  if (groups.length == 0) {
    const err = new CustomErrorHandle(400, "group not found");
    next(err);
    return;
  }
  res.status(200).json(groups);
});
module.exports = {
  createGroup,
  getGroupMembers,
  addGroupMembers,
  deleteGroup,
  searchGroup,
};
