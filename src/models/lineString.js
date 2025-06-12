const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lineString = new Schema({
  path: {
    type: {
      type: String,
      default: "LineString",
      required: true,
    },
    coordinates: {
      type: [[Number]],
      required: true,
      validate: (arr) => Array.isArray(arr) && arr.length >= 2,
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
lineString.index({ path: "2dsphere" });
module.exports = mongoose.model("lineString", lineString);
