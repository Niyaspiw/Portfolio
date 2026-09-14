/* ============================================================
   BIYEKSBI CHATBOT — Frontend Logic
   Talks to the Render backend
============================================================ */

// ⚠️ IMPORTANT: Replace this with your Render URL
const CHATBOT_API_URL = "https://biyeksbi-chatbot.onrender.com/chat";

// ============================================================
// ELEMENTS
// ============================================================
const chatToggle = document.getElementById("chatToggle");
const chatWindow = document.getElementById("chatWindow");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatMessages = document.getElementById("chatMessages");

let isSending = false;
let hasWokenUp = false; // tracks if backend has been warmed up this session

// ============================================================
// OPEN / CLOSE CHAT
// ============================================================
chatToggle.addEventListener("click", () => {
  chatWindow.classList.add("open");
  chatWindow.setAttribute("aria-hidden", "false");
  chatToggle.classList.add("hidden");
  setTimeout(() => chatInput.focus(), 250);
});

chatClose.addEventListener("click", closeChat);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && chatWindow.classList.contains("open")) closeChat();
});

function closeChat() {
  chatWindow.classList.remove("open");
  chatWindow.setAttribute("aria-hidden", "true");
  chatToggle.classList.remove("hidden");
}

// ============================================================
// RENDER MESSAGES
// ============================================================
function addMessage(text, sender = "bot") {
  const wrapper = document.createElement("div");
  wrapper.classList.add("chat-message", sender);

  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble");
  bubble.textContent = text;

  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);
  scrollToBottom();
}

function addTypingIndicator(label = "") {
  const wrapper = document.createElement("div");
  wrapper.classList.add("chat-message", "bot");
  wrapper.id = "typingIndicator";

  if (label) {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble");
    bubble.textContent = label;
    wrapper.appendChild(bubble);
  } else {
    const typing = document.createElement("div");
    typing.classList.add("chat-typing");
    typing.innerHTML = "<span></span><span></span><span></span>";
    wrapper.appendChild(typing);
  }

  chatMessages.appendChild(wrapper);
  scrollToBottom();
}

function removeTypingIndicator() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ============================================================
// SEND MESSAGE
// ============================================================
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message || isSending) return;

  isSending = true;
  chatSend.disabled = true;
  chatInput.value = "";

  addMessage(message, "user");

  // Show "waking up" message the first time on free tier
  if (!hasWokenUp) {
    addTypingIndicator("⏳ Waking up BIYEKSBI... (first message may take ~30s on free tier)");
  } else {
    addTypingIndicator();
  }

  try {
    const res = await fetch(CHATBOT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    removeTypingIndicator();
    hasWokenUp = true;

    if (data.reply) {
      addMessage(data.reply, "bot");
    } else if (data.error) {
      addMessage("⚠️ " + data.error, "bot");
    } else {
      addMessage("Hmm, I didn't get a proper response. Please try again.", "bot");
    }
  } catch (err) {
    removeTypingIndicator();
    console.error("Chat error:", err);
    addMessage(
      "😅 I couldn't reach the server. It may still be waking up — please try again in a few seconds.",
      "bot"
    );
  } finally {
    isSending = false;
    chatSend.disabled = false;
    chatInput.focus();
  }
});