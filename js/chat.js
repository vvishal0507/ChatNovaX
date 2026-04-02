const currentUser = getCurrentUser();
if (!currentUser || !localStorage.getItem("chatnovax_token")) {
  window.location.href = "login.html";
}

const currentUserBox = document.getElementById("currentUserBox");
const onlineUsersList = document.getElementById("onlineUsersList");
const usersList = document.getElementById("usersList");
const roomsList = document.getElementById("roomsList");
const roomNameInput = document.getElementById("roomNameInput");
const createRoomBtn = document.getElementById("createRoomBtn");
const chatHeader = document.getElementById("chatHeader");
const chatMessages = document.getElementById("chatMessages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const logoutBtn = document.getElementById("logoutBtn");

let selectedChat = null;
let selectedType = null;
const socket = createSocket();

currentUserBox.innerHTML = `
  <div class="me-card">
    <img src="${currentUser.profilePic || 'https://via.placeholder.com/60'}" alt="avatar" />
    <div>
      <strong>${currentUser.name}</strong>
      <small>${currentUser.email}</small>
    </div>
  </div>
`;

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderMessage(message) {
  const mine = String(message.sender?._id || message.sender) === String(currentUser.id || currentUser._id);
  const div = document.createElement("div");
  div.className = `message ${mine ? "mine" : "other"}`;
  div.innerHTML = `
    <div class="bubble">
      <div class="meta">
        <strong>${message.sender?.name || "User"}</strong>
        <span>${formatTime(message.createdAt)}</span>
      </div>
      <div>${message.text}</div>
    </div>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearMessages() {
  chatMessages.innerHTML = "";
}

async function loadUsers() {
  try {
    const data = await apiRequest("/api/users/all");
    usersList.innerHTML = "";

    data.users.forEach((user) => {
      const btn = document.createElement("button");
      btn.className = "list-item";
      btn.textContent = `${user.name} (${user.email})`;
      btn.onclick = async () => {
        selectedChat = user;
        selectedType = "private";
        chatHeader.textContent = `Private chat with ${user.name}`;
        clearMessages();
        const msgs = await apiRequest(`/api/chat/private/${user._id}`);
        msgs.messages.forEach(renderMessage);
      };
      usersList.appendChild(btn);
    });
  } catch (error) {
    console.error(error);
  }
}

async function loadRooms() {
  try {
    const data = await apiRequest("/api/chat/rooms");
    roomsList.innerHTML = "";

    data.rooms.forEach((room) => {
      const btn = document.createElement("button");
      btn.className = "list-item";
      btn.textContent = `# ${room.name}`;
      btn.onclick = async () => {
        selectedChat = room;
        selectedType = "room";
        chatHeader.textContent = `Room: ${room.name}`;
        clearMessages();
        socket?.emit("joinRoom", room.name);
        const msgs = await apiRequest(`/api/chat/rooms/${room.name}`);
        msgs.messages.forEach(renderMessage);
      };
      roomsList.appendChild(btn);
    });
  } catch (error) {
    console.error(error);
  }
}

createRoomBtn?.addEventListener("click", async () => {
  const name = roomNameInput.value.trim();
  if (!name) return;

  try {
    await apiRequest("/api/chat/rooms", {
      method: "POST",
      body: JSON.stringify({ name })
    });
    roomNameInput.value = "";
    loadRooms();
  } catch (error) {
    alert(error.message);
  }
});

messageForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text || !selectedChat || !selectedType) return;

  if (selectedType === "private") {
    socket?.emit("privateMessage", {
      receiverId: selectedChat._id,
      text
    });
  } else {
    socket?.emit("roomMessage", {
      roomName: selectedChat.name,
      text
    });
  }

  messageInput.value = "";
});

logoutBtn?.addEventListener("click", () => {
  socket?.disconnect();
  logoutUser();
});

if (socket) {
  socket.on("onlineUsers", (users) => {
    onlineUsersList.innerHTML = "";
    users.forEach((user) => {
      const div = document.createElement("div");
      div.className = "online-user";
      div.textContent = user.name;
      onlineUsersList.appendChild(div);
    });
  });

  socket.on("newPrivateMessage", (message) => {
    const isCurrent =
      selectedType === "private" &&
      selectedChat &&
      (
        String(message.sender?._id) === String(selectedChat._id) ||
        String(message.receiver?._id) === String(selectedChat._id)
      );

    if (isCurrent) renderMessage(message);
  });

  socket.on("newRoomMessage", (message) => {
    if (selectedType === "room" && selectedChat?.name === message.room) {
      renderMessage(message);
    }
  });
}

loadUsers();
loadRooms();