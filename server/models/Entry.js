const mongoose = require('mongoose');
const EntrySchema = new mongoose.Schema({
  userId:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  name:{type:String, required:true},
  email:{type:String, required:true},
  phone:{type:String, required:true},
  transactionId:{type:String, required:true, unique:true},
  status:{type:String, default:'Submitted'}
},{timestamps:true});
module.exports = mongoose.model('Entry', EntrySchema);
