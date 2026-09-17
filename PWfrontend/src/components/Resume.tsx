import React from 'react';
import { Link } from 'react-router-dom';
import './Resume.css';
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';

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
        
        <p className="lead fs-5 mb-3 text-white">
          Information Systems Management professional with experience translating stakeholder needs into data-driven solutions using SQL, Tableau, Python, and business analysis. Known for turning ambiguous problems into actionable insights, communicating with technical and non-technical audiences, and collaborating to deliver technology solutions.
        </p>
        
        <p className="fs-6 mb-4 text-white-50">
          (737) 349-4771 | reecekwilliams428@gmail.com | reece-williams.com
        </p>
        
        <div className="mt-4 d-flex justify-content-center flex-wrap gap-2">
          <a 
            href="https://reece-williams.com" 
            className="btn btn-lg btn-custom-outline rounded-pill px-4 d-inline-flex align-items-center" 
            target="_blank" 
            rel="noreferrer"
          >
            <FaGlobe size={20} className="me-2" /> Website
          </a>
          <a 
            href="https://linkedin.com/in/reece-k-williams" 
            className="btn btn-lg btn-custom-outline rounded-pill px-4 d-inline-flex align-items-center" 
            target="_blank" 
            rel="noreferrer"
          >
            <FaLinkedin size={20} className="me-2" /> LinkedIn
          </a>
          <a 
            href="https://github.com/reecekw" 
            className="btn btn-lg btn-custom-outline rounded-pill px-4 d-inline-flex align-items-center" 
            target="_blank" 
            rel="noreferrer"
          >
            <FaGithub size={20} className="me-2" /> GitHub
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
              <span className="badge badge-custom mt-2 mt-md-0">Apr 2028</span>
            </div>
            <p className="card-text text-muted mt-2 mb-3"><strong>Master’s of Information Systems Management</strong> | Provo, UT</p>
            <ul className="mb-0 text-secondary">
              <li><strong>GPA:</strong> 3.74</li>
              <li>Co-Vice President of Activities, Association of Information Systems (AIS)</li>
              <li>Member of Collegiate Leadership Competition Club</li>
              <li><strong>Relevant Coursework:</strong> Product Management and Systems Design, Data Analytics & Visualization, Web Development</li>
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
                  <h5 className="h6 fw-bold text-dark">Development</h5>
                  <p className="mb-0 text-secondary small">Python, JavaScript, HTML/CSS, .NET, React</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded h-100">
                  <h5 className="h6 fw-bold text-dark">Artificial Intelligence (AI)</h5>
                  <p className="mb-0 text-secondary small">Prompt Engineering, Generative AI (ChatGPT, Gemini, Cursor)</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded h-100">
                  <h5 className="h6 fw-bold text-dark">Cloud & Tools</h5>
                  <p className="mb-0 text-secondary small">AWS (EC2, S3), Git</p>
                </div>
              </div>
              <div className="col-12">
                <div className="p-3 bg-light rounded">
                  <h5 className="h6 fw-bold text-dark">Certifications</h5>
                  <p className="mb-0 text-secondary small">Professional Scrum Master (PSM 1), Scrum.org (2026)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-5">
        <h2 className="section-title">Experience</h2>
        
        {/* Business Report Writer */}
        <div className="card shadow-sm border-0 mb-4 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Business Report Writer</h3>
              <span className="badge badge-custom mt-2 mt-md-0">Mar 2026 – Present</span>
            </div>
            <h6 className="card-subtitle mt-2 text-primary fw-semibold">BYU Dining Services | Provo, UT</h6>
            <ul className="mt-3 mb-0 text-secondary">
              <li>Developed 10+ Tableau dashboards for stakeholders, improving data-driven decision-making across operations</li>
              <li>Translated business requirements from 50+ users into Tableau dashboards, improving stakeholder usability and reporting</li>
              <li>Extracted and transformed datasets using SQL, enabling accurate analysis and efficient business reporting</li>
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
              <li>Analyzed interview transcripts using Gemini-assisted qualitative analysis, identifying recurring themes across research data</li>
              <li>Synthesized and presented research findings to 100+ faculty and university administrators at BYU Belonging Conference</li>
            </ul>
          </div>
        </div>

        {/* Volunteer Representative */}
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

      {/* Project Experience Section */}
      <section className="mb-5">
        <h2 className="section-title">Project Experience</h2>
        <div className="card shadow-sm border-0 hover-card">
          <div className="card-body p-4">
            <ul className="mb-0 text-secondary lh-lg">
              <li className="mb-2">
                Designed and normalized a relational database (SQL, Excel, Tableau), enabling efficient stakeholder reporting and improved decision-making (2025)
              </li>
              <li className="mb-2">
                Developed a full-stack application (React, .NET, Entity Framework) with an ML pipeline and secure authentication (HTTPS), supporting scalable and secure user data management (2026)
              </li>
              <li>
                Developed a responsive personal portfolio website using React and .NET to showcase technical projects and skills
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
              <li>Associate of Arts, Integrated Studies at Cascadia College, Bothell, WA (GPA: 3.86) – Apr 2022</li>
              <li>Eagle Scout, Boy Scouts of America (2020)</li>
              <li>Future Business Leaders of America (FBLA), Regional Champion in Global Business (2020)</li>
              <li>Varsity Boys Soccer Coach’s Leadership Award (2022)</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Meet Maudi Banner */}
      <section className="mb-5 text-center mt-5">
        <div className="card shadow-lg border-0 coral-banner-bg p-5 hover-card">
          <h2 className="text-white fw-bold mb-3 display-6">Meet My Wife, Maudi!</h2>
          <p className="text-white-50 mb-4 fs-5">
            She is a remarkable woman with a strong work ethic and a passion for excellence. Check out her resume to see what she is up to.
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