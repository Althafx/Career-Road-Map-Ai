import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page-container" style={{ paddingTop: 0, position: 'relative', overflow: 'hidden' }}>
      {/* Water Droplet Ripple Background */}
      <div className="ripple-container">
        <div className="ripple"></div>
        <div className="ripple"></div>
        <div className="ripple"></div>
      </div>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
        paddingTop: '19vh', /* Moved up from middle */
        position: 'relative'
      }}>
      

        
        <h1 style={{
          fontSize: '4rem',
          marginBottom: '2rem',
          animation: 'fade-in-up 1s ease-out',
          zIndex: 1
        }}>
          <span className="text-gradient"> TRAJECTORY </span>
        </h1>

         <h1 style={{
          fontSize: '1.6rem',
          marginBottom: '6rem',
          animation: 'fade-in-up 1s ease-out',
          zIndex: 1
        }}>
         <span className="text-gradient"> AI </span> career map generator 
        </h1>

        <h1 style={{
          fontSize: '3rem',
          marginBottom: '3rem',
          animation: 'fade-in-up 1s ease-out',
          zIndex: 1
        }}>
          Ready to <span className="text-gradient">Change Your Life?</span>
        </h1>

        <p style={{
          fontSize: '1.5rem',
          color: 'var(--text-secondary)',
          maxWidth: '800px',
          margin: '0 auto 3rem',
          animation: 'fade-in-up 1s ease-out 0.3s backwards',
          zIndex: 1
        }}>
          Get your AI-generated career roadmap right now. The future of career planning is here.
        </p>

        <Link to="/assessment" style={{ animation: 'fade-in-up 1s ease-out 0.6s backwards', zIndex: 1 }}>
          <button className="btn-primary" style={{ fontSize: '1.2rem', padding: '1.2rem 3rem' }}>
            Get Started
          </button>
        </Link>

        {/* Floating AI Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(45deg, var(--accent-cyan), transparent)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
          opacity: 0.6,
          zIndex: 0
        }}></div>

        <div style={{
          position: 'absolute',
          bottom: '30%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'linear-gradient(45deg, var(--accent-purple), transparent)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'float 8s ease-in-out infinite reverse',
          opacity: 0.5,
          zIndex: 0
        }}></div>
      </div>

      {/* About Section */}
      <div style={{
        padding: '5rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        marginTop: '-9rem' /* Pulled up slightly as requested */
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
          How <span className="text-gradient">AI Career Map</span> Works
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>1. Take Assessment</h3>
            <p>Tell our AI about your current skills, interests, and career goals in a simple interaction.</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', animationDelay: '0.2s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
            <h3 style={{ color: 'var(--accent-purple)', marginBottom: '1rem' }}>2. AI Analysis</h3>
            <p>Our advanced AI engine analyzes your profile against millions of career paths.</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', animationDelay: '0.4s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>3. Get Your Roadmap</h3>
            <p>Receive a personalized, step-by-step 12-month guide to reach your dream job.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;