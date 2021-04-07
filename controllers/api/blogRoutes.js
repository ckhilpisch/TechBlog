const router = require("express").Router();
const { Blog, User, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

router.post("/", withAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name", "id"],
        },

        {
          model: Comment,
          attributes: ["content", "date_created", "user_id"],
          include: {
            model: User,
            attributes: ["name", "id"],
          },
        },
      ],
    });

    if (!blogData) {
      res.status(404).json({
        message: "This blog does not exist",
      });

      console.log("IDOSFDKSLFDKLSFKDLS", blogData);
      return;
    }
    res.status(200).json(blogData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const blogData = await Blog.findOne({
//       where: {
//         id: req.params.id,
//       },
//       attributes: ["id", "content", "name", "date_created"],
//       include: [
//         { model: User, attributes: ["name"] },
//         {
//           model: Comment,
//           attributes: ["id", "content", "user_id", "blog_id", "date_created"],
//           include: {
//             model: User,
//             attributes: ["name"],
//           },
//         },
//       ],

//     });

//     if (!blogData) {
//       res.status(404).json({
//         message: "This blog does not exist",
//       });

//      console.log("IDOSFDKSLFDKLSFKDLS", blogData);
//       return;

//     }
//     res.status(200).json(blogData);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });



router.delete("/:id", withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: "That blog does not live here!" });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
