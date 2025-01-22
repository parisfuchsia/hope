const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/index.js");
const router = require("./router/router.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.ORIGIN_URL,
  credentials: true
}));

app.use(cookieParser());
app.use("/", router);

const PORT = process.env.SECRET_PORT 

connectDb().then(() => {
  console.log("Database connected successfully");
}).catch((error) => {
  console.error("Database connection failed:", error);
});

module.exports = (req, res) => {
  app(req, res); 
};
