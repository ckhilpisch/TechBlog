const router = require("express").Router();
const { Blog, User, Comment } = require("../models");
const withAuth = require("../utils/auth");


// get the home page
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

// get an individual blog with all of comments associated sith it
router.get("/blog/:id", withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const blog = blogData.get({ plain: true });
    const comment = await Comment.findAll(
      {
        where : {
          blog_id: req.params.id,
        },
        include: [
          {
          model : User,
          attributes: ["name"],

          },
        ]
      }
    );

    const usercomments = comment.map((usercomments) => usercomments.get({ plain: true}))
    res.render("eachBlog", {
      blog,
      usercomments,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a comment for a blog
router.post('/comment', async (req, res)=> {
  const user_id = req.session.user_id;
  try {
    const commentData = await Comment.create(
      {
        content: req.body.content,
        user_id: user_id,

      }
    );
    const comment = commentData.get({ plain:true });
    
    res.render('eachblog', {
      ...comment,
      logged_in: req.session.logged_in,
    })
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/comment", (req, res) => {
  if (req.session.logged_in) {
    res.render("comment")
    return;
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

