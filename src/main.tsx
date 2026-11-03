import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function StartupFailure() {
  return <main style={{ maxWidth: 640, margin: '12vh auto', padding: 24, fontFamily: 'system-ui' }} role="alert">
    <h1>CloudChem could not start</h1>
    <p>Your saved progress has not been deleted. Reload the application or use the standalone revision app.</p>
    <button onClick={() => window.location.reload()}>Reload application</button>
    <p><a href="./chem-revision-app.html">Open standalone revision app</a></p>
  </main>;
}

class StartupBoundary extends Component<React.PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('CloudChem render failed', error, info); }
  render() { return this.state.failed ? <StartupFailure /> : this.props.children; }
}

const container = document.getElementById('root');
if (!container) throw new Error('CloudChem root element is missing.');
const root = createRoot(container);
import('./App.tsx')
  .then(({ default: App }) => root.render(<StartupBoundary><App /></StartupBoundary>))
  .catch(error => { console.error('CloudChem bootstrap failed', error); root.render(<StartupFailure />); });
