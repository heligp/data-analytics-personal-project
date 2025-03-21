import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Clustering from './components/Clustering/Clustering';
import Prediction from './components/Prediction/Prediction';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">
            <h1>DataInsight</h1>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/clustering">Clustering</Link>
            </li>
            <li>
              <Link to="/prediction">Predicción</Link>
            </li>
          </ul>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clustering" element={<Clustering />} />
            <Route path="/prediction" element={<Prediction />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 DataInsight - Creado por Ti</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;