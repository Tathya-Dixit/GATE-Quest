# 🎯 GATE Quest

Modern, Gamified Learning Platform for GATE CS Aspirants. Built with Next.js 15, React 19, Prisma, SQLite, and NextAuth.

## ✨ Features and Functionalities

### 🛡️ Authentication & User Persistence
- **Secure Google Sign-In** with NextAuth.js.
- **Demo Mode** for testing the complete loop without a real account.
- **Protected Routes** that automatically redirect unauthenticated users to the sleek landing page.

### 📊 Dashboard & Progression Tracking
- **Unified Analytics**: Track Games Played, Badges Earned, and Daily Streak.
- **Daily Streak System**: Log in and play games daily to build your 🔥 streak.
- **Progress Badges**: Earn Gold 🥇, Silver 🥈, or Bronze 🥉 badges based on your performance in topic quizzes. 

### 📚 Course Navigation
- Categorized Gateway to subjects like **Discrete Mathematics**, **Operating Systems**, and **Data Structures**.
- Deep-dive into specific subtopics containing bite-sized learning games.

### 🎮 Gamified Learning Engine
- **Flashcard Flip**: Master core definitions, bounds, and terminologies interactively. 
- **Sort the Steps**: Test algorithm knowledge by ordering algorithmic steps sequentially (e.g., Dijkstra's Algorithm).
- Both games feature rich micro-animations and feedback loops.

### 📝 Assessment Quizzes
- Automatically appended to the end of a mini-game session.
- Validates the exact knowledge learned during the mini-game.
- Awards experience points and badges dynamically upon submission.

### 🏆 Global Leaderboard
- A competitive arena calculating points using a heuristic algorithm:
  - Badges (50pts each)
  - Game Sessions completed (10pts each)
  - Current Daily Streak (10pts per day)
- Real-time ranking against other GATE aspirants.

### 🎨 Premium UI/UX Design
- **Glassmorphism Elements**: Beautiful blurred backgrounds and floating cards.
- **Dynamic Theme System**: Toggleable Dark/Light mode, saved persistently in localStorage.
- Responsive, mobile-friendly data tables and navigation sidebars.

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Set your environment variables (Google OAuth IDs, Database URL).
4. Run Prisma database migrations: \`npx prisma db push\`
5. Start the development server: \`npm run dev\`
6. Open [http://localhost:3000](http://localhost:3000)

---
*Built as the MVP for a Gamified Learning Capstone.*
