import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import useAuthStore from '../store/authStore';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setAuth(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-[fade-in-up_0.5s_ease-out] !mt-0">
        <h2 className="text-center mb-8 text-3xl">
          Initialize <span className="text-gradient">Profile</span>
        </h2>

        {error && <div className="text-red-500 text-center mb-4 bg-red-500/10 p-2 rounded border border-red-500/50">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-accent-cyan uppercase tracking-wider font-semibold ml-2 text-xs block mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/60 border border-white/10 text-white p-4 rounded-xl focus:bg-slate-900/80 focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.15)] outline-none transition-all"
            />
          </div>

          <div className="mb-4">
            <label className="text-accent-cyan uppercase tracking-wider font-semibold ml-2 text-xs block mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/60 border border-white/10 text-white p-4 rounded-xl focus:bg-slate-900/80 focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.15)] outline-none transition-all"
            />
          </div>

          <div className="mb-4">
            <label className="text-accent-cyan uppercase tracking-wider font-semibold ml-2 text-xs block mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/60 border border-white/10 text-white p-4 rounded-xl focus:bg-slate-900/80 focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.15)] outline-none transition-all"
            />
          </div>

          <div className="mb-8">
            <label className="text-accent-cyan uppercase tracking-wider font-semibold ml-2 text-xs block mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/60 border border-white/10 text-white p-4 rounded-xl focus:bg-slate-900/80 focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.15)] outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full p-4 mb-4 flex justify-center"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 text-slate-400">
          Already have an account? <Link to="/login" className="text-accent-purple font-bold hover:text-accent-cyan transition-colors">Login System</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;