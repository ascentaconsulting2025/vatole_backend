const express = require("express");
const router = express.Router();
const HistoricalData = require("../models/HistoricalData");
const auth = require("../middleware/auth");

// @route   GET /api/historical
// @desc    Get historical data
// @access  Public
router.get("/", async (req, res) => {
  try {
    let historicalData = await HistoricalData.findAll();

    if (!historicalData) {
      historicalData = { events: [], places: [] };
    }

    res.json({
      success: true,
      data: historicalData,
    });
  } catch (error) {
    console.error("Get historical data error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching historical data",
      error: error.message,
    });
  }
});

// @route   POST /api/historical
// @desc    Create or update historical data
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { events, places } = req.body;

    // Save historical data (model handles delete and insert)
    const historicalData = await HistoricalData.saveAll(
      events || [],
      places || []
    );

    res.json({
      success: true,
      message: "Historical data saved successfully",
      data: historicalData,
    });
  } catch (error) {
    console.error("Save historical data error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving historical data",
      error: error.message,
    });
  }
});

module.exports = router;
