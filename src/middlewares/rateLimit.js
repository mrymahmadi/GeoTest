const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 4,
  message: "Too many requests from this IP, please try again later.",
  handler: (req, res) => {
    res.status(429).send("Too many requests from this IP, you are blocked.");
  },
});

module.exports = limiter;
