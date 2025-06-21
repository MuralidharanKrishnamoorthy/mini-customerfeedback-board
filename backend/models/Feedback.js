const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  author: { type: String },
  date: { type: Date, default: Date.now },
});

const FeedbackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["Feature", "Bug", "UI"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "Planned", "In Progress", "Done"],
    default: "Open",
  },
  upvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [commentSchema],
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
