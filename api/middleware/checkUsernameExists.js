const Users = require("../users/users-model");

const checkUserNameExisits = async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.json({ status: 422, message: "username and password required" });
  } else {
    try {
      const user = await Users.findBy(req.body.username);
      if (!user) {
        res.json({ status: 422, message: "Invalid credentials" });
      } else {
        req.user = user;
        next();
      }
    } catch (err) {
      next(err);
    }
  }
};

const checkUserNameFree = async (req, res, next) => {
  const user = req.body;
  const checkUser = await Users.findBy(req.body.username);
  if (user.username === checkUser.username) {
    res.json({ message: "username taken" });
  } else {
    next();
  }
};

module.exports = {
  checkUserNameExisits,
  checkUserNameFree,
};
