//Desktop/Other/PersonalWebsite/PWfrontend/src/components/MaudiResume.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Resume.css';

const MaudiResume: React.FC = () => {
  return (
     <div className="container mt-5 mb-5">
     {/* Header Section */}
      <header className="text-center mb-5 maudi-header-bg">
        {/* Profile Image - References the public folder */}
        <img 
          src="/maudipfp.jpg" 
          alt="Maudi Williams" 
          className="profile-img" 
        />
        
        <h1 className="display-4 fw-bold text-white mb-3">Maudi Williams</h1>
        
        {/* Added fs-4 to increase the summary text size */}
        <p className="lead fs-4 mb-3">
         Baddie who works in skilled nursing.  Best marketer and admissions coordinator ever.
        </p>
        <br />
      </header>

      {/* Experience Section */}
      <section className="mb-5">
        <h2 className="section-title">Experience</h2>
        
        {/* Data Analyst */}
        <div className="card shadow-sm border-0 mb-4 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Healthcare Marketer</h3>
              <span className="badge badge-custom mt-2 mt-md-0">Sept 2025 – Present</span>
            </div>
            <h6 className="card-subtitle mt-2 text-primary fw-semibold">Stonehenge of Orem | Orem, UT</h6>
            <ul className="mt-3 mb-0 text-secondary">
              <li>Baddie.</li>
              <li>Amazing.</li>
              <li>Stunning.</li>
            </ul>
          </div>
        </div>

        {/* Student Researcher */}
        <div className="card shadow-sm border-0 mb-4 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Admissions Coordinator</h3>
              <span className="badge badge-custom mt-2 mt-md-0">May 2025 – Aug 2025</span>
            </div>
            <h6 className="card-subtitle mt-2 text-primary fw-semibold">Provo Rehab | Provo, UT</h6>
            <ul className="mt-3 mb-0 text-secondary">
              <li>Dealt with a bad boss.</li>
              <li>Cutie.</li>
              <li>Baddie.</li>
            </ul>
          </div>
        </div>

        {/* Volunteer */}
        <div className="card shadow-sm border-0 mb-3 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Something</h3>
              <span className="badge badge-custom mt-2 mt-md-0">Nov 2024 – May 2025</span>
            </div>
            <h6 className="card-subtitle mt-2 text-primary fw-semibold">Estrella | Glendale, AZ</h6>
            <ul className="mt-3 mb-0 text-secondary">
              <li>Beautiful.</li>
              <li>Amazing.</li>
              <li>Her.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Leadership & Achievements */}
      <section className="mb-5">
        <h2 className="section-title">Leadership & Achievements</h2>
        <div className="card shadow-sm border-0 hover-card">
          <div className="card-body p-4">
            <ul className="mb-0 text-secondary lh-lg">
              <li><strong>Wife</strong> to an amazing husband</li>
              <li><strong>JUCO volleyball</strong> - Mesa CC</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Back to Reece Banner */}
      <section className="mb-5 text-center mt-5">
        <div className="card shadow-lg border-0 resume-header-bg p-5 hover-card">
          <h2 className="text-white fw-bold mb-3 display-6">Check out Reece's Resume!</h2>
          <p className="text-white-50 mb-4 fs-5">
            Head back to the main page to see my husband's tech and data portfolio.
          </p>
          <div>
            <Link to="/" className="btn btn-lg btn-light rounded-pill px-5 fw-bold text-dark shadow-sm">
              View Reece's Resume
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MaudiResume;