const express = require("express");
const { auth } = require("../middlewares/auth");
const { validateSong, songModel } = require("../models/songmodel");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 5;
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
