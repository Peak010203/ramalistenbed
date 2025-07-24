# 📷 LINE Image Auto Sender Bot

This bot checks for an image every day at 18:00 (Thailand time) and sends it via LINE Messaging API.

## 🛠️ How it works

- Checks image file every second from `18:00:00` to `18:00:10`.
- If image is found, sends it via LINE.
- If no image is found, sends a fallback text message.

## 🌐 Deployed with [Render.com](https://render.com)

### 🧑‍💻 Deploy steps

1. Clone this repo to your GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Click "New > Background Worker".
4. Connect your GitHub repo.
5. Set these:
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `CHANNEL_ACCESS_TOKEN` – Your LINE Channel Access Token
     - `TO_USER_ID` – Your Line Group ID or User ID

## 🧪 Local Run

```bash
cp .env.example .env
npm install
npm start
```

---

✅ Developed with Node.js + Render
