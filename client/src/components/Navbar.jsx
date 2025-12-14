import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function Navbar() {
  const { token, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-8 py-6 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="text-2xl font-bold text-accent-cyan flex items-center gap-2">
        <span className="text-3xl">⚡</span>
        <span className="text-gradient">TRAJECTORY</span>
      </Link>

      {/* Navigation Links */}
      <div className="ml-auto flex items-center gap-8">
        {!token ? (
          <>
            <Link to="/login" className="text-slate-300 font-medium text-lg hover:text-accent-cyan transition-colors">
              Login
            </Link>
            <Link to="/register">
              <button className="btn-primary !px-6 !py-2 !text-sm">
                Join Now
              </button>
            </Link>
          </>
        ) : (
          <>
            <span className="text-slate-400 font-medium">
              Future Of ‎ <span className="text-accent-cyan">{user?.name}</span>
            </span>
            <Link to="/dashboard" className="text-slate-300 font-medium text-lg hover:text-accent-cyan transition-colors">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="btn-logout"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;