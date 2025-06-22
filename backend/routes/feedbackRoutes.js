const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const auth = require("../middlewares/auth");

router.get("/", feedbackController.getFeedbacks);
router.post("/", auth, feedbackController.createFeedback);
router.get("/user/my-upvoted", auth, feedbackController.getMyUpvotedFeedbacks);
router.get("/:id", feedbackController.getFeedbackById);
router.delete("/:id", auth, feedbackController.deleteFeedback);

router.post('/:id/upvote', auth, feedbackController.upvoteFeedback);
router.post('/:id/remove-upvote', auth, feedbackController.removeUpvote);
router.put('/:id/status', auth, feedbackController.updateStatus);
router.post('/:id/comments/:commentId/reply', auth, feedbackController.addReplyToComment);
router.post('/:id/comments', auth, feedbackController.addComment);

module.exports = router;
