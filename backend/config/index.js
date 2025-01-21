const mongoose = require("mongoose");

const connectDb = async() => {
  try {
    await mongoose.connect("mongodb+srv://liammagat8:6IAcF1MCs3GVSNIe@cluster0.pubik.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("connected");
  }catch(e){
    console.log("db error", e.message)
  }
}

module.exports = connectDb;