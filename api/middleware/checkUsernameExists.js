const Users = require("../users/users-model");

const checkUserNameExisits = async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(422).json({ message: "username and password required" });
  } else {
    try {
      const user = await Users.findBy(req.body.username);
      if (!user) {
        res.status(422).json({ message: "Invalid credentials" });
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
  const checkUser = await Users.findBy(req.body.username);
  try {
    if (checkUser) {
      res.status(409).json({ message: "username taken" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkUserNameExisits,
  checkUserNameFree,
};
