const router = require("express").Router();
const { Comment, Blog } = require("../../models");
const withAuth = require("../../utils/auth");


router.post("/comment", withAuth, async (req, res) => {
    try {
        res.json(req.body);
      const newComment = await Comment.create({
        content: req.body.content,
        blog_id: req.body.blog_id,
        user_id: req.body.user_id,
      });
      res.status(200).json(newComment);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//   router.post("/:id", async (req, res) => {
//     const userID = req.session.user_id;
//     try {
//       const newComment = await Comment.create({
//         content: req.body.content,
//         blog_id: req.body.blog_id,
//         user_id: req.body.userID,
//         date_created: req.body.date_created,
//       });
//       res.status(200).json(newComment);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });