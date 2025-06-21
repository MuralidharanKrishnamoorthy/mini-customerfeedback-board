const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

router.get("/", feedbackController.getFeedbacks);
router.get("/:id", feedbackController.getFeedbackById);
router.post("/", feedbackController.createFeedback);
router.patch("/:id/upvote", feedbackController.upvoteFeedback);
router.patch("/:id/status", feedbackController.updateStatus);
router.post("/:id/comment", feedbackController.addComment);
router.delete("/:id", feedbackController.deleteFeedback);

module.exports = router;
