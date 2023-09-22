const mongoose = require("mongoose");
const Joi = require("joi");

const VinylSchema = new mongoose.Schema({
    title: String,
    artist: String,
    img_url: String,
    user_id: String
}, { timestamps: true });

exports.VinylModel = mongoose.model("vinyls", VinylSchema);

exports.validateVinyl = (_reqBody) => {
  const joiSchema = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    artist: Joi.string().min(2).max(100).required(),
    img_url: Joi.string().min(2).max(9999).required(),
  })
  return joiSchema.validate(_reqBody);
}