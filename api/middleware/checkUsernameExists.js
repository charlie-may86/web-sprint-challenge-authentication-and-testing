const Users = require("../users/users-model");

const checkUserNameExisits = async (req, res, next) => {
  try {
    const user = await Users.findBy(req.body.username);
    if (!user) {
      next({ status: 422, message: "Invalid credentials" });
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkUserNameExisits,
};
