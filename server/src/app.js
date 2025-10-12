const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const userRoutes = require("./routes/user.routes");
const mockinterviewRoutes = require("./routes/mockinterview.routes");
const geminiRoutes = require("./routes/gemini.routes");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/mockinterview", mockinterviewRoutes);
app.use("/api/v1/ai", geminiRoutes);

module.exports = app;