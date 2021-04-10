const router = require("express").Router();
const { Blog, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// get the home page
router.get(["/", "/home"], async (req, res) => {
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

// individual blog with associated comments
router.get("/blog/:id", withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ["name"] }],
        },
      ],
    });

    const blog = blogData.get({ plain: true });
    res.render("blog", {
      blog,
      comments: blog.comments,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get the comments
router.get("/comment/:id", (req, res) => {
  if (req.session.logged_in) {
    res.render("comment", { id: req.params.id });
    return;
  }
});
//get the dashboard with all of the logged in users blogs
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

// login page - redirects to dashboard if already logged in
router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("dashboard");
    return;
  }
  res.render("login");
});

// sign up route
router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("dashboard");
    return;
  }
  res.render("signup");
});

module.exports = router;
