const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const auth = require("../middlewares/auth");

router.get("/", feedbackController.getFeedbacks);
router.post("/", auth, feedbackController.createFeedback);
router.get("/:id", feedbackController.getFeedbackById);
router.delete("/:id", auth, feedbackController.deleteFeedback);

router.post('/:id/upvote', auth, feedbackController.upvoteFeedback);
router.post('/:id/downvote', auth, feedbackController.downvoteFeedback);
router.put('/:id/status', auth, feedbackController.updateStatus);
router.post('/:id/comments', auth, feedbackController.addComment);
router.post('/:id/comments/:commentId/reply', auth, feedbackController.addReplyToComment);

// Delete routes for comments and replies
router.delete('/:feedbackId/comments/:commentId', auth, feedbackController.deleteComment);
router.delete('/:feedbackId/comments/:commentId/replies/:replyId', auth, feedbackController.deleteReply);

module.exports = router;
