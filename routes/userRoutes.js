const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/all", protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id }, isVerified: true }).select("name email profilePic gender country state bio lastSeen");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

router.put("/profile", protect, async (req, res) => {
  try {
    const { name, profilePic, gender, country, state, bio } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = name ?? user.name;
    user.profilePic = profilePic ?? user.profilePic;
    user.gender = gender ?? user.gender;
    user.country = country ?? user.country;
    user.state = state ?? user.state;
    user.bio = bio ?? user.bio;
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        gender: user.gender,
        country: user.country,
        state: user.state,
        bio: user.bio,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
});

module.exports = router;