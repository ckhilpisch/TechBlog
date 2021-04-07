const router = require("express").Router();
const { User } = require("../../models");

//creating a user
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//login in route for user
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.name = userData.name;

      res.json({ user: userData, message: "Logged in, my friend!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//creating a signup
router.post("/signup", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (userData) {
      res.status(400).json({ message: "Email already exists in our system" });
      return;
    } else if (!userData) {

      
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      user.save().then((result) => {
        console.log(result);
        req.session.logged_in = true;
        req.session.user_id = user.id;
        req.session.name = user.name
        console.log(user);
        res.status(200).json({
          message: "User created",
        });
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});
//logout route
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

//getting logged in users information
router.get("/user_data", (req, res) => {
  console.log(req.session);
  if (!req.session) {
    res.json(null);
  } else {
    res.json({
      id: req.session.user_id,
      name: req.session.name,
    });
  }
});

module.exports = router;
