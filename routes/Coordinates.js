const CoordinatesCtrl = require("../src/controller/CoordinatesController");
const rateLimit = require("../src/middlewares/rateLimit");
const express = require("express");
const router = express.Router();

router.post("/addPoint", CoordinatesCtrl.newPoint);
router.post("/addPolygon", CoordinatesCtrl.addPolygon);
router.post("/addCircle", CoordinatesCtrl.saveCircle);
router.post("/addLineString", CoordinatesCtrl.addLinestring);

module.exports = router;
