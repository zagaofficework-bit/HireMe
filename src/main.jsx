// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/shared/ThemeContext';
import { store } from "./app/store";          // ✅ src/store/index.js  (was './app/store' — wrong path)
import { injectStore } from './api/apiClient';
import queryClient from './lib/queryClient';
import "./styles/index.css"
import App from './app/App';

// ✅ injectStore called ONCE here in main.jsx.
// Remove the injectStore() call from src/store/index.js — calling it in two
// places is harmless but the one in store/index.js runs before the Provider
// wraps the tree, which can cause _store to point at a stale reference.
injectStore(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
)