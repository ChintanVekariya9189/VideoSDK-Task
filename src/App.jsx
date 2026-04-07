import React from 'react';
import Explorer from './components/Explorer';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Recursive File Explorer</h1>
      </header>
      <main className="app-main">
        <Explorer />
      </main>
      <footer className="app-footer">
        <p>Built with React & recursion</p>
      </footer>
    </div>
  );
}

export default App;
