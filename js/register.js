document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  try {
    const data = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    });

    message.textContent = data.message;
    localStorage.setItem("otp_email", email);
    setTimeout(() => {
      window.location.href = "otp.html";
    }, 1200);
  } catch (error) {
    message.textContent = error.message;
  }
});