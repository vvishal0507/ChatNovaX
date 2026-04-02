function createSocket() {
  const token = localStorage.getItem("chatnovax_token");
  if (!token || typeof io === "undefined") return null;

  return io("http://localhost:5000", {
    auth: { token }
  });
}