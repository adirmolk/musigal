const mongoose = require("mongoose");
const Joi = require("joi");

const ProductSchema = new mongoose.Schema({
    title: String,
    price: Number,
    condition: String,
    location: String,
    description: String,
    img_url: String,
    user_id: String,
}, { timestamps: true });

exports.productsModel = mongoose.model("products", ProductSchema);

exports.validateProduct = (_reqBody) => {
  const joiSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    price: Joi.number().min(1).max(9999).required(),
    condition: Joi.string().min(2).max(100).required(),
    location: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(2).max(100).required(),
    img_url: Joi.string().min(2).max(100000).allow("", null)

  })
  return joiSchema.validate(_reqBody);
}
