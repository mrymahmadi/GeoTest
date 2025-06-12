const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Point = new Schema({
  // موقعیت جغرافیایی به صورت GeoJSON Point
  location: {
    type: {
      type: String,
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [lon, lat]
      required: true,
      validate: (arr) => arr.length === 2,
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

Point.index({ location: "2dsphere" });
module.exports = mongoose.model("Point", Point);
