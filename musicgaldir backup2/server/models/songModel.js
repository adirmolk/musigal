const mongoose = require("mongoose");
const Joi = require("joi");

const SongSchema = new mongoose.Schema(
  {
    title: String,
    album: String,
    artist: String,
    description: String,
    img_url: String,
    preview: String,
    albumId: Number,
    artistId: Number,
    songId: Number,
    user_id: String,
    whoRated: Array,
  },
  { timestamps: true }
);

exports.songModel = mongoose.model("songs2", SongSchema);

exports.validateSong = (_reqBody) => {
  const joiSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    album: Joi.string().min(2).max(100).required(),
    artist: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(2).max(100).required(),
    artistId: Joi.number().min(2).max(Infinity).required(),
    albumId: Joi.number().min(2).max(Infinity).required(),
    songId: Joi.number().min(2).max(Infinity).required(),
    img_url: Joi.string().min(2).max(9999).allow("", null),
    preview: Joi.string().min(2).max(9999).allow("", null),
  });
  return joiSchema.validate(_reqBody);
};
