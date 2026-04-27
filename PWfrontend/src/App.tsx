import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Resume from './components/Resume';
import MaudiResume from './components/MaudiResume';
import Ncaa from './components/NCAA';
import WorldCup from './components/Mundial';
import Intramural from './components/MyTeams';

const App: React.FC = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        
        {/* Main Content Area */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Resume />} />
            <Route path="/maudi" element={<MaudiResume />} />
            {/* Add your new routes here: */}
            <Route path="/NCAA" element={<Ncaa />} />
            <Route path="/Mundial" element={<WorldCup />} />
            <Route path="/intramural" element={<Intramural />} />
          </Routes>
        </main>
        
        {/* Global Footer Section */}
        <footer className="bg-dark text-white text-center py-5 mt-auto">
          <div className="container">
            <p className="mb-2 fs-5 fw-bold">Reece Williams</p>
            <p className="small text-white-50 mb-0">
              Built from scratch using React, TypeScript, Vite, and Bootstrap—with some AI assistance from Gemini.
            </p>
          </div>
        </footer>
        
      </div>
    </Router>
  );
};

export default App;