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
        
        <p className="lead fs-4 mb-3">
         Dynamic Healthcare Marketer & Admissions Coordinator driving census growth <br />
         and delivering exceptional patient experiences in skilled nursing facilities.
        </p>
        <br />
      </header>

      {/* Experience Section */}
      <section className="mb-5">
        <h2 className="section-title">Experience</h2>
        
        {/* Stonehenge */}
        <div className="card shadow-sm border-0 mb-4 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Admissions & Marketing Director</h3>
              <span className="badge badge-custom mt-2 mt-md-0">Sept 2025 – Present</span>
            </div>
            <h6 className="card-subtitle mt-2 text-primary fw-semibold">Stonehenge of Orem | Orem, UT</h6>
            <ul className="mt-3 mb-0 text-secondary">
              <li>Drive facility census growth by building and maintaining strategic relationships with local hospitals, physicians, and community partners.</li>
              <li>Develop and execute targeted marketing campaigns to highlight facility amenities, clinical capabilities, and quality of care.</li>
              <li>Conduct facility tours for prospective residents and their families, addressing concerns and showcasing a premier healthcare environment.</li>
            </ul>
          </div>
        </div>

        {/* Provo Rehab */}
        <div className="card shadow-sm border-0 mb-4 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Admissions Coordinator</h3>
              <span className="badge badge-custom mt-2 mt-md-0">May 2025 – Aug 2025</span>
            </div>
            <h6 className="card-subtitle mt-2 text-primary fw-semibold">Provo Rehab | Provo, UT</h6>
            <ul className="mt-3 mb-0 text-secondary">
              <li>Managed the end-to-end patient intake process, ensuring seamless transitions from acute care settings to the rehabilitation facility.</li>
              <li>Verified complex Medicare, Medicaid, and commercial insurance benefits, communicating financial responsibilities clearly to patients and families.</li>
              <li>Collaborated daily with clinical teams, discharge planners, and social workers to evaluate patient readiness and facility capacity.</li>
            </ul>
          </div>
        </div>

        {/* Estrella */}
        <div className="card shadow-sm border-0 mb-3 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Admissions Coordinator & HR assistant</h3>
              <span className="badge badge-custom mt-2 mt-md-0">Nov 2024 – May 2025</span>
            </div>
            <h6 className="card-subtitle mt-2 text-primary fw-semibold">Estrella | Glendale, AZ</h6>
            <ul className="mt-3 mb-0 text-secondary">
              <li>Served as the primary point of contact for residents, families, and vendors, ensuring a welcoming and professional front-office environment.</li>
              <li>Streamlined administrative workflows, including answering multi-line phone systems, managing secure medical records, and processing facility mail.</li>
              <li>Resolved patient and family grievances promptly, escalating critical clinical concerns to the Director of Nursing when necessary.</li>
            </ul>
          </div>
        </div>

  {/* Mission*/}
        <div className="card shadow-sm border-0 mb-3 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h3 className="h5 card-title fw-bold mb-0">Volunteer Representative</h3>
              <span className="badge badge-custom mt-2 mt-md-0">May 2023 – Oct 2024</span>
            </div>
            <h6 className="card-subtitle mt-2 text-primary fw-semibold">The Church of Jesus Christ of Latter-day Saints | New York & Dallas, Texas</h6>
            <ul className="mt-3 mb-0 text-secondary">
              <li>Gave tours to visitors and conducted informational sessions about the church's mission and activities.</li>
              <li>Participated in 100+ hours of community service projects, collaborating with leaders to support families and strengthen communities.</li>
              <li>Taught people from many different cultures, fostering understanding and connection.</li>
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
              <li><strong>Collegiate Athlete:</strong> JUCO Volleyball at Mesa Community College</li>
              <li><strong>Student Ambassador</strong> at Mesa Community College</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Back to Reece Banner */}
      <section className="mb-5 text-center mt-5">
        <div className="card shadow-lg border-0 resume-header-bg p-5 hover-card">
          <h2 className="text-white fw-bold mb-3 display-6">Check out Reece's Resume!</h2>
          <p className="text-white-50 mb-4 fs-5">
            Head back to the main page to see my husband's resume!
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