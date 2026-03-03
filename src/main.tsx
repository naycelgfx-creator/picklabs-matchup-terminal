import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { RookieModeProvider } from './contexts/RookieModeContext'
import { SportsbookProvider } from './contexts/SportsbookContext'
import { LiveBetsProvider } from './contexts/LiveBetsContext'
import { TicketCartProvider } from './contexts/TicketCartContext'

import React from 'react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", color: "red", background: "#111", minHeight: "100vh", fontFamily: "monospace" }}>
          <h2>React Crash</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{this.state.error?.stack || String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SportsbookProvider>
        <LiveBetsProvider>
          <RookieModeProvider>
            <TicketCartProvider>
              <App />
            </TicketCartProvider>
          </RookieModeProvider>
        </LiveBetsProvider>
      </SportsbookProvider>
    </ErrorBoundary>
  </StrictMode>,
)
