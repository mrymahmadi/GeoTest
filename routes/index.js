const router = require("express").Router();
const point = require("./Coordinates");

router.use("/maps", point);

module.exports = router;
