(function () {
  const script = document.currentScript;
  const chatbotId = script.getAttribute('data-chatbot-id');
  const server = script.getAttribute('data-server') || '';

  if (!chatbotId) {
    console.error('Widget Wise: data-chatbot-id is required');
    return;
  }

  let sessionId = localStorage.getItem('ww_session_' + chatbotId);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('ww_session_' + chatbotId, sessionId);
  }

  // Default config
  let config = { name: 'Chat', welcomeMessage: 'Hello! How can I help you?', primaryColor: '#2563eb' };

  // Fetch chatbot config
  fetch(server + '/api/chat/' + chatbotId + '/config')
    .then(r => r.json())
    .then(c => {
      config = c;
      applyColor(c.primaryColor);
      addWelcomeMessage(c.welcomeMessage);
    })
    .catch(() => {
      addWelcomeMessage(config.welcomeMessage);
    });

  // Create shadow host
  const host = document.createElement('div');
  host.id = 'widget-wise-host';
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: 'open' });

  const styles = document.createElement('style');
  styles.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .ww-container {
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .ww-toggle {
      width: 60px; height: 60px; border-radius: 50%;
      background: var(--ww-color, #2563eb); border: none; cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2); display: flex;
      align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
    }
    .ww-toggle:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(0,0,0,0.25); }
    .ww-toggle svg { width: 28px; height: 28px; fill: white; transition: transform 0.3s, opacity 0.2s; position: absolute; }
    .ww-toggle .ww-icon-chat { opacity: 1; transform: rotate(0deg); }
    .ww-toggle .ww-icon-close { opacity: 0; transform: rotate(-90deg); }
    .ww-toggle.active .ww-icon-chat { opacity: 0; transform: rotate(90deg); }
    .ww-toggle.active .ww-icon-close { opacity: 1; transform: rotate(0deg); }
    .ww-window {
      position: absolute; bottom: 72px; right: 0; width: 380px; height: 500px;
      background: white; border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
      display: flex; flex-direction: column; overflow: hidden;
      transform: scale(0) translateY(20px); transform-origin: bottom right;
      opacity: 0; pointer-events: none;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
    }
    .ww-window.open {
      transform: scale(1) translateY(0); opacity: 1; pointer-events: auto;
    }
    .ww-header {
      padding: 16px 20px; background: var(--ww-color, #2563eb); color: white;
      font-weight: 600; font-size: 15px; flex-shrink: 0;
    }
    .ww-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex;
      flex-direction: column; gap: 10px;
    }
    .ww-msg {
      max-width: 80%; padding: 10px 14px; border-radius: 12px;
      font-size: 14px; line-height: 1.5; word-wrap: break-word;
    }
    .ww-msg.user {
      align-self: flex-end; background: var(--ww-color, #2563eb); color: white;
      border-bottom-right-radius: 4px;
    }
    .ww-msg.assistant {
      align-self: flex-start; background: #f1f5f9; color: #1e293b;
      border-bottom-left-radius: 4px;
    }
    .ww-msg.typing { opacity: 0.6; font-style: italic; }
    .ww-input-area {
      display: flex; border-top: 1px solid #e2e8f0; padding: 12px; flex-shrink: 0;
    }
    .ww-input-area input {
      flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px;
      font-size: 14px; outline: none;
    }
    .ww-input-area input:focus { border-color: var(--ww-color, #2563eb); }
    .ww-input-area button {
      margin-left: 8px; background: var(--ww-color, #2563eb); color: white;
      border: none; border-radius: 8px; padding: 10px 16px; cursor: pointer;
      font-size: 14px; font-weight: 500;
    }
    .ww-input-area button:disabled { opacity: 0.5; cursor: not-allowed; }
  `;

  const container = document.createElement('div');
  container.className = 'ww-container';
  container.innerHTML = `
    <div class="ww-window">
      <div class="ww-header"></div>
      <div class="ww-messages"></div>
      <div class="ww-input-area">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
    <button class="ww-toggle" aria-label="Open chat">
      <svg class="ww-icon-chat" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      <svg class="ww-icon-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>
  `;

  shadow.appendChild(styles);
  shadow.appendChild(container);

  const toggle = shadow.querySelector('.ww-toggle');
  const window_ = shadow.querySelector('.ww-window');
  const header = shadow.querySelector('.ww-header');
  const messagesDiv = shadow.querySelector('.ww-messages');
  const input = shadow.querySelector('.ww-input-area input');
  const sendBtn = shadow.querySelector('.ww-input-area button');

  header.textContent = config.name;
  let isOpen = false;

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    window_.classList.toggle('open', isOpen);
    toggle.classList.toggle('active', isOpen);
    if (isOpen) input.focus();
  });

  function applyColor(color) {
    container.style.setProperty('--ww-color', color);
    header.textContent = config.name;
  }

  function addMessage(role, content) {
    const div = document.createElement('div');
    div.className = 'ww-msg ' + role;
    div.textContent = content;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return div;
  }

  function addWelcomeMessage(text) {
    if (messagesDiv.children.length === 0) {
      addMessage('assistant', text);
    }
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addMessage('user', text);
    sendBtn.disabled = true;

    const typing = addMessage('assistant', 'Typing...');
    typing.classList.add('typing');

    try {
      const res = await fetch(server + '/api/chat/' + chatbotId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      });
      const data = await res.json();
      typing.remove();
      if (data.response) {
        addMessage('assistant', data.response);
      } else {
        addMessage('assistant', data.error || 'Something went wrong.');
      }
    } catch {
      typing.remove();
      addMessage('assistant', 'Failed to connect. Please try again.');
    }

    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();
