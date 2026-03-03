const express = require("express");
const router = express.Router();
const GrampanchayatInfo = require("../models/GrampanchayatInfo");
const auth = require("../middleware/auth");

// @route   GET /api/grampanchayat
// @desc    Get grampanchayat info
// @access  Public
router.get("/", async (req, res) => {
  try {
    let info = await GrampanchayatInfo.find();

    if (!info) {
      return res.json({
        success: true,
        data: null,
      });
    }

    res.json({
      success: true,
      data: info,
    });
  } catch (error) {
    console.error("Get grampanchayat info error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching grampanchayat info",
      error: error.message,
    });
  }
});

// @route   POST /api/grampanchayat
// @desc    Create or update grampanchayat info
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    // Save grampanchayat info (model handles delete and insert)
    const info = await GrampanchayatInfo.save(req.body);

    res.json({
      success: true,
      message: "Grampanchayat info saved successfully",
      data: info,
    });
  } catch (error) {
    console.error("Save grampanchayat info error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving grampanchayat info",
      error: error.message,
    });
  }
});

module.exports = router;
