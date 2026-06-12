const API = 'http://localhost:5000/api';

async function syncBlocklistNow() {
  const userId = await getUserId();
  if (!userId) return;
  try {
    const res  = await fetch(`${API}/blocklist/${userId}`);
    const data = await res.json();
    const domains = data.map(entry => entry.domain);
    chrome.storage.local.set({ blocklist: domains });
    console.log('Blocklist synced:', domains);
  } catch (err) {
    console.log('Sync failed:', err);
  }
}

// Run sync immediately when service worker starts
syncBlocklistNow();

// Sync every 1 minute (instead of 5)
chrome.alarms.create('syncBlocklist', { periodInMinutes: 1 });

let activeTabDomain = null;
let activeTabStart  = null;

// ── helpers ──────────────────────────────────────────────
function getDomain(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace('www.', '');
  } catch {
    return null;
  }
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

async function getUserId() {
  return new Promise(resolve => {
    chrome.storage.local.get(['userId'], result => {
      resolve(result.userId || null);
    });
  });
}

// ── save session to backend ───────────────────────────────
async function saveSession(domain, duration) {
  if (!domain || duration < 3) return; // ignore less than 3 seconds

  const userId = await getUserId();
  if (!userId) return; // not logged in, skip

  const date = getToday();

  // check if it's a productive site
  const prefs = await new Promise(resolve => {
    chrome.storage.local.get(['preferences'], r => resolve(r.preferences || {}));
  });
  const unproductive = prefs.unproductiveSites || [];
  const isProductive = !unproductive.includes(domain);

  try {
    await fetch(`${API}/tracking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, domain, duration, date, isProductive })
    });
  } catch (err) {
    console.log('Failed to save session:', err);
  }
}

// ── track tab switches ────────────────────────────────────
async function handleTabChange(url) {
  // Save previous session first
  if (activeTabDomain && activeTabStart) {
    const duration = Math.floor((Date.now() - activeTabStart) / 1000);
    await saveSession(activeTabDomain, duration);
  }

  // Start tracking new tab
  const domain = getDomain(url);
  activeTabDomain = domain;
  activeTabStart  = Date.now();
}

// Listen for tab switches
chrome.tabs.onActivated.addListener(async (info) => {
  try {
    const tab = await chrome.tabs.get(info.tabId);
    if (tab.url) await handleTabChange(tab.url);
  } catch {}
});

// Listen for URL changes within same tab
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active && tab.url) {
    await handleTabChange(tab.url);
  }
});

// Save session when browser loses focus
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    if (activeTabDomain && activeTabStart) {
      const duration = Math.floor((Date.now() - activeTabStart) / 1000);
      await saveSession(activeTabDomain, duration);
      activeTabStart = null;
    }
  }
});

// ── blocklist check ───────────────────────────────────────
async function getBlocklist() {
  return new Promise(resolve => {
    chrome.storage.local.get(['blocklist'], r => resolve(r.blocklist || []));
  });
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    const domain = getDomain(tab.url);
    if (!domain) return;

    const blocklist = await getBlocklist();
    if (blocklist.includes(domain)) {
      chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL('blocked.html') + '?site=' + domain
      });
    }
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncBlocklist') {
    syncBlocklistNow();
  }
});