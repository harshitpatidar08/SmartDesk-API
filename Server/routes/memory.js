const express = require("express");
const router = express.Router();
const Memory = require("../models/Memory");

// Get memory by sessionId
router.get("/:sessionId", async (req, res) => {
  try {
    const memory = await Memory.findOne({ sessionId: req.params.sessionId });
    res.json(memory || { summary: "", issueHistory: [] });
  } catch (error) {
    console.error("Memory GET error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update memory after each conversation
router.post("/:sessionId", async (req, res) => {
  try {
    const { summary, issue } = req.body;

    const memory = await Memory.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      {
        $set: { summary, lastSeen: Date.now() },
        $push: { issueHistory: { $each: [issue], $slice: -10 } },
      },
      { upsert: true, returnDocument: "after" }
    );

    res.json(memory);
  } catch (error) {
    console.error("Memory POST error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;