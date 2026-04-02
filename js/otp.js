const emailInput = document.getElementById("email");
const otpEmail = localStorage.getItem("otp_email");
if (emailInput && otpEmail) emailInput.value = otpEmail;

document.getElementById("otpForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const otp = document.getElementById("otp").value.trim();
  const message = document.getElementById("message");

  try {
    const data = await apiRequest("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp })
    });

    saveAuth(data.token, data.user);
    message.textContent = data.message;
    setTimeout(() => {
      window.location.href = "profile.html";
    }, 800);
  } catch (error) {
    message.textContent = error.message;
  }
});

document.getElementById("resendBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message");

  try {
    const data = await apiRequest("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email })
    });
    message.textContent = data.message;
  } catch (error) {
    message.textContent = error.message;
  }
});