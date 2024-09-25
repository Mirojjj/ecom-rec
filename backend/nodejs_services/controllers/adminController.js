const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//creating a mock admin user
const adminUsers = [
  {
    username: "admin",
    password: "$2b$10$WuHNNwW1.sapEZcBh7y7Ce55fyl.cj.aibLEgaUMhJtpT5P.W24Tq",
    role: "admin",
  },
];

async function adminLogin(req, res) {
  const { username, password } = req.body;

  try {
    const user = await adminUsers.find((u) => u.username === username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET, //secret key
        { algorithm: "HS256", expiresIn: "1h" }
      );
      console.log("password matched");
      return res.status(200).json({ accessToken });
    } else {
      console.log("password not matched");
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { adminLogin };
