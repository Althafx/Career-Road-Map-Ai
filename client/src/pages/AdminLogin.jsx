import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAdminStore from '../store/adminStore';

function AdminLogin() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setAdminAuth = useAdminStore((state) => state.setAdminAuth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/admin/login', formData);
            setAdminAuth(response.data.user, response.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Admin authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel neon-border animate-fade-in">
                <h2 className="text-center mb-8 text-3xl font-black tracking-tighter">
                    ADMIN <span className="text-accent-cyan">PORTAL</span>
                </h2>

                {error && <div className="text-red-500 text-center mb-4 bg-red-500/10 p-2 rounded border border-red-500/50">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="text-accent-cyan uppercase tracking-widest font-bold text-[10px] block mb-2 ml-1">Terminal ID</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            className="w-full bg-slate-950/50 border border-white/5 text-white p-4 rounded-xl focus:border-accent-cyan transition-all outline-none"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="text-accent-cyan uppercase tracking-widest font-bold text-[10px] block mb-2 ml-1">Access Key</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="w-full bg-slate-950/50 border border-white/5 text-white p-4 rounded-xl focus:border-accent-cyan transition-all outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-launch w-full"
                    >
                        <div className="btn-launch-glow"></div>
                        <div className="btn-launch-inner">
                            <span className="launch-line"></span>
                            <span>{loading ? 'Verifying...' : 'ESTABLISH LINK'}</span>
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
