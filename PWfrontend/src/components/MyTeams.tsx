import React from 'react';
import { Link } from 'react-router-dom';
import './Resume.css'; 

const MyTeams: React.FC = () => {
  return (
    <div className="container mt-5 mb-5">
      
      {/* Header Section */}
      <div className="text-center mb-5 resume-header-bg p-5">
        <h1 className="display-4 fw-bold text-white mb-3">My Teams</h1>
        <p className="lead text-white-50 mb-0">
          The teams I follow year-round.
        </p>
      </div>

      {/* 1. BYU Cougars */}
      <div className="card shadow-lg border-0 mb-4 hover-card team-banner-bg">
        <div className="row g-0 align-items-center">
          <div className="col-md-3 text-center p-4 logo-zone bg-dark bg-opacity-25">
            {/* Make sure to add byu.png to your public folder! */}
            <img src="/byu.png" alt="BYU Cougars" className="img-fluid" style={{ maxHeight: '110px' }} />
          </div>
          <div className="col-md-9">
            <div className="card-body p-4 p-md-5">
              <h2 className="display-6 fw-bold mb-2">BYU Cougars</h2>
              <p className="fs-5 text-white-50 mb-0">NCAA Football & Basketball</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Minnesota Vikings */}
      <div className="card shadow-lg border-0 mb-4 hover-card team-banner-bg">
        <div className="row g-0 align-items-center">
          <div className="col-md-3 text-center p-4 logo-zone bg-dark bg-opacity-25">
            <img src="/vikings.png" alt="Minnesota Vikings" className="img-fluid" style={{ maxHeight: '110px' }} />
          </div>
          <div className="col-md-9">
            <div className="card-body p-4 p-md-5">
              <h2 className="display-6 fw-bold mb-2">Minnesota Vikings</h2>
              <p className="fs-5 text-white-50 mb-0">National Football League (NFL)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Minnesota Timberwolves */}
      <div className="card shadow-lg border-0 mb-4 hover-card team-banner-bg">
        <div className="row g-0 align-items-center">
          <div className="col-md-3 text-center p-4 logo-zone bg-dark bg-opacity-25">
            <img src="/timberwolves.png" alt="Minnesota Timberwolves" className="img-fluid" style={{ maxHeight: '110px' }} />
          </div>
          <div className="col-md-9">
            <div className="card-body p-4 p-md-5">
              <h2 className="display-6 fw-bold mb-2">Minnesota Timberwolves</h2>
              <p className="fs-5 text-white-50 mb-0">National Basketball Association (NBA)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Minnesota Wild */}
      <div className="card shadow-lg border-0 mb-4 hover-card team-banner-bg">
        <div className="row g-0 align-items-center">
          <div className="col-md-3 text-center p-4 logo-zone bg-dark bg-opacity-25">
            <img src="/wild.png" alt="Minnesota Wild" className="img-fluid" style={{ maxHeight: '110px' }} />
          </div>
          <div className="col-md-9">
            <div className="card-body p-4 p-md-5">
              <h2 className="display-6 fw-bold mb-2">Minnesota Wild</h2>
              <p className="fs-5 text-white-50 mb-0">National Hockey League (NHL)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. European Soccer */}
      <div className="card shadow-lg border-0 mb-5 hover-card team-banner-bg">
        <div className="row g-0 align-items-center">
          <div className="col-md-3 text-center p-4 logo-zone bg-dark bg-opacity-25">
            <img src="/soccer.png" alt="Premier League & UCL" className="img-fluid" style={{ maxHeight: '110px' }} />
          </div>
          <div className="col-md-9">
            <div className="card-body p-4 p-md-5">
              <h2 className="display-6 fw-bold mb-2">European Soccer</h2>
              <p className="fs-5 text-white-50 mb-0">Premier League & UEFA Champions League</p>
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

export default MyTeams;