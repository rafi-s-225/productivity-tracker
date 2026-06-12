# 🎯 Productivity Tracker — Chrome Extension

A Chrome extension that tracks time spent on websites, blocks distracting sites, and shows productivity reports on a web dashboard. Built with the MERN stack.

## ✨ Features

- ⏱️ Tracks time spent on each website
- 🚫 Blocks distracting sites (e.g. YouTube, Instagram)
- 📊 Daily & weekly productivity reports on the web dashboard
- 🔄 Extension and dashboard sync automatically

## 🛠️ Requirements

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Google Chrome](https://www.google.com/chrome/)

## 📥 Setup

```bash
git clone https://github.com/YOUR_USERNAME/productivity-tracker.git
cd productivity-tracker
```

**1. Start MongoDB** (keep running)
```bash
mongod
```

**2. Start Backend** (keep running, new terminal)
```bash
cd backend
npm install
npm run dev
```

**3. Start Frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Open the link shown (e.g. `http://localhost:5173`).

**4. Load the Extension**
1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `extension` folder

## ▶️ How to Use

1. Register/login via the extension popup or dashboard
2. Browse normally — time is tracked automatically
3. Block a site by typing its domain (e.g. `youtube.com`) and clicking Block
4. View reports and stats on the dashboard

> ⚡ Block/unblock changes take effect within ~1 minute (auto-sync).

## ⚠️ Note

MongoDB, backend, and frontend must all be running for the extension to work. This project runs locally only (not deployed).

## 👤 Author

**Saritala Rafi Mahammad**