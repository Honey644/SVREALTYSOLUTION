const express = require('express');
const Entry = require('../models/Entry');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/enter', auth, async (req,res)=>{
  try{
    const {name,email,phone,transactionId} = req.body;
    if(!name || !email || !phone || !transactionId) return res.status(400).json({msg:'All fields required'});
    const entry = new Entry({ userId:req.user.id, name, email, phone, transactionId });
    await entry.save();
    res.json({msg:'Entry saved', entry});
  }catch(e){
    if(e.code===11000) return res.status(400).json({msg:'Transaction ID already used'});
    res.status(500).json({msg:'Server error'});
  }
});

router.get('/my', auth, async (req,res)=>{
  const entries = await Entry.find({userId:req.user.id}).sort({createdAt:-1});
  res.json({entries});
});

router.get('/all', auth, async (req,res)=>{
  // Admin-only view: use ADMIN_EMAIL env
  if(req.user.email !== process.env.ADMIN_EMAIL){
    return res.status(403).json({msg:'Forbidden'});
  }
  const entries = await Entry.find().sort({createdAt:-1});
  res.json({entries});
});

module.exports = router;
