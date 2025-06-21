const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("Feedback", FeedbackSchema);