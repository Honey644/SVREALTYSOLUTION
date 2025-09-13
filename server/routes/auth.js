const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req,res)=>{
  const {name,email,password} = req.body;
  try{
    let u = await User.findOne({email});
    if(u) return res.status(400).json({msg:'User already exists'});
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    u = new User({name,email,password:hash});
    await u.save();
    res.json({msg:'User registered'});
  }catch(e){ res.status(500).json({msg:'Server error'}); }
});

router.post('/login', async (req,res)=>{
  const {email,password} = req.body;
  try{
    const u = await User.findOne({email});
    if(!u) return res.status(400).json({msg:'Invalid credentials'});
    const ok = await bcrypt.compare(password, u.password);
    if(!ok) return res.status(400).json({msg:'Invalid credentials'});
    const token = jwt.sign({id:u._id,email:u.email}, process.env.JWT_SECRET, {expiresIn:'2h'});
    res.json({token, user:{id:u._id, name:u.name, email:u.email}});
  }catch(e){ res.status(500).json({msg:'Server error'}); }
});

router.get('/me', async (req,res)=>{
  res.json({ok:true});
});

module.exports = router;
