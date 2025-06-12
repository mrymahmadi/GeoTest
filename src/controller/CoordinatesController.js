const { error } = require("console");
const Point = require("../models/point");
const Polygon = require("../models/polygon");
const Circle = require("../models/circle");
const lineString = require("../models/lineString");

const proj4 = require("proj4");

proj4.defs("EPSG:32639", "+proj=utm +zone=39 +datum=WGS84 +units=m +no_defs");

class CoordinatesCtrl {
  // ✅

  newPoint = async (req, res) => {
    try {
      const { lon, lat } = req.body;

      if (typeof lon !== "number" || typeof lat !== "number") {
        return res.status(400).json({
          response: "مختصات وارد شده فرمت درستی ندارند.",
        });
      }

      const [convertedLon, convertedLat] = proj4("EPSG:32639", "WGS84", [
        lon,
        lat,
      ]);

      const addPoint = new Point({
        location: {
          type: "Point",
          coordinates: [convertedLon, convertedLat],
        },
      });

      await addPoint.save();
      return res
        .status(201)
        .json({ response: "نقطه جدید با موفقیت ثبت شد", data: addPoint });
    } catch (err) {
      console.error("error for this act:", err);
      return res.status(500).json({ response: "خطای سرور" });
    }
  };

  addPolygon = async (req, res) => {
    // ✅

    try {
      let { coordinates } = req.body;
      if (!Array.isArray(coordinates) || coordinates.length === 0) {
        return res
          .status(400)
          .json({ response: "ورودی باید یک ارایه از چند مختصات باشد" });
      }

      function isClose(a, b, epsilon = 0.0001) {
        return Math.abs(a - b) < epsilon;
      }

      function isRingClosed(rings) {
        if (!Array.isArray(rings) || rings.length < 4) return false;
        const [lon1, lat1] = rings[0];
        const [lon2, lat2] = rings[rings.length - 1];
        return isClose(lon1, lon2) && isClose(lat1, lat2);
      }

      const outerRing = coordinates[0];
      if (!isRingClosed(outerRing)) {
        return res.status(400).json({
          response:
            "مختصات اولیه با مختصات آخر مساوی نیست. این فرمت  قانون ثبت محدوده است.",
        });
      }

      coordinates = coordinates.map((rings) =>
        rings.map(([x, y]) => {
          const [lon, lat] = proj4("EPSG:32639", "WGS84", [x, y]);
          return [lon, lat];
        })
      );
      const polygon = new Polygon({
        area: {
          type: "Polygon",
          coordinates: coordinates,
        },
      });

      await polygon.save();
      return res
        .status(201)
        .json({ response: "محدوده جدید با موفقیت اضافه شد", data: polygon });
    } catch (err) {
      console.error(" add polygon error: ", err);
      return res.status(500).json({ response: "خطای سرور", err });
    }
  };

  saveCircle = async (req, res) => {
    // ✅
    try {
      const { lon, lat, radius } = req.body;

      if (!lon || !lat || !radius) {
        return res
          .status(400)
          .json({ response: "دیتاهای مورد انتظار دریافت نشد" });
      }

      const [convertLon, convertLat] = proj4("EPSG:32639", "WGS84", [lat, lon]);

      const addCircle = new Circle({
        center: {
          type: "Point",
          coordinates: [convertLon, convertLat],
        },
        radius,
      });
      await addCircle.save();
      return res
        .status(201)
        .json({ response: "با موفقیت ثبت شد", data: addCircle });
    } catch (err) {
      console.error("error for addCircle act: ", err);
      return res.status(500).json({ response: " خطای سرور" });
    }
  };

  addLinestring = async (req, res) => {
    // ✅
    try {
      let { coordinates } = req.body;

      if (!coordinates) {
        return res
          .status(400)
          .json({ response: "مقادیر مورد انتظار وارد دریافت نشد" });
      }

      if (!Array.isArray(coordinates) || coordinates.length < 2) {
        return res
          .status(400)
          .json({ response: "ورودی باید یک ارایه از چند مختصات باشد" });
      }
      const convertedCoordinates = coordinates.map(([x, y]) => {
        const [lon, lat] = proj4("EPSG:32639", "WGS84", [x, y]);
        return [lon, lat];
      });

      const newLineStr = new lineString({
        path: {
          type: "LineString",
          coordinates: convertedCoordinates,
        },
      });

      await newLineStr.save();
      return res.status(201).json({ response: "مسیر جدید اضافه شد" });
    } catch (err) {
      console.error("newLineStr error this: ", err);
      return res.status(500).json({ response: "خطای سرور" });
    }
  };
}

module.exports = new CoordinatesCtrl();
