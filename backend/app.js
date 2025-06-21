// backend/app.js
const express = require("express");
const cors = require("cors");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/feedbacks", feedbackRoutes);

module.exports = app;
