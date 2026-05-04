import React from 'react';
import { Link } from 'react-router-dom';
import './Resume.css';

const Ncaa: React.FC = () => {
  return (
    <div className="container mt-5 mb-5">
      
      {/* Header Section */}
      <div className="text-center mb-5 resume-header-bg p-5 rounded shadow-sm">
        <h1 className="display-4 fw-bold text-white mb-3">Fixing College Sports</h1>
        <p className="lead text-white-50 mb-0">
          My proposal to save College Football & Basketball.
        </p>
      </div>

      {/* The Problem Section */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-12">
          <div className="card shadow-sm border-0 hover-card">
            <div className="card-body p-5 bg-light">
              <h2 className="fw-bold mb-4 border-bottom pb-2">The Problem</h2>
              <p className="fs-5 text-secondary">
                I think everyone can agree that college sports—specifically conference realignment—has gotten completely out of hand. Oregon should not be playing Maryland in November, and I do not want to see BYU play UCF during conference play. 
              </p>
              <p className="fs-5 text-secondary mb-0">
                <strong>Locality and rivalries are dying.</strong> Here is my solution to bring geography, tradition, and logic back to college athletics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* College Football Section */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-12">
          <div className="card shadow-lg border-0 hover-card">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center mb-4 border-bottom pb-2">
                <h2 className="fw-bold mb-0">College Football Restructure</h2>
              </div>
              
              <p className="text-secondary mb-3">
                For College Football, we separate the top 64 teams from the rest. I understand the Group of 6 isn’t explicitly getting edged out, and I would feel for the teams who barely miss the cut, but let’s be real: the sport is heading in this direction anyway. I would even be open to the idea of promotion and relegation.
              </p>
              
              <div className="bg-light p-4 rounded mb-4">
                <h5 className="fw-bold text-dark">The New Format: 256 Teams</h5>
                <ul className="text-secondary mb-0">
                  <li><strong>4 Divisions</strong> of 64 teams.</li>
                  <li>Each division is split into <strong>8 Conferences</strong> of 8 teams each.</li>
                  <li>We included a few D2 Football programs to perfectly round out the 256 total.</li>
                </ul>
              </div>

              <div className="alert alert-primary mb-4" role="alert">
                <strong>Interactive Map:</strong> Use the Division filter on the right side of the dashboard below to click through and explore Divisions 1 through 4!
              </div>

              {/* Tableau Football Embed */}
              <div className="ratio border rounded shadow-sm" style={{ height: '850px' }}>
                <iframe 
                  src="https://public.tableau.com/views/NCAA_17777738957950/Football?:showVizHome=no&:embed=true" 
                  title="NCAA Football Restructure"
                  allowFullScreen
                  style={{ border: 'none', width: '100%', height: '100%' }}
                ></iframe>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* College Basketball Section */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-12">
          <div className="card shadow-lg border-0 hover-card">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center mb-4 border-bottom pb-2">
                <h2 className="fw-bold mb-0">College Basketball Restructure</h2>
              </div>
              
              <p className="text-secondary mb-3">
                I applied a similar concept to College Basketball, but scaled up to account for the larger volume of teams. The fact that the NCAA is considering expanding the tournament to 76 teams is ridiculous. The tournament should stick to 64 teams.
              </p>

              <div className="bg-light p-4 rounded mb-4">
                <h5 className="fw-bold text-dark">The New Format: 384 Teams</h5>
                <ul className="text-secondary mb-0">
                  <li><strong>2 Divisions</strong> of 192 teams each (Total: 384).</li>
                  <li>Each division has <strong>24 Conferences</strong> of 8 teams each.</li>
                  <li>We added around 20 D2 programs to hit the 384 mark.</li>
                  <li><strong>Why 192?</strong> Because 64 x 3 = 192. This means exactly 1/3 of the division makes the 64-team NCAA tournament.</li>
                </ul>
              </div>

              <div className="alert alert-danger mb-4" role="alert">
                <strong>Interactive Map:</strong> Use the Division filter on the right side of the dashboard below to toggle between Division 1 and Division 2!
              </div>

              {/* Tableau Basketball Embed */}
              <div className="ratio border rounded shadow-sm" style={{ height: '850px' }}>
                <iframe 
                  src="https://public.tableau.com/views/NCAA_17777738957950/Basketball?:showVizHome=no&:embed=true" 
                  title="NCAA Basketball Restructure"
                  allowFullScreen
                  style={{ border: 'none', width: '100%', height: '100%' }}
                ></iframe>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-5">
        <Link to="/" className="btn btn-lg btn-custom-outline bg-dark text-white rounded-pill px-4 hover-card">
          ← Back to Resume
        </Link>
      </div>

    </div>
  );
};

export default Ncaa;