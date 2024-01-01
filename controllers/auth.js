const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = await user.getToken();
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName, // default initially
      location: user.location, // default initially
      name: user.name,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password both.");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid email");
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid password");
  }
  const token = await user.getToken();

  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName, // default initially
      location: user.location, // default initially
      name: user.name,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequest("Please provide all values");
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    {
      email: email,
      name: name,
      lastName: lastName,
      location: location,
    },
    {
      new: true,
    }
  );
  const token = await user.getToken();
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

module.exports = {
  register,
  login,
  updateUser,
};
