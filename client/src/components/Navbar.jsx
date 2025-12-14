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
    <nav>
      {/* Brand Logo */}
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.8rem' }} className="text-gradient">TRAJECTORY</span > 
      </Link>

      {/* Navigation Links */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">
              <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                Join Now
              </button>
            </Link>
          </>
        ) : (
          <>
            <span style={{ color: 'var(--text-secondary)' }}>
              Future Of ‎ <span style={{ color: 'var(--accent-cyan)' }}>{user?.name}</span>
            </span>
            <Link to="/dashboard">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="btn-danger"
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