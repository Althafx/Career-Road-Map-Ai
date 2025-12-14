import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import useAuthStore from '../store/authStore';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(formData);
      setAuth(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-[fade-in-up_0.5s_ease-out] !mt-0">
        <h2 className="text-center mb-8 text-3xl">
          Access <span className="text-gradient">Terminal</span>
        </h2>

        {error && <div className="text-red-500 text-center mb-4 bg-red-500/10 p-2 rounded border border-red-500/50">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-accent-cyan uppercase tracking-wider font-semibold ml-2 text-xs block mb-2">Email Address</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full bg-slate-900/60 border border-white/10 text-white p-4 rounded-xl focus:bg-slate-900/80 focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.15)] outline-none transition-all"
            />
          </div>

          <div className="mb-8">
            <label className="text-accent-cyan uppercase tracking-wider font-semibold ml-2 text-xs block mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full bg-slate-900/60 border border-white/10 text-white p-4 rounded-xl focus:bg-slate-900/80 focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.15)] outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full p-4 mb-4 flex justify-center"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login System'}
          </button>
        </form>

        <p className="text-center mt-4 text-slate-400">
          New User? <Link to="/register" className="text-accent-purple font-bold hover:text-accent-cyan transition-colors">Initialize Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;