const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authMaxim } = require("../middlewares/auth");
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

router.get("/validToken", authMaxim, (req, res) => {
  // If the middleware reaches this point, the token is valid and not expired
  res.json({ isValid: true });
});

router.get("/profile", auth, async (req, res) => {
  try {
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

// Example server route for fetching user profile
router.get('/profile/:id', auth, async (req, res) => {
  const userId = req.params.id; // Use req.params to access the user ID

  try {
    // Fetch user profile data based on the user ID
    const userProfile = await UserModel.findById(userId).select('-password');

    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});






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
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID in the database
    const user = await UserModel.findById(userId, { password: 0 });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user data (excluding the password)
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update/:userId", auth, async (req, res) => {
  const userId = req.params.userId;
  const authenticatedUserId = req.tokenData._id.toString(); // Get the ID of the authenticated user

  try {
    // Fetch the user based on the provided user ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the authenticated user is trying to update their own level
    if (userId === authenticatedUserId) {
      return res.status(403).json({ error: "You cannot update your own level" });
    }
    

    // Validate and update user data
    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.password) {
      // Hash the new password before updating
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }

    if (req.body.rating) {
      // Update the user's level based on the provided rating
      const selectedRating = parseInt(req.body.rating);
      // Adjust the logic to update the level based on the rating as needed
      user.level += selectedRating; // Example: Increment the level by the rating
    }

    // Save the updated user
    await user.save();

    // Return a sanitized user object (exclude sensitive data)
    const sanitizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      level: user.level,
      // Add other relevant fields as needed
    };

    res.json(sanitizedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put('/follow/:userId', auth, async(req, res) => {
  try{
    const userId = req.params.userId;
    const user = await UserModel.updateOne({_id: userId},{$push: {friends: req.tokenData._id}}) 
    res.json(user);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.put('/unfollow/:userId', auth, async(req, res) => {
  try{
    const userId = req.params.userId;
    const user = await UserModel.updateOne({_id: userId},{$pull: {friends: req.tokenData._id}}) 
    res.json(user);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;