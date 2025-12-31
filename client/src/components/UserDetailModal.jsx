import React from 'react';

// Bulletproof rendering helper to prevent React crashes when objects are passed to text components
const Safe = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') {
        // Handle specific object types we know about
        if (val.currentPhase !== undefined) return String(val.currentPhase * 10 || 0);

        // If it's an array, try to join it, otherwise stringify it
        if (Array.isArray(val)) return val.map(v => Safe(v)).join(', ');
        try {
            return JSON.stringify(val);
        } catch (e) {
            return '[Complex Object]';
        }
    }
    return String(val);
};

// More specific helper for progress to ensure we don't show [object Object] or JSON
const GetProgress = (p) => {
    if (typeof p === 'number') return p;
    if (p && typeof p === 'object' && p.currentPhase !== undefined) {
        // Assuming currentPhase is 0-indexed and there might be 10 phases? 
        // Or maybe just show the phase number
        return p.currentPhase * 25; // Example calculation
    }
    return 0;
};

function UserDetailModal({ isOpen, onClose, userDetails, detailsLoading, onDeleteUser }) {
    if (!isOpen) return null;

    const user = userDetails?.user;
    const assessments = user?.assessments || [];
    const roadmaps = userDetails?.roadmaps || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative glass-panel w-full max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-scale-in border-white/10 flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-8 py-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent-cyan/10 rounded-xl flex items-center justify-center border border-accent-cyan/30 text-accent-cyan">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">ENTITY INSPECTION</h2>
                            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-medium">Detailed mission parameters</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-8">
                    {detailsLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <div className="spinner"></div>
                            <p className="text-xs text-slate-500 animate-pulse uppercase tracking-widest">Synchronizing Registry Data...</p>
                        </div>
                    ) : user ? (
                        <div className="space-y-12 animate-fade-in">
                            {/* User Profile Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 blur-3xl rounded-full opacity-50"></div>
                                    <p className="text-[10px] font-black text-accent-cyan tracking-widest uppercase mb-4">Subject Information</p>
                                    <h3 className="text-2xl font-bold text-white mb-1">{Safe(user.name || 'Unknown Subject')}</h3>
                                    <p className="text-sm text-slate-400 font-mono mb-4">{Safe(user.email || 'No email provided')}</p>
                                    <div className="flex gap-2">
                                        <span className="text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20 font-black">AUTHORIZED</span>
                                        <span className="text-[9px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-full border border-white/10 font-mono">ID: {user._id ? Safe(String(user._id).slice(-6).toUpperCase()) : 'NULL'}</span>
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-4">Temporal Records</p>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[9px] text-slate-600 uppercase font-black tracking-tighter">Registration Date</p>
                                            <p className="text-white font-mono">{user.createdAt ? Safe(new Date(user.createdAt).toLocaleDateString()) : 'UNAVAILABLE'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-600 uppercase font-black tracking-tighter">Status History</p>
                                            <p className="text-slate-300 text-xs">Unit is currently active in the central nexus database.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
                                    <p className="text-[10px] font-black text-red-500/60 tracking-widest uppercase mb-4">Administrative Action</p>
                                    <button
                                        onClick={() => onDeleteUser(user._id)}
                                        className="w-full bg-red-500/5 hover:bg-red-500/20 border border-red-500/20 text-red-500 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                    >
                                        Purge Entity Data
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
                                {/* Assessments Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <h4 className="text-xl font-black flex items-center gap-3 tracking-tighter text-white">
                                            <span className="w-3 h-3 bg-accent-purple rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                                            COGNITIVE ASSESSMENTS
                                        </h4>
                                        <span className="text-[10px] bg-accent-purple/10 text-accent-purple px-3 py-1 rounded-full font-bold">
                                            {Safe(assessments.length)} LOGS
                                        </span>
                                    </div>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {assessments.length === 0 ? (
                                            <div className="p-8 text-center bg-white/[0.01] rounded-2xl border-dashed border border-white/5 opacity-50 italic text-slate-500 text-sm">
                                                No neurological patterns recorded yet.
                                            </div>
                                        ) : (
                                            assessments.map((a, i) => (
                                                <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:bg-white/[0.04] transition-colors relative group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className="text-accent-purple text-[10px] font-black tracking-widest uppercase mb-1">LOG SEQUENCE {Safe(i + 1)}</div>
                                                            <h5 className="text-lg font-bold text-white">{Safe(a?.targetRole || 'UNDEFINED')}</h5>
                                                        </div>
                                                        <span className="text-[10px] text-slate-600 font-mono">{a?.createdAt ? Safe(new Date(a.createdAt).toLocaleDateString()) : ''}</span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                                                        <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                                                            <p className="text-slate-600 uppercase font-black text-[9px] mb-1 tracking-tighter">Assigned Origin</p>
                                                            <p className="text-slate-300 font-medium">{Safe(a?.currentRole || 'NOT_SET')}</p>
                                                        </div>
                                                        <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                                                            <p className="text-slate-600 uppercase font-black text-[9px] mb-1 tracking-tighter">Experience Matrix</p>
                                                            <p className="text-slate-300 font-medium">{Safe(a?.yearsOfExperience ?? 0)} Standard Years</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] uppercase text-slate-600 font-black mb-3 tracking-widest pl-1">Skill Vectors Identified</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(a?.skills || []).map((s, si) => (
                                                                <span key={si} className="text-[10px] bg-accent-purple/5 border border-accent-purple/20 px-3 py-1 rounded-lg text-accent-purple/80 hover:bg-accent-purple/10 transition-colors cursor-default">{Safe(s)}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Roadmaps Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <h4 className="text-xl font-black flex items-center gap-3 tracking-tighter text-white">
                                            <span className="w-3 h-3 bg-accent-cyan rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                                            MISSION TRAJECTORIES
                                        </h4>
                                        <span className="text-[10px] bg-accent-cyan/10 text-accent-cyan px-3 py-1 rounded-full font-bold">
                                            {Safe(roadmaps.length)} PATHS
                                        </span>
                                    </div>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {roadmaps.length === 0 ? (
                                            <div className="p-8 text-center bg-white/[0.01] rounded-2xl border-dashed border border-white/5 opacity-50 italic text-slate-500 text-sm">
                                                No mission trajectories established.
                                            </div>
                                        ) : (
                                            roadmaps.map((r, i) => (
                                                <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:bg-white/[0.04] transition-colors relative group">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <div className="text-accent-cyan text-[10px] font-black tracking-widest uppercase mb-1">OBJECTIVE {Safe(i + 1)}</div>
                                                            <h5 className="text-lg font-bold text-white">{Safe(r?.targetRole || 'UNDEFINED')}</h5>
                                                        </div>
                                                        <span className="text-[10px] text-slate-600 font-mono">{r?.createdAt ? Safe(new Date(r.createdAt).toLocaleDateString()) : ''}</span>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-end mb-1 pl-1">
                                                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Neural Integration Progress</span>
                                                            <span className="text-sm font-mono text-accent-cyan">{Safe(GetProgress(r?.progress))}%</span>
                                                        </div>
                                                        <div className="h-3 bg-slate-950/50 rounded-full overflow-hidden border border-white/10 p-0.5">
                                                            <div
                                                                className="h-full bg-accent-cyan shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all duration-1000 rounded-full"
                                                                style={{ width: `${GetProgress(r?.progress)}%` }}
                                                            ></div>
                                                        </div>
                                                        <p className="text-[9px] text-slate-600 italic pl-1">
                                                            Status: {r?.status === 'completed' ? 'TRAJECTORY_STABLE' : 'INTEGRATION_PENDING'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-20 text-center glass-panel border-dashed border-2 border-red-500/20">
                            <svg className="w-16 h-16 text-red-500/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-red-400 font-bold uppercase tracking-widest">Critical: User Data Lost or Unavailable</p>
                            <p className="text-slate-500 text-xs mt-2 font-mono">Registry synchronization failure. Please try re-selecting the entity.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-900/50 border-t border-white/5 px-8 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                    >
                        Close Terminal
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserDetailModal;
