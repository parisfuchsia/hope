const mongoose = require("mongoose");
const Note = require("../models/noteModel.js");



const getAllNotes = async(req, res) => {
  const { userId } = req.query; 
  try {
    const notes = await Note.find({ userId });
    return res.status(200).json({
      success: true,
      notes,
    })
  }catch(e){
    return res.status(500).json({
      success: false,
      message: "Network error"
    })
  }
}

const getArchivedNotes = async(req, res) => {
  const { userId } = req.query; 
  try {
    const notes = await Note.find({ noteType: "ARCHIVE", userId });
    return res.status(200).json({
      success: true,
      message: "Got archived notes successfully",
      notes
    })
  }catch(e){
    return res.status(500).json({
      success: false, 
      message: "Network Error"
    })
  }
}

const getSpecificNote = async(req, res) => {
  const { userId } = req.query;
  const noteId = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(noteId)){
    return res.status(404).json({
      success: false,
      message: "Invalid Note Id"
    })
  }
  try {
    const notes = await Note.findOne({ userId, _id: noteId });
    return res.status(200).json({
      success: true,
      notes
    })
  }catch(e){
    return res.status(500).json({
      success: false,
      message: "Network error"
    })
  }
}

const postNote = async(req, res) => {
  const { note, title, userId } = req.body;
  if(!note || !title){
    return res.status(400).json({
      success: false,
      message: "Note can't be empty"
    })
  }
  try {
    const newNote = new Note({ note, title, userId });
    await newNote.save();
    return res.status(201).json({
      success: true
    })
  }catch(e){
    return res.status(500).json({
      success: false,
      message: "Network error",
      err: e.message
    })
  }
};

const updateNote = async(req, res) => {
  const { userId, note, title } = req.body;
  
  if(!userId){
    return res.status(401).json({
      success: false,
      message: "User not found"
    })
  }
  
  if(!note || !title){
    return res.status(401).json({
      success: false,
      message: "Note can't be empty"
    })
  }
  
  const noteId = req.params.id;
  const updatedData = { note, title };
  
  try {
   const result = await Note.updateOne({ _id: noteId, userId }, updatedData, {new: true});
   if(result.nModified === 0){
     return res.status(404).json({
      success: false, 
      message: "Something unexpected happened. Please try again"
    })
   }
    return res.status(200).json({
      success: true, 
      message: "Edited successfully"
    })
  }catch(e){
    return res.status(500).json({
      success: false, 
      message: "Network error"
    })
  }
}

const deleteNotes = async(req, res) => {
  const { selectedIds } = req.query;
  if(!selectedIds){
    return res.status(401).json({
      success: false,
      message: "No notes found"
    })
  }
  try {
    const response = await Note.deleteMany({ _id: {
      $in: [...selectedIds]
    }});
    
    return res.status(200).json({
      success: true,
      message: "Deleted Successfully"
    })
  }catch(e){
    return res.status(500).json({
      success: false,
      message: "Network Error",
      e: e.message
    })
  }
}
const updateNotes = async(req, res) => {
  const { selectedIds, changeTo } = req.body;

  if(!selectedIds){
    return res.status(401).json({
      success: false,
      message: "No notes found"
    })
  }
  try {
    const response = await Note.updateMany({ _id: {
      $in: [...selectedIds]
    }}, { noteType: changeTo });
    
    return res.status(200).json({
      success: true,
      message: "Updated Successfully"
    })
  }catch(e){
    return res.status(500).json({
      success: false,
      message: "Network Error",
      e: e.message
    })
  }
}

module.exports = {
  getAllNotes,
  getSpecificNote,
  postNote,
  updateNote,
  deleteNotes,
  updateNotes,
  getArchivedNotes
}
