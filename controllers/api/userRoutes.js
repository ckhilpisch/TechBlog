const router = require('express').Router();
const { User } = require('../../models');



router.post('/', async (req, res) => {
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

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.name =userData.name;
      
      res.json({ user: userData, message: 'Logged in, my friend!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.get("/user_data", (req, res) => {
  console.log(req.session);
  if (!req.session) {
  
    // The user is not logged in, send back an empty object
    res.json(null);
  } else {
    
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      id: req.session.user_id,
      name: req.session.name
    });
  }
});

module.exports = router;
