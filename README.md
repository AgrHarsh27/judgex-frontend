# ⚡ JudgeX PRO - Online Code Evaluator

> Next-Generation Online Judge & Competitive Coding Arena powered by React, Vite, and Docker-sandboxed execution.

![JudgeX Banner](https://img.shields.io/badge/JudgeX-PRO-6366f1?style=for-the-badge&logo=codeforces&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Backend Status](https://img.shields.io/badge/Backend-Render-green?style=for-the-badge&logo=render&logoColor=white)

---

## 🌟 Features

- **⚡ Real-Time Code Execution**: Run and submit code against testcases in an isolated Docker sandbox environment.
- **💻 Monaco Code Editor Integration**: Full-featured code editor with syntax highlighting, auto-completion, and multi-language support (C++, Python, Java, JavaScript).
- **🏆 Problem Archives & Filtering**: Browse problem sets filterable by difficulty (Easy, Medium, Hard) and keyword search.
- **🛡️ Admin Console**: Dedicated dashboard for administrators to add new coding problems, define custom test cases, and manage users.
- **📊 Submission History & Metrics**: Track historical submission verdicts (Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error).
- **🔒 Authentication & Role-Based Access**: Secure JWT authentication with separate access levels for Coders and Admins.
- **⚡ Automatic API Proxy & Exponential Retry**: Integrated API communication with automatic retries to handle Render free-tier cold starts seamlessly.
- **💎 Dark Glassmorphic Design**: Modern, responsive UI designed with HSL color palettes and smooth animations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: TailwindCSS v4 + Vanilla Glassmorphism CSS
- **Code Editor**: `@monaco-editor/react`
- **Icons & Effects**: `lucide-react`, `canvas-confetti`

### Backend Service
- **Deployed Endpoint**: `https://judgex-backend-kcdo.onrender.com`
- **Stack**: Python WSGI (Flask / Gunicorn)
- **Sandboxing**: Docker Containerized Execution Engine

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/JudgeX.git
cd JudgeX/frontend
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

The development server is configured with an automatic Vite API proxy (`/api`) that forwards all requests to `https://judgex-backend-kcdo.onrender.com`, bypassing browser CORS issues automatically.

---

## 🌐 API & Proxy Configuration

The API communication is managed in [`src/api.js`](src/api.js):
- **Default Dev Proxy**: `/api` mapped to `https://judgex-backend-kcdo.onrender.com` via [`vite.config.js`](vite.config.js).
- **Health Check Polling**: Periodically polls backend status to wake up free-tier Render instances on cold starts.

---

## 📦 Deployment Instructions

Production configuration files are pre-configured in the repository:

### 1. Deploy to Vercel (Recommended)
- Direct deploy via CLI:
  ```bash
  npm i -g vercel
  vercel --prod
  ```
- Or import into Vercel Dashboard. The included [`vercel.json`](vercel.json) handles production API proxy rewrites automatically.

### 2. Deploy to Netlify
- Build and deploy via CLI:
  ```bash
  npm run build
  netlify deploy --prod --dir=dist
  ```
- Or import into Netlify Dashboard. The included [`netlify.toml`](netlify.toml) configures production redirect rules automatically.

### 3. Deploy to Render (Static Site)
1. Create a **Static Site** on Render with Build Command `npm run build` and Publish Directory `dist`.
2. Add a Rewrite rule under **Redirects/Rewrites**:
   - `/api/*` ➔ `https://judgex-backend-kcdo.onrender.com/*` (`Rewrite`)
   - `/*` ➔ `/index.html` (`Rewrite`)

---

## 📂 Project Structure

```
frontend/
├── dist/                  # Built production assets
├── public/                # Static public assets
├── src/
│   ├── assets/            # SVG icons and visual assets
│   ├── components/        # React Components
│   │   ├── AdminPanel.jsx      # Admin problem & testcase management
│   │   ├── AuthModal.jsx       # Login & Registration modal
│   │   ├── Navbar.jsx          # Header navigation & status indicator
│   │   ├── ProblemDetail.jsx   # Problem statement & Monaco Editor
│   │   ├── ProblemList.jsx     # Main arena problem listing
│   │   └── SubmissionsView.jsx # Historical submissions view
│   ├── context/
│   │   └── AuthContext.jsx # Authentication & submission state
│   ├── api.js             # API request wrapper & health check
│   ├── App.jsx            # Main Layout & routing state
│   ├── main.jsx           # React app entrypoint
│   └── index.css          # Core CSS design system
├── netlify.toml           # Netlify deployment proxy configuration
├── vercel.json            # Vercel deployment proxy configuration
├── vite.config.js         # Vite configuration with dev proxy
├── requirements.txt       # Backend dependencies manifest
└── package.json           # Frontend package manifest
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
