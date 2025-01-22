const mongoose = require("mongoose");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

const registerUser = async(req, res) => {
  const { username, password } = req.body;
  if(!username || !password){
    return res.status(400).json({
      success: false,
      message: "Please fill up the required documents"
    })
  }
  if(username.length < 8 || username.length > 12){
    return res.status(400).json({
      success: false, 
      message: "Username should be at least 8-12 characters"
    })
  }
  if(password.length < 8){
    return res.status(400).json({
      success: false,
      message: "Password should be atleast 8 characters"
    })
  }
  if(req.user){
    return res.status(400).json({
      success: false,
      message: "This username is already taken"
    })
  }
  try {
    const newUser = new User({
      username, password
    });
    newUser.save();
    return res.status(200).json({
      success: true,
      message: "Registered successfully"
    })
  }catch(e){
    return res.status(500).json({
      success: false,
      message: "Network error"
    })
  }
};

const loginUser = async(req, res) => {
  const { username, password } = req.body;
  if(!username || !password){
    return res.status(400).json({
      success: false,
      message: "Please fill up the required documents"
    })
  }
  
  try {
    const isPassMatch = req.user ? await req.user.comparePassword(password) : false;
    if(!isPassMatch || username.length < 8 || username.length > 12 ){
      return res.status(400).json({
      success: false,
      message: "Invalid username or password"
    })
    }
    
    const token = jwt.sign( { id: req.user._id },process.env.JWT_SECRET,{expiresIn: "4h"});
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    })
    return res.status(200).json({
      success: true,
      message: "Logged in successfully"
    })
    
  }catch(e){
   
    return res.status(500).json({
      success: false,
      message: "Network error",
    })
  }
}

const logoutUser = async(req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })
  }catch(e){
    return res.status(500).json({
      success: false,
      message: "Network error",
    })
  }
}

const lookForSession = async(req, res) => {
  try {
    const user = await User.findById(req.decoded, "-password");
    return res.status(200).json({
      success: true,
      user
    })
    }catch(e){
    return res.status(500).json({
      success: false,
      message: "Network Error"
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  lookForSession
}