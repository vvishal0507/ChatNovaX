(async function () {
  const token = localStorage.getItem("chatnovax_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const currentUser = getCurrentUser();
  if (currentUser) {
    document.getElementById("name").value = currentUser.name || "";
    document.getElementById("profilePic").value = currentUser.profilePic || "";
    document.getElementById("gender").value = currentUser.gender || "";
    document.getElementById("country").value = currentUser.country || "";
    document.getElementById("state").value = currentUser.state || "";
    document.getElementById("bio").value = currentUser.bio || "";
  }
})();

document.getElementById("profileForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("name").value.trim(),
    profilePic: document.getElementById("profilePic").value.trim(),
    gender: document.getElementById("gender").value.trim(),
    country: document.getElementById("country").value.trim(),
    state: document.getElementById("state").value.trim(),
    bio: document.getElementById("bio").value.trim()
  };

  const message = document.getElementById("message");

  try {
    const data = await apiRequest("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(payload)
    });

    localStorage.setItem("chatnovax_user", JSON.stringify(data.user));
    message.textContent = data.message;
  } catch (error) {
    message.textContent = error.message;
  }
});