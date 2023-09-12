const express = require("express");
const { auth } = require("../middlewares/auth");
const { validateSong, songModel } = require("../models/songModel");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 15;
    const page = req.query.page - 1 || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1;

    let filteFind = {};
    // בודק אם הגיע קווארי לחיפוש ?s=
    if (req.query.s) {
      const searchExp = new RegExp(req.query.s, "i");
      filteFind = { title: searchExp };
    }
    const data = await songModel
      .find(filteFind)
      .limit(limit)
      .skip(page * limit)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get('/user/:userId',  async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user is the owner of the products
    const products = await songModel.find({
      user_id: userId, // Ensure the user is the owner of the products
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/", auth, async (req, res) => {
  const validBody = validateSong(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const song = new songModel(req.body);
    song.user_id = req.tokenData._id;
    await song.save();

    res.status(201).json(song);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.put("/rating/:songId", auth, async (req, res) => {
  try {
    const songId = req.params.songId;
    const updatedRating = req.body.rating;

    const data = await songModel.updateOne(
      {
        _id: songId,
      },
      {
        $push: { whoRated: { user: req.tokenData._id, rating: updatedRating } },
      }
    );

    res.json({ message: "Rating updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/rating/:songId", auth, async (req, res) => {
  try {
    const songId = req.params.songId;
    const userId = req.tokenData._id;

    const data = await songModel.findOne({ _id: songId });
    const userRating = data.whoRated.find((rateInfo) => rateInfo.user === userId);

    let totalRating = 0;
    data.whoRated.forEach((rateInfo) => {
      totalRating += rateInfo.rating;
    });

    if (userRating) {
      res.json({ userRating: userRating.rating, totalRating }); 
    } else {
      res.json({ userRating: 0, totalRating }); 
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.put("/:id", auth, async (req, res) => {
  const validBody = validateSong(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const id = req.params.id;
    const data = await songModel.updateOne(
      { _id: id, user_id: req.tokenData._id },
      req.body
    );
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const validBody = validateSong(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const id = req.params.id;
    const data = await songModel.deleteOne(
      { _id: id, user_id: req.tokenData._id },
      req.body
    );
    res.status(201).json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
