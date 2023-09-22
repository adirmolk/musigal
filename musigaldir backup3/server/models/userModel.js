const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    imgUrl: String,
    level: {
      type: Number,
      default: 0, // Set the default level to 0
    },
    role: {
      type: String,
      default: "user",
    },
    friends: Array,
    // מאפיין שיווצר לבד בכל רשומה שנוסיף
    // לפי התאריך שנוספה הרשומה בברירת מחדל
  },
  { timestamps: true }
);

exports.UserModel = mongoose.model("users", userSchema);

exports.createToken = (user_id) => {
  // פרמטר ראשון - תכולה מקודדת של טוקן
  // פרמטר שני - מילה סודית שככה נוכל גם לפענח את הקידוד
  // אסור לעולם לחשוף את המילה הזאתי
  // פרמטר שלישי - טווח זמן שבו יפוג התוקף
  // של הטוקן ולאחר מכן הוא לא יהיה שמיש
  const token = jwt.sign({ _id: user_id }, "adirmolkSecret", {
    expiresIn: "600mins",
  });
  return token;
};

exports.validateUser = (_reqBody) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    email: Joi.string().min(2).max(150).email().required(),
    password: Joi.string().min(3).max(16).required(),
    imgUrl: Joi.string().allow(),
  });
  return joiSchema.validate(_reqBody);
};

// וולדזציה להתחברות
exports.validateLogin = (_reqBody) => {
  const joiSchema = Joi.object({
    email: Joi.string().min(2).max(150).email().required(),
    password: Joi.string().min(3).max(16).required(),
  });
  return joiSchema.validate(_reqBody);
};
