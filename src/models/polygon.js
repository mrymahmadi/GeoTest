const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Polygon = new Schema({
  area: {
    type: {
      type: String,
      default: "Polygon",
      required: true,
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
      validate: (rings) => Array.isArray(rings) && rings.length > 0,
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  vehicleId: {
    type: String,
  },
});
Polygon.index({ area: "2dsphere" });
module.exports = mongoose.model("Polygon", Polygon);
