<h1 align="center">💰 Personal Finance Dashboard</h1>

<p align="center">
  A local-first personal finance app — track income, expenses, goals and analytics entirely in your browser. No account, no backend, your data never leaves your machine.
</p>

<p align="center">
  <a href="https://finance-dashboard-nu-nine.vercel.app"><b>▶ Live Demo</b></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 5"/>
  <img src="https://img.shields.io/badge/Chart.js-4-FF6384?style=flat-square&logo=chartdotjs&logoColor=white" alt="Chart.js"/>
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"/>
</p>

---

## ✨ Features

- **📊 Dashboard** — at-a-glance balance, income, expenses and savings with interactive Chart.js visualizations
- **💸 Transactions** — add, search and filter every financial activity
- **🎯 Goals** — set financial targets and track progress toward them
- **📈 Analytics** — detailed breakdown of spending habits by category and time
- **📄 Reports** — export your data as **PDF** (jsPDF) and work with **CSV** (PapaParse)
- **🔔 Notifications & ⚙️ Settings** — alerts and personalization, including theming via CSS variables
- **🔒 Local-first** — all data persists in browser localStorage; no external database, no sign-up, fully private

## 🧱 Built With

| Layer | Tech |
|---|---|
| UI | React 18, React Router 6, Lucide icons |
| Charts | Chart.js 4 + react-chartjs-2 |
| Data | localStorage via React Context (`DataContext`), UUID keys |
| Export | jsPDF + autotable (PDF), PapaParse (CSV) |
| Tooling | Vite 5, ESLint |
| Hosting | Vercel |

Built AI-first with **Antigravity**, then reviewed, hardened and tested by hand — including an `ErrorBoundary` around the app shell so a single failing view can't take down the dashboard.

## 🚀 Getting Started

Requires **Node.js 18+**.

```bash
git clone https://github.com/Rahulprajapati99/Finance_Dashboard.git
cd Finance_Dashboard
npm install
npm run dev      # local dev server → http://localhost:5173
```

Other scripts:

```bash
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # ESLint
```

## 🗂️ Project Structure

```
src/
  components/    # Layout, Header, Sidebar, modals, ErrorBoundary
  context/       # DataContext (localStorage persistence), ThemeContext
  pages/         # Dashboard, Transactions, Goals, Analytics, Reports,
                 # Notifications, Settings
  styles/        # Global CSS (CSS-variable theming)
```

## 👤 Author

**Rahul Prajapati** — QA Engineer × AI Builder

📫 rahul.connectX@gmail.com · 💼 [linkedin.com/in/rahul-prajapati](https://www.linkedin.com/in/rahul-prajapati) · 🌐 [rahulprajapati99.vercel.app](https://rahulprajapati99.vercel.app) · 🐙 [@Rahulprajapati99](https://github.com/Rahulprajapati99)
