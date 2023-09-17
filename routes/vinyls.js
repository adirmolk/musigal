const express = require("express");
const { auth } = require("../middlewares/auth");
const { validateVinyl, VinylModel } = require("../models/vinylModel");
const router = express.Router();

router.get('/user/:userId',  async (req, res) => {
    try {
      const userId = req.params.userId;
      const vinyls = await VinylModel.find({
        user_id: userId
      });
      res.json(vinyls);
    } catch (err) {
      console.error(err);
      res.status(502).json({ error: 'Internal Server Error' });
    }
  });

  router.post("/",auth, async(req,res) => {
    const validBody = validateVinyl(req.body)
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      const vinyl = new VinylModel(req.body);
      vinyl.user_id = req.tokenData._id;
      await vinyl.save();
  
      res.status(201).json(vinyl);
  
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  });

module.exports = router;