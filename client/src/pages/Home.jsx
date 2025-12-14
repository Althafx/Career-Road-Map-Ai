import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page-container !pt-0 relative overflow-hidden">
      {/* Water Droplet Ripple Background */}
      <div className="ripple-container">
        <div className="ripple"></div>
        <div className="ripple"></div>
        <div className="ripple"></div>
      </div>

      <div className="min-h-screen flex flex-col items-center text-center p-8 pt-[19vh] relative">

        <h1 className="text-6xl mb-8 animate-[fade-in-up_1s_ease-out] z-10 relative">
          <span className="text-gradient"> TRAJECTORY </span>
        </h1>

        <h1 className="text-2xl mb-24 animate-[fade-in-up_1s_ease-out] z-10 relative">
          <span className="text-gradient"> AI </span> career map generator
        </h1>

        <h1 className="text-5xl mb-12 animate-[fade-in-up_1s_ease-out] z-10 relative">
          Ready to <span className="text-gradient">Change Your Life?</span>
        </h1>

        <p className="text-2xl text-slate-400 max-w-3xl mx-auto mb-12 animate-[fade-in-up_1s_ease-out_0.3s_backwards] z-10 relative">
          Get your AI-generated career roadmap right now. The future of career planning is here.
        </p>

        <Link to="/assessment" className="animate-[fade-in-up_1s_ease-out_0.6s_backwards] z-10 relative">
          <button className="btn-primary !text-xl !px-12 !py-5">
            Get Started
          </button>
        </Link>

        {/* Floating AI Elements */}
        <div className="absolute top-[20%] left-[10%] w-[100px] h-[100px] bg-gradient-to-tr from-accent-cyan to-transparent rounded-full blur-[40px] animate-float opacity-60 z-0"></div>

        <div className="absolute bottom-[30%] right-[10%] w-[150px] h-[150px] bg-gradient-to-tr from-accent-purple to-transparent rounded-full blur-[50px] animate-[float_8s_ease-in-out_infinite_reverse] opacity-50 z-0"></div>
      </div>

      {/* About Section */}
      <div className="py-20 px-8 max-w-7xl mx-auto -mt-36 relative z-10">
        <h2 className="text-center mb-12 text-4xl">
          How <span className="text-gradient">AI Career Map</span> Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-accent-cyan text-xl mb-4">1. Take Assessment</h3>
            <p className="text-slate-300">Tell our AI about your current skills, interests, and career goals in a simple interaction.</p>
          </div>

          <div className="glass-panel p-8 text-center animate-[fade-in-up_0.5s_ease-out_0.2s_backwards]">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-accent-purple text-xl mb-4">2. AI Analysis</h3>
            <p className="text-slate-300">Our advanced AI engine analyzes your profile against millions of career paths.</p>
          </div>

          <div className="glass-panel p-8 text-center animate-[fade-in-up_0.5s_ease-out_0.4s_backwards]">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-accent-blue text-xl mb-4">3. Get Your Roadmap</h3>
            <p className="text-slate-300">Receive a personalized, step-by-step 12-month guide to reach your dream job.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;