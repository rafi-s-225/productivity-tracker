const API = 'http://localhost:5000/api';

function formatTime(seconds) {
  if (!seconds) return '0m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

// ── on load ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['userId', 'username'], (result) => {
    if (result.userId) {
      showMain(result.userId);
    }
  });
});

// ── auth ─────────────────────────────────────────────────
async function login() {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) return showLoginStatus('Fill all fields');

  try {
    const res  = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.error) return showLoginStatus(data.error);

    chrome.storage.local.set({ userId: data.userId, username: data.username });
    showMain(data.userId);
  } catch {
    showLoginStatus('Server error — is backend running?');
  }
}

async function register() {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) return showLoginStatus('Fill all fields');

  const username = email.split('@')[0];
  try {
    const res  = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (data.error) return showLoginStatus(data.error);

    chrome.storage.local.set({ userId: data.userId, username: data.username });
    showMain(data.userId);
  } catch {
    showLoginStatus('Server error — is backend running?');
  }
}

function logout() {
  chrome.storage.local.clear();
  document.getElementById('mainSection').style.display = 'none';
  document.getElementById('loginSection').style.display = 'block';
}

function showLoginStatus(msg) {
  document.getElementById('loginStatus').textContent = msg;
}

// ── main view ─────────────────────────────────────────────
async function showMain(userId) {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('mainSection').style.display  = 'block';

  await loadStats(userId);
  await loadBlocklist(userId);
}

async function loadStats(userId) {
  try {
    const today = getToday();
    const res   = await fetch(`${API}/tracking/${userId}/${today}`);
    const sessions = await res.json();

    let total = 0, productive = 0, unproductive = 0;
    sessions.forEach(s => {
      total += s.duration;
      if (s.isProductive) productive += s.duration;
      else unproductive += s.duration;
    });

    document.getElementById('totalTime').textContent       = formatTime(total);
    document.getElementById('productiveTime').textContent  = formatTime(productive);
    document.getElementById('unproductiveTime').textContent= formatTime(unproductive);
  } catch {
    document.getElementById('totalTime').textContent = 'Error';
  }
}

async function loadBlocklist(userId) {
  try {
    const res  = await fetch(`${API}/blocklist/${userId}`);
    const data = await res.json();

    // Save to local storage for content.js to use
    chrome.storage.local.set({ blocklist: data.map(e => e.domain) });

    const container = document.getElementById('blockedList');
    container.innerHTML = '';
    data.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'site-item';
      div.innerHTML = `
        <span>${entry.domain}</span>
        <button class="remove-btn" onclick="unblockSite('${entry.domain}')">✕</button>
      `;
      container.appendChild(div);
    });
  } catch {}
}

async function blockSite() {
  const domain = document.getElementById('blockInput').value.trim().replace('www.', '');
  if (!domain) return;

  chrome.storage.local.get(['userId'], async (result) => {
    try {
      await fetch(`${API}/blocklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: result.userId, domain })
      });
      document.getElementById('blockInput').value = '';
      document.getElementById('status').textContent = `✅ ${domain} blocked!`;
      setTimeout(() => document.getElementById('status').textContent = '', 2000);
      await loadBlocklist(result.userId);
    } catch {
      document.getElementById('status').textContent = 'Error blocking site';
    }
  });
}

async function unblockSite(domain) {
  chrome.storage.local.get(['userId'], async (result) => {
    try {
      await fetch(`${API}/blocklist/${result.userId}/${domain}`, { method: 'DELETE' });
      document.getElementById('status').textContent = `✅ ${domain} unblocked!`;
      setTimeout(() => document.getElementById('status').textContent = '', 2000);
      await loadBlocklist(result.userId);
    } catch {}
  });
}