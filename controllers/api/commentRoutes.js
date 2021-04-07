const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

//create a comment
router.post("/:id", withAuth, async (req, res) => {
  console.log("Posting comment");
    try {
      const newComment = await Comment.create({
        content: req.body.content,
        blog_id: req.params.id,
        user_id: req.session.user_id,
      });
      res.status(200).json(newComment);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  module.exports = router;