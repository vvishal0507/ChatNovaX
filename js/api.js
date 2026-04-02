const API_BASE = (() => {
  const host = window.location.hostname;
  const origin = window.location.origin;

  // Render / live server
  if (
    host.includes("onrender.com") ||
    host !== "127.0.0.1" && host !== "localhost"
  ) {
    return `${origin}/api`;
  }

  // Local development
  return "http://localhost:5000/api";
})();

const AuthAPI = {
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error during registration",
        error: error.message,
      };
    }
  },

  async verifyOtp(email, otp) {
    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error during OTP verification",
        error: error.message,
      };
    }
  },

  async resendOtp(email) {
    try {
      const response = await fetch(`${API_BASE}/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error during OTP resend",
        error: error.message,
      };
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error during login",
        error: error.message,
      };
    }
  },

  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error during forgot password request",
        error: error.message,
      };
    }
  },

  async resetPassword(email, otp, newPassword) {
    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error during password reset",
        error: error.message,
      };
    }
  },
};

const UserAPI = {
  async getProfile(token) {
    try {
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error while fetching profile",
        error: error.message,
      };
    }
  },

  async updateProfile(token, userData) {
    try {
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error while updating profile",
        error: error.message,
      };
    }
  },

  async getAllUsers(token) {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error while fetching users",
        error: error.message,
      };
    }
  },
};

const ChatAPI = {
  async getMessages(token, roomId = "") {
    try {
      const url = roomId
        ? `${API_BASE}/chat/messages?roomId=${encodeURIComponent(roomId)}`
        : `${API_BASE}/chat/messages`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error while fetching messages",
        error: error.message,
      };
    }
  },

  async sendMessage(token, messageData) {
    try {
      const response = await fetch(`${API_BASE}/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error while sending message",
        error: error.message,
      };
    }
  },

  async getRooms(token) {
    try {
      const response = await fetch(`${API_BASE}/chat/rooms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error while fetching rooms",
        error: error.message,
      };
    }
  },

  async createRoom(token, roomData) {
    try {
      const response = await fetch(`${API_BASE}/chat/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error while creating room",
        error: error.message,
      };
    }
  },

  async getOnlineUsers(token) {
    try {
      const response = await fetch(`${API_BASE}/chat/online-users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error while fetching online users",
        error: error.message,
      };
    }
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
  window.location.href = "login.html";
}

window.API_BASE = API_BASE;
window.AuthAPI = AuthAPI;
window.UserAPI = UserAPI;
window.ChatAPI = ChatAPI;
window.saveAuth = saveAuth;
window.getToken = getToken;
window.getCurrentUser = getCurrentUser;
window.logoutUser = logoutUser;
