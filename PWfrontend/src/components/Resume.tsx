import React from 'react';
import { Link } from 'react-router-dom';
import './Resume.css';
import { FaGithub, FaLinkedin } from 'react-icons/fa'; 

const Resume: React.FC = () => {
  return (
    <div className="container mt-5 mb-5">
      
      {/* Header Section */}
      <header className="text-center mb-5 resume-header-bg p-5">
        <img 
          src="/profile.jpg" 
          alt="Reece Williams" 
          className="profile-img" 
        />
        
        <h1 className="display-4 fw-bold text-white mb-3">Reece Williams</h1>
        
        <p className="lead fs-4 mb-3">
          Early-Career Data Analyst with experience in SQL, Python, and Tableau, <br />
          delivering data-driven insights through dashboards and research analysis.
        </p>
        
        <p className="fs-5 mb-4 text-white-50">
          (737) 349-4771 | reecekwilliams428@gmail.com
        </p>
        
        <div className="mt-4">
          <a 
            href="https://github.com/reecekw" 
            className="btn btn-lg btn-custom-outline rounded-pill px-4 mx-2 d-inline-flex align-items-center" 
            target="_blank" 
            rel="noreferrer"
          >
            <FaGithub size={24} className="me-2" /> GitHub
          </a>
          <a 
            href="https://linkedin.com/in/reece-k-williams" 
            className="btn btn-lg btn-custom-outline rounded-pill px-4 mx-2 d-inline-flex align-items-center" 
            target="_blank" 
            rel="noreferrer"
          >
            <FaLinkedin size={24} className="me-2" /> LinkedIn
          </a>
        </div>
      </header>

      {/* Education Section */}
      <section className="mb-5">
        <h2 className="section-title">Education</h2>
        
        <div className="card shadow-sm border-0 mb-3 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Brigham Young University - Marriott School of Business</h3>
              <span className="badge badge-custom mt-2 mt-md-0">Apr 2027</span>
            </div>
            <p className="card-text text-muted mt-2 mb-3"><strong>Bachelor of Science: Information Systems</strong> | Provo, UT</p>
            <ul className="mb-0 text-secondary">
              <li><strong>GPA:</strong> 3.7</li>
              <li><strong>Coursework:</strong> Product Management and Systems Design, Data Analytics & Visualization, Web Development</li>
              <li><strong>Involvement:</strong> Co-Vice President of Activities, Association of Information Systems (AIS); Member of Collegiate Leadership Competition Club</li>
            </ul>
          </div>
        </div>

        <div className="card shadow-sm border-0 mb-3 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Cascadia College</h3>
              <span className="badge badge-custom mt-2 mt-md-0">Apr 2022</span>
            </div>
            <p className="card-text text-muted mt-2 mb-0"><strong>Associate of Arts, Integrated Studies</strong> | Bothell, WA (GPA: 3.86)</p>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-5">
        <h2 className="section-title">Experience</h2>
        
        {/* Data Analyst */}
        <div className="card shadow-sm border-0 mb-4 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Data Analyst</h3>
              <span className="badge badge-custom mt-2 mt-md-0">Mar 2026 – Present</span>
            </div>
            <h6 className="card-subtitle mt-2 text-primary fw-semibold">BYU Auxiliaries & Program Technologies | Provo, UT</h6>
            <ul className="mt-3 mb-0 text-secondary">
              <li>Developed 10+ Tableau dashboards for stakeholders, improving data-driven decision-making across operations</li>
              <li>Gathered and translated business requirements into Tableau dashboards, improving stakeholder usability for 50+ users</li>
              <li>Extracted and transformed data using SQL, enabling accurate and efficient analysis of key datasets</li>
            </ul>
          </div>
        </div>

        {/* Student Researcher */}
        <div className="card shadow-sm border-0 mb-4 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Student Researcher</h3>
              <span className="badge badge-custom mt-2 mt-md-0">Apr 2025 – Dec 2025</span>
            </div>
            <h6 className="card-subtitle mt-2 text-primary fw-semibold">BYU Marriott Adjunct Experience Research Team | Provo, UT</h6>
            <ul className="mt-3 mb-0 text-secondary">
              <li>Conducted 35+ 1x1 qualitative interviews with adjunct faculty, gathering insights on experience and institutional support</li>
              <li>Analyzed interview transcripts using AI-assisted (Gemini) qualitative analysis to identify recurring themes</li>
              <li>Synthesized and presented research findings to 100+ faculty and university administrators at BYU Belonging Conference</li>
            </ul>
          </div>
        </div>

        {/* Volunteer */}
        <div className="card shadow-sm border-0 mb-3 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Volunteer Representative</h3>
              <span className="badge badge-custom mt-2 mt-md-0">Aug 2022 – Aug 2024</span>
            </div>
            <h6 className="card-subtitle mt-2 text-primary fw-semibold">The Church of Jesus Christ of Latter-day Saints | San Pedro Sula, Honduras</h6>
            <ul className="mt-3 mb-0 text-secondary">
              <li>Trained 20+ volunteers weekly, improving teaching effectiveness and interpersonal communication</li>
              <li>Led 100+ hours of community service projects, collaborating with leaders to support families and strengthen communities</li>
              <li>Achieved Spanish fluency, enabling cross-cultural relationships, public presentations, and leadership in diverse settings</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Skills Section */}
      <section className="mb-5">
        <h2 className="section-title">Technical Skills</h2>
        <div className="card shadow-sm border-0 mb-4 hover-card">
          <div className="card-body p-4">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="p-3 bg-light rounded h-100">
                  <h5 className="h6 fw-bold text-dark">Data & BI</h5>
                  <p className="mb-0 text-secondary small">SQL, Tableau, Advanced Excel, VBA</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded h-100">
                  <h5 className="h6 fw-bold text-dark">Development & Cloud</h5>
                  <p className="mb-0 text-secondary small">Python, JavaScript, HTML/CSS, .NET, React, AWS (EC2, S3), Git</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded h-100">
                  <h5 className="h6 fw-bold text-dark">Artificial Intelligence</h5>
                  <p className="mb-0 text-secondary small">Prompt Engineering, Generative AI (ChatGPT, Gemini, Cursor)</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded h-100">
                  <h5 className="h6 fw-bold text-dark">Certifications</h5>
                  <p className="mb-0 text-secondary small">Professional Scrum Master (PSM 1), Scrum.org (2026)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-5">
        <h2 className="section-title">Projects</h2>
        <div className="card shadow-sm border-0 hover-card">
          <div className="card-body p-4">
            <ul className="mb-0 text-secondary lh-lg">
              <li className="mb-2">
                <strong>Relational Database & Dashboard:</strong> Designed and normalized relational database (SQL, Excel, Tableau), enabling efficient stakeholder reporting and improved decision-making (2025)
              </li>
              <li className="mb-2">
                <strong>Machine Learning Pipeline Application:</strong> Developed full-stack application (React, .NET, Entity Framework) with ML pipeline and secure authentication (HTTPS), supporting scalable and secure user data management (2026)
              </li>
              <li>
                <strong>Portfolio Website:</strong> Developed personal portfolio website (React, .NET), showcasing projects and technical skills with responsive UI
              </li>
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
              <li><strong>Eagle Scout</strong>, Scouts of America (2020)</li>
              <li><strong>Regional Champion in Global Business</strong>, Future Business Leaders of America (FBLA) (2020)</li>
              <li><strong>Varsity Boys Soccer Coach’s Leadership Award</strong> (2022)</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Meet Maudi Banner */}
      <section className="mb-5 text-center mt-5">
        <div className="card shadow-lg border-0 coral-banner-bg p-5 hover-card">
          <h2 className="text-white fw-bold mb-3 display-6">Meet My Wife, Maudi!</h2>
          <p className="text-white-50 mb-4 fs-5">
            She is incredible. Check out her resume to see what she is up to.
          </p>
          <div>
            <Link to="/maudi" className="btn btn-lg btn-light rounded-pill px-5 fw-bold text-dark shadow-sm">
              View Maudi's Resume
            </Link>
          </div>
        </div>
      </section>

      {/* Sports & Activities Banner */}
      <section className="mb-5 text-center mt-5">
        <div className="card shadow-lg border-0 resume-header-bg p-5 hover-card">
          <h2 className="text-white fw-bold mb-4 display-6">Sports & Activities</h2>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link 
              to="/ncaa" 
              className="btn btn-lg btn-light rounded-pill px-5 fw-bold text-dark shadow-sm hover-card"
            >
              NCAA
            </Link>
            <Link 
              to="/mundial" 
              className="btn btn-lg btn-light rounded-pill px-5 fw-bold text-dark shadow-sm hover-card"
            >
              World Cup
            </Link>
            <Link 
              to="/my-teams" 
              className="btn btn-lg btn-light rounded-pill px-5 fw-bold text-dark shadow-sm hover-card"
            >
              My Teams
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resume;