const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Circle = Schema({
  center: {
    type: {
      type: String,
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: (arr) => arr.length === 2 || arr.length === 0,
    },
  },
  radius: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
Circle.index({ center: "2dsphere" });
module.exports = mongoose.model("Circle", Circle);
