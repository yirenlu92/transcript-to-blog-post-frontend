import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Transcript from './components/Transcript';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Transcript/>
      </header>
    </div>
  );
}

export default App;
