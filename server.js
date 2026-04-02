const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const http = require("http");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Socket handler optional load
try {
  const initSocket = require("./socket/socketHandler");
  if (typeof initSocket === "function") {
    initSocket(server);
    console.log("Socket initialized");
  } else {
    console.log("Socket handler found, but not a function");
  }
} catch (error) {
  console.log("Socket handler not loaded:", error.message);
}

// DB connect
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:5500", "http://127.0.0.1:5500"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed for this origin"));
    },
    credentials: true,
  })
);

// API routes
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "ChatNovaX API running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);

// Static frontend files serve
app.use(express.static(path.join(__dirname)));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));

// Main pages routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/otp", (req, res) => {
  res.sendFile(path.join(__dirname, "otp.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "profile.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "chat.html"));
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

// 404 for unknown API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Fallback for frontend routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
