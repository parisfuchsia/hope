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
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());

app.use("/", router);

const PORT = process.env.SECRET_PORT;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Live at http://localhost:${PORT}`);
  });
}).catch(() => {
  console.log("error hoy db")
})

