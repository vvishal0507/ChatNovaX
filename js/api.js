const API_BASE = (() => {
  const host = window.location.hostname;
  const origin = window.location.origin;

  if (host.includes("onrender.com") || (host !== "127.0.0.1" && host !== "localhost")) {
    return `${origin}/api`;
  }

  return "http://localhost:5000/api";
})();

async function apiRequest(url, method = "GET", data = null, token = "") {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${url}`, options);

    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      result = {
        success: false,
        message: "Invalid JSON response from server",
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: result.message || `Request failed with status ${response.status}`,
        status: response.status,
        data: result,
      };
    }

    return result;
  } catch (error) {
    console.error("apiRequest error:", error);
    return {
      success: false,
      message: "Unable to connect to server",
      error: error.message,
    };
  }
}

const AuthAPI = {
  register(userData) {
    return apiRequest("/auth/register", "POST", userData);
  },

  verifyOtp(email, otp) {
    return apiRequest("/auth/verify-otp", "POST", { email, otp });
  },

  resendOtp(email) {
    return apiRequest("/auth/resend-otp", "POST", { email });
  },

  login(email, password) {
    return apiRequest("/auth/login", "POST", { email, password });
  },

  forgotPassword(email) {
    return apiRequest("/auth/forgot-password", "POST", { email });
  },

  resetPassword(email, otp, newPassword) {
    return apiRequest("/auth/reset-password", "POST", { email, otp, newPassword });
  },
};

const UserAPI = {
  getProfile(token) {
    return apiRequest("/users/profile", "GET", null, token);
  },

  updateProfile(token, userData) {
    return apiRequest("/users/profile", "PUT", userData, token);
  },

  getAllUsers(token) {
    return apiRequest("/users", "GET", null, token);
  },
};

const ChatAPI = {
  getMessages(token, roomId = "") {
    const url = roomId
      ? `/chat/messages?roomId=${encodeURIComponent(roomId)}`
      : "/chat/messages";
    return apiRequest(url, "GET", null, token);
  },

  sendMessage(token, messageData) {
    return apiRequest("/chat/messages", "POST", messageData, token);
  },

  getRooms(token) {
    return apiRequest("/chat/rooms", "GET", null, token);
  },

  createRoom(token, roomData) {
    return apiRequest("/chat/rooms", "POST", roomData, token);
  },

  getOnlineUsers(token) {
    return apiRequest("/chat/online-users", "GET", null, token);
  },
};

function saveAuth(data) {
  if (!data) return;

  if (data.token) {
    localStorage.setItem("chatnovax_token", data.token);
  }

  if (data.user) {
    localStorage.setItem("chatnovax_user", JSON.stringify(data.user));
  }
}

function getToken() {
  return localStorage.getItem("chatnovax_token") || "";
}

function getCurrentUser() {
  const user = localStorage.getItem("chatnovax_user");
  return user ? JSON.parse(user) : null;
}

function logoutUser() {
  localStorage.removeItem("chatnovax_token");
  localStorage.removeItem("chatnovax_user");
  window.location.href = "/login";
}

window.API_BASE = API_BASE;
window.apiRequest = apiRequest;
window.AuthAPI = AuthAPI;
window.UserAPI = UserAPI;
window.ChatAPI = ChatAPI;
window.saveAuth = saveAuth;
window.getToken = getToken;
window.getCurrentUser = getCurrentUser;
window.logoutUser = logoutUser;
