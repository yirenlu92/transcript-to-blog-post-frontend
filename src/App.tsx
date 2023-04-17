import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Transcript from "./components/Transcript";
import Editor from "./components/Editor";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Transcript />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
