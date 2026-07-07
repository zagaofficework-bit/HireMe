// src/app/App.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from '../routes/AppRoutes';
import SessionRestorer from "../components/shared/SessionRestorer";

// ── ThemeInitializer ──────────────────────────────────────────────────────────
const ThemeInitializer = () => {
  useEffect(() => {
    const saved      = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark      = saved ? saved === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', isDark);
  }, []);
  return null;
};

// ── ScrollToTop ───────────────────────────────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// ── App ───────────────────────────────────────────────────────────────────────
// NOTE: <Provider>, <BrowserRouter>, <QueryClientProvider> are all in main.jsx.
// Do NOT add them here or you get two separate Redux stores and injectStore
// wires up the wrong one.
const App = () => (
  <>
    <ThemeInitializer />
    <ScrollToTop />

    {/*
      SessionRestorer runs the boot-check effect (fetchCurrentUser / finishInitializing)
      BEFORE any ProtectedRoute evaluates. This prevents the flash-redirect to /login
      that happens when an admin refreshes /admin while their refresh-cookie is still valid.
    */}
    <SessionRestorer />

    <AppRoutes />
  </>
);

export default App;