const jwt = require("jsonwebtoken");

//middleware to check if the user is authenticated
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(401);

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;

    next();
  });
}

//middleware to check if the user is admin or not

function roleAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    req.status(403).json({ message: "Request Denied: Admin Only" });
  }
}

module.exports = {
  authenticateToken,
  roleAdmin,
};
