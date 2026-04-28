import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop'; // <-- 1. Add this import!

import Resume from './components/Resume';
import MaudiResume from './components/MaudiResume';
import Ncaa from './components/NCAA';
import Mundial from './components/Mundial';
import MyTeams from './components/MyTeams';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop /> {/* <-- 2. Drop it right here! */}
      
      <div className="d-flex flex-column min-vh-100">
        
        {/* Main Content Area */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Resume />} />
            <Route path="/maudi" element={<MaudiResume />} />
            <Route path="/ncaa" element={<Ncaa />} />
            <Route path="/mundial" element={<Mundial />} />
            <Route path="/my-teams" element={<MyTeams />} />
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