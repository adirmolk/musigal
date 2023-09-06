const mongoose = require("mongoose");
const Joi = require("joi");

const ProductSchema = new mongoose.Schema({
    title: String,
    quantity: Number,
    checked: {
      type: Boolean,
      default: false
    },
    user_id: String,
}, { timestamps: true });

exports.productsModel = mongoose.model("products", ProductSchema);

exports.validateProduct = (_reqBody) => {
  const joiSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    quantity: Joi.number().min(1).max(9999).required()
  })
  return joiSchema.validate(_reqBody);
}
