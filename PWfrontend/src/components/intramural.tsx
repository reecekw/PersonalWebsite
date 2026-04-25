import React from 'react';
import { Link } from 'react-router-dom';

const PageTemplate: React.FC = () => {
  return (
    <div className="container mt-5 mb-5 text-center">
      <h1 className="display-4 fw-bold mb-4 text-dark">BYU Intramurals</h1>
      
      <p className="lead text-muted mb-5">
        I am going to fix the terrible BYU Intramural website
      </p>
      
      <div className="mt-5">
        <Link to="/" className="btn btn-lg btn-custom-outline bg-dark text-white rounded-pill px-4 hover-card">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PageTemplate;