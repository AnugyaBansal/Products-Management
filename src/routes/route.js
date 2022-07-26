const express = require("express");
const router = express.Router();

const {
  createUser,
  getUserById,
  updateUserById,
  login,
} = require("../controllers/userController");

const { authentication, authorization } = require("../middleware/auth");

// User APIs.
router.post("/register", createUser);

router.post("/login", login);

router.get("/user/:userId/profile", authentication, getUserById);

router.put(
  "/user/:userId/profile",
  authentication,
  authorization,
  updateUserById
);

//----------------If api is invalid OR wrong URL-------------------------
router.all("/**", function (req, res) {
  res
    .status(404)
    .send({ status: false, msg: "Requested API is not available" });
});

module.exports = router;
