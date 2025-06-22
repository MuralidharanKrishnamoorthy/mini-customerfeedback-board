const Feedback = require("../models/Feedback");

// GET all feedbacks with optional filters
exports.getFeedbacks = async (req, res) => {
  try {
    const { status, category, sort, search, createdBy } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; // case-insensitive search
    }
    if (createdBy) filter.createdBy = createdBy;

    const sortOptions = {};
    if (sort === "upvotes") sortOptions.upvotes = -1;
    else sortOptions.createdAt = -1; // default: newest first

    const feedbacks = await Feedback.find(filter)
      .populate('createdBy', 'username')
      .populate('comments.user', 'username')
      .populate('comments.replies.createdBy', 'username')
      .sort(sortOptions);
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET single feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('comments.user', 'username')
      .populate('comments.replies.createdBy', 'username');
      
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
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Title, description, and category are required",
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
      createdBy: req.user.id,
    });

    await newFeedback.save();
    
    // Populate the user information before sending response
    const populatedFeedback = await Feedback.findById(newFeedback._id)
      .populate('createdBy', 'username')
      .populate('comments.user', 'username')
      .populate('comments.replies.createdBy', 'username');
      
    res.status(201).json(populatedFeedback);
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

    // Check if user has already upvoted
    const userId = req.user.id;
    const hasUpvoted = feedback.upvotedBy.includes(userId);
    
    if (hasUpvoted) {
      return res.status(400).json({ 
        message: "You have already upvoted this feedback",
        hasUpvoted: true 
      });
    }

    // Add user to upvotedBy array and increment upvotes
    feedback.upvotedBy.push(userId);
    feedback.upvotes += 1;
    await feedback.save();

    // Populate the user information before sending response
    const populatedFeedback = await Feedback.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('comments.user', 'username')
      .populate('comments.replies.createdBy', 'username');

    res.json(populatedFeedback);
  } catch (error) {
    console.error("Error upvoting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH downvote
exports.downvoteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    const userId = req.user.id;
    const userIndex = feedback.upvotedBy.indexOf(userId);
    
    if (userIndex === -1) {
      return res.status(400).json({ 
        message: "You have not upvoted this feedback",
        hasUpvoted: false
      });
    }

    // Remove user from upvotedBy array and decrement upvotes
    feedback.upvotedBy.splice(userIndex, 1);
    feedback.upvotes -= 1;
    await feedback.save();

    const populatedFeedback = await Feedback.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('comments.user', 'username')
      .populate('comments.replies.createdBy', 'username');

    res.json(populatedFeedback);
  } catch (error) {
    console.error("Error downvoting feedback:", error);
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
    const { text } = req.body;
    console.log('AddComment - Request body:', req.body);
    console.log('AddComment - User from req.user:', req.user);

    if (!text) {
      return res.status(400).json({ message: "text is required" });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.comments.push({ 
      user: req.user.id, 
      text, 
      author: req.user.username || 'Anonymous'
    });
    await feedback.save();

    // Populate the user information before sending response
    const populatedFeedback = await Feedback.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('comments.user', 'username');

    res.status(201).json(populatedFeedback);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST a reply to a comment (user or admin)
exports.addReplyToComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'text is required' });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const comment = feedback.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const newReply = { text };
    if (req.user.role === 'admin') {
      newReply.author = 'Admin';
    } else {
      newReply.createdBy = req.user.id;
    }

    comment.replies.push(newReply);
    await feedback.save();

    const populatedFeedback = await Feedback.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('comments.user', 'username')
      .populate('comments.replies.createdBy', 'username');

    res.status(201).json(populatedFeedback);
  } catch (error) {
    console.error("Error adding reply to comment:", error);
    res.status(500).json({ message: 'Failed to add reply', error: error.message });
  }
};

// DELETE a feedback item (owner only)
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Ensure the user deleting the feedback is the one who created it
    if (feedback.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized to delete this feedback" });
    }

    await feedback.deleteOne();

    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
