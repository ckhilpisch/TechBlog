const router = require("express").Router();
const { Blog, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get(["/","/home"], async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const blogs = blogData.map((blog) => blog.get({ plain: true }));
    res.render("homepage", {
      blogs,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/blog/:id", withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        { model: Comment,
          attributes: ["content", "user_id"]
        }
      ],
    });

    const blog = blogData.get({ plain: true });

    res.render("blog/:id", {
      ...blog,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/blog:id', async (req, res)=> {
  const user_id = req.session.user_id;
  try {
    const commentData = await Comment.create(
      {
        content: req.body.content,
        user_id: user_id,

      }
    );
    res.status(200).json(commentData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render("dashboard", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("dashboard");
    return;
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("dashboard");
    return;
  }
  res.render("signup");
});


module.exports = router;

// router.get("/logout", (req, res) => {


// });
