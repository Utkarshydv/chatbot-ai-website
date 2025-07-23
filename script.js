const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatArea = document.getElementById('chat-area');
const suggestions = document.getElementById('suggestions');
const resetBtn = document.getElementById('reset-btn');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

let greetingDiv = document.getElementById('typing-msg');

// Remove greeting on typing
input.addEventListener('input', () => {
  if (greetingDiv) {
    greetingDiv.remove();
    greetingDiv = null;
  }
});

// Submit message
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;

  addUserMessage(msg);
  input.value = '';
  suggestions.remove();

  addBotMessage('...');

  fetch('https://chat-bot-ai-beta.vercel.app/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: msg })
  })
    .then(res => res.json())
    .then(data => {
      const lastBot = chatArea.querySelector('.bot-message:last-child .message-content');
      if (lastBot) lastBot.textContent = data.reply;
    })
    .catch(() => {
      const lastBot = chatArea.querySelector('.bot-message:last-child .message-content');
      if (lastBot) lastBot.textContent = "Error fetching response.";
    });
});

// Suggestion buttons
document.querySelectorAll('.suggestion').forEach(btn => {
  btn.addEventListener('click', () => {
    greetingDiv?.remove();
    greetingDiv = null;
    input.value = btn.textContent;
    form.requestSubmit();
  });
});

// Reset chat
resetBtn.addEventListener('click', () => {
  chatArea.innerHTML = `
    <div class="greeting" id="typing-msg">
      <div class="greet-hello">Hello,</div>
      <div class="greet-sub">How can I help you today?</div>
    </div>`;
  greetingDiv = document.getElementById('typing-msg');
  if (!document.getElementById('suggestions')) {
    document
      .querySelector('main')
      .insertBefore(suggestions, document.querySelector('.input-wrapper'));
  } else {
    suggestions.style.display = 'flex';
  }
});

// Theme toggle
themeToggle.addEventListener('change', () => {
  body.classList.toggle('light', themeToggle.checked);
});

// User message bubble
function addUserMessage(text) {
  const el = document.createElement('div');
  el.className = 'message user';
  el.textContent = text;
  chatArea.appendChild(el);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Bot message with template
function addBotMessage(text) {
  const template = document.getElementById('bot-message-template');
  const clone = template.content.cloneNode(true);
  clone.querySelector('.message-content').textContent = text;
  chatArea.appendChild(clone);
  chatArea.scrollTop = chatArea.scrollHeight;
}
