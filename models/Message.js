const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    room: { type: String, default: "" },
    text: { type: String, required: true, trim: true },
    type: { type: String, enum: ["private", "room"], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);