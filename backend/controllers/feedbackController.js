const Feedback = require("../models/Feedback");

// GET all feedbacks
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
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
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({ 
        message: "Title, description, and category are required" 
      });
    }
    
    if (!['Feature', 'Bug', 'UI'].includes(category)) {
      return res.status(400).json({ 
        message: "Category must be Feature, Bug, or UI" 
      });
    }
    
    const newFeedback = new Feedback({ title, description, category });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
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
    console.error('Error upvoting feedback:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH update status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validation
    if (!status || !['Open', 'Planned', 'In Progress', 'Done'].includes(status)) {
      return res.status(400).json({ 
        message: "Status must be Open, Planned, In Progress, or Done" 
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
    console.error('Error updating feedback status:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
