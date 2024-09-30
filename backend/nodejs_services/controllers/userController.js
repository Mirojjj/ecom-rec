const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function userSignup(req, res) {
  const { username, email, password, confirmPassword } = req.body;

  try {
    if (!username || !email || !password || !confirmPassword) {
      res.status(400);
      throw new Error("Please Enter all the Fields!");
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords Do not match!");
    }

    const userAlreadyExists = await User.findOne({ username });
    if (userAlreadyExists) {
      res.status(400);
      throw new Error("Username already registered");
    }

    const emailAlreadyExists = await User.findOne({ email });

    if (emailAlreadyExists) {
      res.status(400);
      throw new Error("Email already registered");
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
}

async function userLogin(req, res) {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid Credentials");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).send("Server Error");
  }
}

module.exports = {
  userSignup,
  userLogin,
};
