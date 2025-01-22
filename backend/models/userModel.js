const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true
});

userSchema.pre("save", async function(req, res, next){
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }catch(e){
  
}})

userSchema.methods.comparePassword = async function(getPass) {
  return await bcrypt.compare(getPass, this.password,)
}

const User = mongoose.model('User', userSchema);

module.exports = User;
