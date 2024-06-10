const jwt = require("jsonwebtoken");

const generateSing = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "30d" });
}

const verifySing = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
}

module.exports = { generateSing, verifySing }