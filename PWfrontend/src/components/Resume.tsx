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
        
        <p className="lead fs-5 mb-3 text-white">
          Data & Business Intelligence Analyst who turns operational data into business decisions with Tableau, SQL, and Excel. Built 30+ Tableau dashboards that exposed unnecessary labor and helped avoid thousands of dollars in costs. Skilled at translating stakeholder needs into technical solutions and communicating insights to technical and non-technical audiences.
        </p>

        <p className="fs-6 mb-4 text-white-50">
          (737) 349-4771 | reecekw428@gmail.com | reece-williams.com
        </p>
        
        <div className="mt-4 d-flex justify-content-center flex-wrap gap-2">
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
              <h3 className="h5 card-title fw-bold mb-0">Brigham Young University – Marriott School of Business</h3>
              <span className="badge badge-custom mt-2 mt-md-0">Apr 2028</span>
            </div>
            <p className="card-text text-muted mt-2 mb-0"><strong>Master of Information Systems Management</strong> | Provo, UT</p>
            <p className="card-text text-muted mb-3"><strong>Bachelor of Science in Information Systems</strong></p>
            <ul className="mb-0 text-secondary">
              <li><strong>GPA:</strong> 3.74 | <strong>Minor:</strong> Healthcare Leadership (In Progress)</li>
              <li><strong>Relevant Coursework:</strong> Enterprise Infrastructure, Machine Learning, Enterprise Application Development, Project Management & Systems Design, Database Systems, Exploratory Data Analysis</li>
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
                  <h5 className="h6 fw-bold text-dark">Data & Business Intelligence</h5>
                  <p className="mb-0 text-secondary small">Tableau, SQL, Advanced Excel, VBA, Exploratory Data Analysis, Data Visualization</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded h-100">
                  <h5 className="h6 fw-bold text-dark">Cloud & Infrastructure (AWS)</h5>
                  <p className="mb-0 text-secondary small">EC2, S3, CloudFront, IAM, VPC, Aurora, RDS</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded h-100">
                  <h5 className="h6 fw-bold text-dark">Development</h5>
                  <p className="mb-0 text-secondary small">Python, JavaScript, React, .NET, Entity Framework, HTML/CSS, Git</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded h-100">
                  <h5 className="h6 fw-bold text-dark">Artificial Intelligence</h5>
                  <p className="mb-0 text-secondary small">Generative AI, Prompt Engineering, ChatGPT, Gemini, Cursor</p>
                </div>
              </div>
              <div className="col-12">
                <div className="p-3 bg-light rounded">
                  <h5 className="h6 fw-bold text-dark">Certifications</h5>
                  <p className="mb-0 text-secondary small">Professional Scrum Master I (PSM I), Scrum.org (2026)</p>
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
              <li>Built <strong>30+ Tableau dashboards</strong> to identify operational inefficiencies, helping eliminate <strong>thousands of dollars</strong> in unnecessary labor costs</li>
              <li>Translated reporting needs from <strong>50+ stakeholders</strong> into Tableau dashboards that support operational decisions</li>
              <li>Extracted, transformed, and analyzed operational datasets using SQL, delivering accurate reporting and actionable insights</li>
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
              <li>Conducted 35+ one-on-one qualitative interviews with adjunct faculty on employee experience and institutional support</li>
              <li>Identified recurring themes across interview transcripts using Gemini-assisted qualitative analysis</li>
              <li>Presented research findings to 100+ faculty and university administrators at the BYU Belonging Conference</li>
            </ul>
          </div>
        </div>

        {/* Volunteer Representative */}
        <div className="card shadow-sm border-0 mb-3 hover-card">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h3 className="h5 card-title fw-bold mb-0">Volunteer Representative – Spanish Fluency</h3>
              <span className="badge badge-custom mt-2 mt-md-0">Aug 2022 – Aug 2024</span>
            </div>
            <h6 className="card-subtitle mt-2 text-primary fw-semibold">The Church of Jesus Christ of Latter-day Saints | San Pedro Sula, Honduras</h6>
            <ul className="mt-3 mb-0 text-secondary">
              <li>Trained 20+ volunteers weekly in teaching, communication, and leadership skills, strengthening team effectiveness</li>
              <li>Led 100+ hours of community service initiatives, partnering with local leaders to support families and communities</li>
              <li>Achieved Spanish fluency, leading public presentations and building relationships across cultures</li>
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
                <strong>Relational Database Design (2025):</strong> Designed and normalized a relational SQL database, enabling structured data management and supporting Excel and Tableau reporting
              </li>
              <li className="mb-2">
                <strong>Full-Stack App (2026):</strong> Built a React/.NET/Entity Framework app with an ML pipeline and HTTPS authentication
              </li>
              <li>
                <strong>Personal Portfolio Website (2026):</strong> Built a responsive React and .NET site with Git version control to showcase projects
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
              <li>Co-Vice President of Activities, Association of Information Systems (AIS): Connected 400+ students with company representatives through 5 student socials, including 3 sponsored by EY, Solvd, and Anglepoint</li>
              <li>Co-founded BYU's Collegiate Leadership Competition Club; helped lead teams to 3rd- and 2nd-place overall finishes at consecutive international competitions, earning 1st in Process in 2026</li>
              <li>Future Business Leaders of America (FBLA), Regional Champion in Global Business (2020)</li>
              <li>Eagle Scout, Boy Scouts of America</li>
            </ul>
          </div>
        </div>
      </section>
      


      {/* Sports & Activities Banner */}
      <section className="mb-5 text-center mt-5">
        <div className="card shadow-lg border-0 resume-header-bg p-5 hover-card">
          <h2 className="text-white fw-bold mb-4 display-6">Sports & Activities</h2>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link 
              to="/my-teams" 
              className="btn btn-lg btn-light rounded-pill px-5 fw-bold text-dark shadow-sm hover-card"
            >
              My Teams
            </Link>
            <Link 
              to="/ncaa" 
              className="btn btn-lg btn-light rounded-pill px-5 fw-bold text-dark shadow-sm hover-card"
            >
              NCAA
            </Link>
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
    </div>
  );
};

export default Resume;