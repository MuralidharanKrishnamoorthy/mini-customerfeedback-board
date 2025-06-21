const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const feedbackRoutes = require("./routes/feedbackRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/feedbacks", feedbackRoutes);
app.use("/auth", authRoutes);

module.exports = app;
