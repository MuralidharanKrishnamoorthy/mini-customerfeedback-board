const Feedback = require("../models/Feedback");

// GET all feedbacks with optional filters
exports.getFeedbacks = async (req, res) => {
  try {
    const { status, category, sort, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; // case-insensitive search
    }

    const sortOptions = {};
    if (sort === "upvotes") sortOptions.upvotes = -1;
    else sortOptions.createdAt = -1; // default: newest first

    const feedbacks = await Feedback.find(filter).sort(sortOptions);
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET single feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST new feedback (user-only)
exports.createFeedback = async (req, res) => {
  try {
    const { title, description, category, userId } = req.body;

    if (!title || !description || !category || !userId) {
      return res.status(400).json({
        message: "Title, description, category, and userId are required",
      });
    }

    if (!["Feature", "Bug", "UI"].includes(category)) {
      return res.status(400).json({
        message: "Category must be Feature, Bug, or UI",
      });
    }

    const newFeedback = new Feedback({
      title,
      description,
      category,
      createdBy: userId,
    });

    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH upvote
exports.upvoteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.upvotes += 1;
    await feedback.save();
    res.json(feedback);
  } catch (error) {
    console.error("Error upvoting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH update status (admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["Open", "Planned", "In Progress", "Done"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Open, Planned, In Progress, or Done",
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json(feedback);
  } catch (error) {
    console.error("Error updating feedback status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST a comment (user or admin)
exports.addComment = async (req, res) => {
  try {
    const { userId, text, author } = req.body;

    if (!userId || !author || !text) {
      return res.status(400).json({ message: "userId, author, and text are required" });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.comments.push({ user: userId, text, author });
    await feedback.save();

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE feedback (admin)
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
