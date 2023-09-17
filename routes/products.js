const express = require("express");
const { auth } = require("../middlewares/auth");
const { validateProduct, productsModel } = require("../models/productModel");
const router = express.Router();

router.get("/", auth, async(req,res) => {
  try{
    const limit = req.query.limit || 15;
    const page = req.query.page - 1 || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1;

    let filteFind = {};
    // בודק אם הגיע קווארי לחיפוש ?s=
    if(req.query.s){  
      const searchExp = new RegExp(req.query.s,"i");
      filteFind = {title:searchExp}
    }
    const data = await productsModel
    .find(filteFind)
    .limit(limit)
    .skip(page * limit)
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
});
router.get("/:id", auth, async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the product exists and is associated with the authenticated user
    const product = await productsModel.findOne({
      _id: productId,
      user_id: req.tokenData._id, // Ensure the user is the owner of the product
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(502).json({ err });
  }
});
router.get('/user/:userId',  async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user is the owner of the products
    const products = await productsModel.find({
      user_id: userId, // Ensure the user is the owner of the products
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post("/",auth, async(req,res) => {
  const validBody = validateProduct(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const product = new productsModel(req.body);
    product.user_id = req.tokenData._id;
    await product.save();

    res.status(201).json(product);

  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
});

router.put("/:id", auth, async (req, res) => {
  const validBody = validateProduct(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const id = req.params.id;
    const data = await productsModel.updateOne({_id:id,user_id:req.tokenData._id}, req.body);
    res.status(200).json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
});

router.delete("/:id", auth, async (req, res) => {
  const validBody = validateProduct(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const id = req.params.id;
    const data = await productsModel.deleteOne({_id:id,user_id:req.tokenData._id}, req.body);
    res.status(201).json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;