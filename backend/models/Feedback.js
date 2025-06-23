const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  author: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  author: { type: String },
  date: { type: Date, default: Date.now },
  reply: {
    text: { type: String },
    author: { type: String, default: "Admin" },
    date: { type: Date }
  },
  replies: [ReplySchema]
});

const FeedbackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["Feature", "Bug", "UI", "Other"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "Planned", "In Progress", "Done"],
    default: "Open",
  },
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [CommentSchema],
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
