import { useState, useEffect } from 'react';
import api from '../api/axios';
import useAdminStore from '../store/adminStore';
import ConfirmationModal from '../components/ConfirmationModal';
import UserDetailModal from '../components/UserDetailModal';

// Bulletproof rendering helper
const Safe = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') {
        if (Array.isArray(val)) return val.map(v => Safe(v)).join(', ');
        try {
            return JSON.stringify(val);
        } catch (e) {
            return '[Complex Object]';
        }
    }
    return String(val);
};

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const adminToken = useAdminStore((state) => state.adminToken);
    const adminUser = useAdminStore((state) => state.adminUser);
    const logout = useAdminStore((state) => state.adminLogout);

    useEffect(() => {
        if (adminToken) {
            console.log('AdminDashboard: Initiating user fetch with token...');
            fetchUsers();
        } else {
            console.warn('AdminDashboard: No admin token found yet.');
        }
    }, [adminToken]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users', {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('AdminDashboard: API Response:', response.data);
            if (response.data.success) {
                setUsers(response.data.users);
                console.log(`AdminDashboard: Successfully loaded ${response.data.users.length} users.`);
            }
        } catch (error) {
            console.error('AdminDashboard: Failed to fetch users:', error);
            if (error.response) {
                console.error('AdminDashboard: Server error details:', error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetails = async (userId) => {
        setDetailsLoading(true);
        setIsDetailModalOpen(true);
        setSelectedUser(userId);
        try {
            const response = await api.get(`/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setUserDetails(response.data);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            setIsDetailModalOpen(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleDeleteUser = (e, userId) => {
        e.stopPropagation();
        setUserToDelete(userId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await api.delete(`/admin/users/${userToDelete}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setUsers(users.filter(u => u._id !== userToDelete));
            if (selectedUser === userToDelete) {
                setSelectedUser(null);
                setUserDetails(null);
                setIsDetailModalOpen(false);
            }
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex justify-center items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
            {/* Admin Header */}
            <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent-cyan/20 rounded-lg flex items-center justify-center border border-accent-cyan/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <span className="text-accent-cyan font-bold">A</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white leading-tight">ADMIN CONTROL</h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium">Nexus System Terminal</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Operator</p>
                        <p className="text-accent-cyan font-medium text-sm">{Safe(adminUser?.name)}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="btn-danger !px-6 !py-2 !text-[10px] tracking-widest uppercase font-black"
                    >
                        TERMINATE SESSION
                    </button>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto p-8">
                <div className="animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                        <div>
                            <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">ENTITY REGISTRY</h1>
                            <p className="text-slate-500 uppercase tracking-[0.4em] text-xs font-medium">Accessing central database units</p>
                        </div>
                        <div className="bg-white/5 px-6 py-3 border border-white/10 rounded-2xl flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest" title="Total users in Atlas">Active Units</p>
                                <p className="text-2xl font-black text-accent-cyan leading-tight">{Safe(users.length)}</p>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <svg className="w-8 h-8 text-accent-cyan/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <div
                                key={Safe(user._id)}
                                onClick={() => fetchUserDetails(user._id)}
                                className="glass-panel p-6 cursor-pointer hover:border-accent-cyan/40 hover:bg-white/[0.03] transition-all duration-300 group flex flex-col h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-accent-cyan/30 transition-colors shadow-inner">
                                        <svg className="w-6 h-6 text-slate-400 group-hover:text-accent-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteUser(e, user._id)}
                                        className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                        title="Purge Unit"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex-1 relative z-10">
                                    <h3 className="text-xl font-bold text-white group-hover:text-accent-cyan transition-colors mb-1 truncate tracking-tight">{Safe(user.name)}</h3>
                                    <p className="text-xs text-slate-500 font-mono mb-8 truncate opacity-80">{Safe(user.email)}</p>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden group-hover:bg-white/[0.04] transition-all">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-slate-600 text-[9px] uppercase font-black tracking-widest">Protocol Sync</span>
                                                {user.assessments?.length > 0 ? (
                                                    <span className="text-accent-cyan text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-pulse"></span>
                                                        ACTIVE
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-600 text-[10px] font-black tracking-widest uppercase">IDLE</span>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
                                                    <span className="text-slate-600">Target Role</span>
                                                    <span className="text-accent-purple truncate max-w-[120px] text-right font-black">
                                                        {user.assessments && user.assessments.length > 0
                                                            ? Safe(user.assessments[user.assessments.length - 1]?.targetRole || 'UNDEFINED')
                                                            : 'UNDEFINED'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
                                                    <span className="text-slate-600">Experience</span>
                                                    <span className="text-white">
                                                        {user.assessments && user.assessments.length > 0
                                                            ? Safe(`${user.assessments[user.assessments.length - 1]?.yearsOfExperience || 0}y`)
                                                            : '0y'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
                                                    <span className="text-slate-600">Total Logs</span>
                                                    <span className="text-white bg-white/10 px-2 py-0.5 rounded">{Safe(user.assessments?.length || 0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                                    <span className="text-[10px] text-slate-600 font-mono uppercase font-medium">
                                        UNIT_{user.createdAt ? Safe(new Date(user.createdAt).getFullYear()) : '2025'}_{user._id ? Safe(String(user._id).slice(-4).toUpperCase()) : 'NULL'}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-accent-cyan font-black text-[10px] uppercase tracking-tighter hover:tracking-widest transition-all">
                                        INSPECT
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <UserDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                userDetails={userDetails}
                detailsLoading={detailsLoading}
                onDeleteUser={(id) => {
                    setUserToDelete(id);
                    setIsDeleteModalOpen(true);
                }}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setUserToDelete(null); }}
                onConfirm={confirmDelete}
                title="PURGE ENTITY DATA?"
                message="Warning: This will permanently erase all neural records, mission trajectories, and profile data from the central nexus. This process is immediate and irreversible."
                type="danger"
            />
        </div>
    );
}

export default AdminDashboard;
