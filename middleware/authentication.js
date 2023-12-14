const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { UnauthenticatedError } = require("../errors/index");

const authenticationMiddleware = async (req, res, next) => {
  const requestHeader = req.headers.authorization;
  if (!requestHeader || !requestHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Please provide token");
  }
  const token = requestHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, name } = decoded;
    req.user = { userId: userId, name: name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid Token");
  }
};

module.exports = authenticationMiddleware;
