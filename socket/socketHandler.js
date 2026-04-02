const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const User = require("../models/User");

const onlineUsers = new Map();

function initSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Socket auth failed"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    onlineUsers.set(String(user._id), {
      socketId: socket.id,
      userId: String(user._id),
      name: user.name,
      email: user.email
    });

    io.emit("onlineUsers", Array.from(onlineUsers.values()));

    socket.on("joinRoom", (roomName) => {
      socket.join(roomName);
    });

    socket.on("privateMessage", async ({ receiverId, text }) => {
      if (!receiverId || !text?.trim()) return;

      const message = await Message.create({
        sender: user._id,
        receiver: receiverId,
        text: text.trim(),
        type: "private"
      });

      const populated = await Message.findById(message._id)
        .populate("sender", "name email")
        .populate("receiver", "name email");

      socket.emit("newPrivateMessage", populated);

      const receiverOnline = onlineUsers.get(String(receiverId));
      if (receiverOnline) {
        io.to(receiverOnline.socketId).emit("newPrivateMessage", populated);
      }
    });

    socket.on("roomMessage", async ({ roomName, text }) => {
      if (!roomName || !text?.trim()) return;

      const message = await Message.create({
        sender: user._id,
        room: roomName,
        text: text.trim(),
        type: "room"
      });

      const populated = await Message.findById(message._id).populate("sender", "name email");
      io.to(roomName).emit("newRoomMessage", populated);
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(String(user._id));
      await User.findByIdAndUpdate(user._id, { lastSeen: new Date() });
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    });
  });
}

module.exports = initSocket;