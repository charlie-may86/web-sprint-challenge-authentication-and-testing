const router = require("express").Router();
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../../config/secrets");

const Users = require("../users/users-model");
const {
  checkUserNameExisits,
  checkUserNameFree,
} = require("../middleware/checkUsernameExists");

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, TOKEN_SECRET, options);
}

router.post("/register", checkUserNameFree, (req, res, next) => {
  let user = req.body;
  if (!user.username || !user.password) {
    res.status(422).json({ message: "username and password required" });
  } else {
    const rounds = process.env.BCRYPT_ROUNDS || 8; // 2 ^ 8
    const hash = bcrypt.hashSync(user.password, rounds);

    user.password = hash;

    Users.add(user)
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch(next);
  }

  // bcrypting the password before saving
  // const rounds = process.env.BCRYPT_ROUNDS || 8; // 2 ^ 8
  // const hash = bcrypt.hashSync(user.password, rounds);

  // user.password = hash;

  // Users.add(user)
  //   .then((newUser) => {
  //     res.status(201).json(newUser);
  //   })
  //   .catch(next); // our custom err handling middleware in server.js will trap this

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`: CHECK********
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,  CHECK*******
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required". CHECK******

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken". CHECK********
  */
});

router.post("/login", checkUserNameExisits, (req, res) => {
  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = buildToken(req.user);
    res.json({
      message: `welcome, ${req.body.username}`,
      token: token,
    });
  } else {
    res.json({ status: 401, message: "invalid credentials" });
  }

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
