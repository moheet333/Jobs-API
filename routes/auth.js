const express = require("express");
const router = express.Router();
const { register, login, updateUser } = require("../controllers/auth");
const authenticationMiddleware = require("../middleware/authentication");
const testUser = require("../middleware/testUser");
const rateLimiter = require("express-rate-limit");

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    msg: "Too many requests from this IP, Please try again after 15 minutes",
  },
});

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);
router
  .route("/updateUser")
  .patch(authenticationMiddleware, testUser, updateUser);

module.exports = router;
