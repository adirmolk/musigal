const express = require("express");
const bcrypt = require("bcrypt");
const { auth } = require("../middlewares/auth");
const {
  UserModel,
  validateUser,
  validateLogin,
  createToken,
} = require("../models/userModel");

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "user work 77777" });
});

router.get("/profile", auth, async (req, res) => {
  // res.json({msg:"Info of user"})
  try {
    // req.tokenData - מגיע מהפונקציית אוט שנמצאת בשרשור של הראוטר
    const data = await UserModel.findOne(
      { _id: req.tokenData._id },
      { password: 0 }
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// אזור שרק משתמש שהתחבר ושלח
// טוקן יוכל לקבל מידע על עצמו לפי הטוקן ששלח
router.get("/showInfo", async (req, res) => {
  // נבדוק אם נשלח טוקן בהידר
  // req.params, req.body, .req.query, req.header
  const token = req.header("x-api-key");
  if (!token) {
    return res
      .status(401)
      .json({ err: "You need send token to this endpoint/url" });
  }
  try {
    // מנסה לפענח את הטוקן אם הוא לא בתוקף
    // או שיש טעות אחרת נעבור לקץ'
    const decodeToken = jwt.verify(token, "adirmolkSecret");

    // {password:0} -> יציג את כל המאפיינםי מלבד הסיסמא
    // אם במקום 0 היינו שמים 1 היה מציג רק את הסיסמא
    const data = await UserModel.findOne(
      { _id: decodeToken._id },
      { password: 0 }
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err: "Token invalid or expired" });
  }
});

router.post("/", async (req, res) => {
  const validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const user = new UserModel(req.body);
    // להצפין את הסיסמא של המשתמש עם בי קריפט
    // 10 - רמת הצפנה
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    // מחזירים לצד לקוח המתכנת כוכביות במקום
    // את הסגנון הצפנה כדי שלא יהיה לו מושג איך אנחנו מצפנים
    user.password = "******";
    res.status(201).json(user);
  } catch (err) {
    // בדיקת אם המייל האירור זה שהמייל כבר קיים בקולקשן/טבלה
    if (err.code == 11000) {
      return res
        .status(400)
        .json({ err: "Email already in system", code: 11000 });
    }
    console.log(err);
    res.status(502).json({ err });
  }
});

router.post("/login", async (req, res) => {
  const validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    // נבדוק אם המייל של המשתמש בכלל קיים במערכת
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ err: "Email not found!" });
    }
    // נבדוק אם הסיסמא שמהבאדי תואמת לסיסמא המוצפנת ברשומה שמצאנו עם המייל
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(401).json({ err: "Password not match" });
    }

    // נשלח טוקן
    const token = createToken(user.id);
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
