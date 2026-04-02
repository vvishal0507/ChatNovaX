document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  try {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    saveAuth(data.token, data.user);
    message.textContent = data.message;
    setTimeout(() => {
      window.location.href = "profile.html";
    }, 800);
  } catch (error) {
    message.textContent = error.message;
    if (error.message.toLowerCase().includes("verify otp")) {
      localStorage.setItem("otp_email", email);
      setTimeout(() => {
        window.location.href = "otp.html";
      }, 1000);
    }
  }
});