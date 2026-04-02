const express = require("express");
const Message = require("../models/Message");
const Room = require("../models/Room");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/private/:userId", protect, async (req, res) => {
  try {
    const myId = req.user._id;
    const otherId = req.params.userId;

    const messages = await Message.find({
      type: "private",
      $or: [
        { sender: myId, receiver: otherId },
        { sender: otherId, receiver: myId }
      ]
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch private messages" });
  }
});

router.get("/rooms", protect, async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch rooms" });
  }
});

router.post("/rooms", protect, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Room name required" });
    }

    const cleanName = name.trim();
    const exists = await Room.findOne({ name: cleanName });
    if (exists) {
      return res.status(400).json({ success: false, message: "Room already exists" });
    }

    const room = await Room.create({ name: cleanName, createdBy: req.user._id });
    res.status(201).json({ success: true, room, message: "Room created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create room" });
  }
});

router.get("/rooms/:roomName", protect, async (req, res) => {
  try {
    const messages = await Message.find({ type: "room", room: req.params.roomName })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch room messages" });
  }
});

module.exports = router;