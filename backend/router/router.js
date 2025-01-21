const mongoose = require("mongoose");
const User = require("../models/userModel.js");
const express = require("express");
const jwt = require("jsonwebtoken");
const { registerUser, loginUser, logoutUser, lookForSession } = require("../controllers/userController.js");
const { getAllNotes, getSpecificNote, postNote, updateNote, deleteNotes, updateNotes, getArchivedNotes } = require("../controllers/noteController.js");

const router = express.Router();


const isUserExisting = async(req, res, next) => {
  const { username } = req.body; 
  try {
    const user = await User.findOne({ username });
    req.user = user;
  }catch(e){
    return res.status(500).json({
      success: false,
    
      message: "Network error"
    })
  }
  next();
}

const verifyMongooseId = (req, res, next) => {
  const userId = req.query.userId || req.body.userId 

  if(!mongoose.Types.ObjectId.isValid(userId)){
    return res.status(400).json({
      success: false,
      message: "Invalid User or Note Id"
    })
  }
  next();
}

const verifyToken = async(req, res, next) => {
  const token = req.cookies.token;
  if(!token){
    return res.status(404).json({
      success: false,
      message: "No token found"
    })
  }
  console.log({token})
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      console.log({decoded});
      req.decoded = decoded.id
      next();
    }catch(e){
      console.log({e})
      return res.status(500).json({
        success: false,
        message: "Invalid token"
      })
    }
    
    
 
  
}

router.post("/register", isUserExisting, registerUser);
router.post("/login", isUserExisting, loginUser);
router.get("/logout", logoutUser);
router.get("/checksession", verifyToken,lookForSession);
router.get("/all/notes", verifyMongooseId, getAllNotes);
router.get("/archive/notes", verifyMongooseId, getArchivedNotes);
router.get("/specific/note/:id", verifyMongooseId, getSpecificNote);
router.post("/add/note", verifyMongooseId, postNote);
router.put("/update/note/:id", verifyMongooseId, updateNote);
router.delete("/delete/notes", deleteNotes)
router.put("/update/notes", updateNotes)

module.exports = router;