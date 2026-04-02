const API_ORIGIN = "http://localhost:5000";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("chatnovax_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_ORIGIN}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function saveAuth(token, user) {
  localStorage.setItem("chatnovax_token", token);
  localStorage.setItem("chatnovax_user", JSON.stringify(user));
}

function getCurrentUser() {
  const raw = localStorage.getItem("chatnovax_user");
  return raw ? JSON.parse(raw) : null;
}

function logoutUser() {
  localStorage.removeItem("chatnovax_token");
  localStorage.removeItem("chatnovax_user");
  window.location.href = "login.html";
}