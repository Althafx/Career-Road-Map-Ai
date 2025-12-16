import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../api/axios';

const MissionControl = () => {
    const [searchParams] = useSearchParams();
    const [roadmap, setRoadmap] = useState(null);
    const [progress, setProgress] = useState({ currentPhase: 0, completedTasks: [], isCompleted: false });
    const [viewPhase, setViewPhase] = useState(0); // For carousel navigation
    const [slideDirection, setSlideDirection] = useState('right'); // 'right' or 'left'
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const assessmentId = searchParams.get('assessmentId');

    useEffect(() => {
        if (assessmentId) {
            fetchRoadmapData();
        }
    }, [assessmentId]);

    const fetchRoadmapData = async () => {
        try {
            const response = await api.get(`/roadmap?assessmentId=${assessmentId}`);
            if (response.data.success && response.data.roadmap) {
                setRoadmap(response.data.roadmap);
                if (response.data.roadmap.progress) {
                    const p = response.data.roadmap.progress;
                    setProgress(p);
                    // Default view to current active phase (or 0 if complete, user can review)
                    setViewPhase(p.isCompleted ? 0 : p.currentPhase);
                }
            }
        } catch (error) {
            console.error("Failed to fetch roadmap:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (newProgress) => {
        setProgress(newProgress); // Optimistic update
        try {
            await api.put('/roadmap/progress', {
                assessmentId,
                ...newProgress
            });
        } catch (error) {
            console.error("Failed to save progress:", error);
        }
    };

    const handleTaskToggle = (phaseIndex, taskIndex) => {
        const isLocked = phaseIndex > progress.currentPhase && !progress.isCompleted;
        if (isLocked) return;

        const taskIdentifier = { phaseIndex, taskIndex, completed: true };
        const isAlreadyCompleted = progress.completedTasks.some(
            t => t.phaseIndex === phaseIndex && t.taskIndex === taskIndex && t.completed
        );

        let newCompletedTasks;
        if (isAlreadyCompleted) {
            newCompletedTasks = progress.completedTasks.filter(
                t => !(t.phaseIndex === phaseIndex && t.taskIndex === taskIndex)
            );
        } else {
            newCompletedTasks = [...progress.completedTasks, taskIdentifier];
        }

        const phases = JSON.parse(roadmap.roadmapContent).phases;
        const phaseSkillsCount = phases[phaseIndex].skills.length;
        const completedSkillsInPhase = newCompletedTasks.filter(t => t.phaseIndex === phaseIndex).length;

        let newCurrentPhase = progress.currentPhase;
        let newIsCompleted = progress.isCompleted;

        // Unlock next phase if all skills in current phase are done
        if (phaseIndex === progress.currentPhase && completedSkillsInPhase === phaseSkillsCount && !isAlreadyCompleted) {
            if (phases.length - 1 > phaseIndex) {
                newCurrentPhase = phaseIndex + 1;
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); // Small pop

                // Auto-advance slide to next phase
                setTimeout(() => {
                    setSlideDirection('right');
                    setViewPhase(newCurrentPhase);
                }, 1000);

            } else {
                newIsCompleted = true;
                fireHugeConfetti();
            }
        }

        updateProgress({
            currentPhase: newCurrentPhase,
            completedTasks: newCompletedTasks,
            isCompleted: newIsCompleted
        });
    };

    const fireHugeConfetti = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    const changeScan = (direction) => {
        if (direction === 'next') {
            const phases = JSON.parse(roadmap.roadmapContent).phases;
            if (viewPhase < phases.length - 1) {
                setSlideDirection('right');
                setViewPhase(prev => prev + 1);
            }
        } else {
            if (viewPhase > 0) {
                setSlideDirection('left');
                setViewPhase(prev => prev - 1);
            }
        }
    };

    if (loading || !roadmap) return <div className="page-container flex justify-center items-center"><div className="spinner"></div></div>;

    const phases = roadmap.roadmapContent ? JSON.parse(roadmap.roadmapContent).phases : [];
    const currentPhaseData = phases[viewPhase];
    const isLocked = viewPhase > progress.currentPhase && !progress.isCompleted;

    // Calculate total progress for dashboard
    const totalTasks = phases.reduce((acc, p) => acc + p.skills.length, 0);
    const completedCount = progress.completedTasks.length;

    return (
        <div className="page-container">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 relative z-10">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-3xl md:text-5xl text-gradient mb-2">MISSION CONTROL</h1>
                        <p className="text-slate-400 text-lg tracking-wider">OPERATION: {JSON.parse(roadmap.roadmapContent).role || "CAREER TRAJECTORY"}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl md:text-6xl font-bold text-white">{Math.round((completedCount / totalTasks) * 100)}%</h2>
                        <p className="text-accent-cyan uppercase tracking-widest text-xs md:text-sm">Global Status</p>
                    </div>
                </div>

                {/* Celebration Banner - Shows ONLY when completed */}
                {progress.isCompleted && (
                    <div className="glass-panel p-8 text-center animate-fade-in-up mb-8 bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 border-accent-cyan/30">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-3xl text-gradient mb-4">MISSION ACCOMPLISHED</h2>
                        <button onClick={fireHugeConfetti} className="btn-primary !py-2 !px-6 text-sm">Celebrate Again</button>
                    </div>
                )}

                {/* Carousel Navigation */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => changeScan('prev')}
                        disabled={viewPhase === 0}
                        className={`p-4 rounded-full border border-white/10 transition-all ${viewPhase === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:scale-110 active:scale-95'}`}
                    >
                        <span className="text-2xl text-accent-cyan">←</span>
                    </button>

                    <div className="flex gap-2">
                        {phases.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-3 h-3 rounded-full transition-all duration-300 
                                    ${idx === viewPhase ? 'bg-accent-cyan w-8 shadow-[0_0_10px_#00f3ff]' :
                                        idx < progress.currentPhase || progress.isCompleted ? 'bg-accent-purple opacity-50' :
                                            'bg-slate-700'}`}
                            ></div>
                        ))}
                    </div>

                    <button
                        onClick={() => changeScan('next')}
                        disabled={viewPhase === phases.length - 1 || (viewPhase >= progress.currentPhase && !progress.isCompleted)}
                        className={`p-4 rounded-full border border-white/10 transition-all 
                            ${(viewPhase === phases.length - 1 || (viewPhase >= progress.currentPhase && !progress.isCompleted)) ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:scale-110 active:scale-95'}`}
                    >
                        <span className="text-2xl text-accent-cyan">→</span>
                    </button>
                </div>

                {/* Main Card - Carousel View */}
                <div className="relative overflow-hidden min-h-[600px]">
                    {/* 
                         Key change triggers Remount + Animation.
                         Using a simple 'key' prop is the easiest React way to trigger entrance animations on change.
                         We use slideDirection to determine which animation class to use? 
                         Actually, standard fade-in-up is safe, but "slide" needs specific classes.
                         Let's stick to 'animate-fade-in-up' for now or a custom keyframe.
                     */}

                    <div
                        key={viewPhase}
                        className={`glass-panel p-8 md:p-12 absolute w-full transition-all duration-500
                            ${slideDirection === 'right' ? 'animate-[fade-in-up_0.5s_ease-out]' : 'animate-[fade-in-up_0.5s_ease-out]'} 
                        `}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-[10rem] font-bold -z-10 leading-none select-none pointer-events-none">
                            {viewPhase + 1}
                        </div>

                        {/* Lock Overlay */}
                        {isLocked && (
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl">
                                <div className="text-6xl mb-6">🔒</div>
                                <h3 className="text-3xl font-bold text-white mb-2">PHASE LOCKED</h3>
                                <p className="text-slate-400">Complete previous phases to unlock.</p>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{currentPhaseData.phaseTitle}</h2>
                                <p className="text-accent-cyan font-mono">{currentPhaseData.timeBreakdown}</p>
                            </div>
                            {/* Phase Status Badge */}
                            <div className={`px-4 py-2 rounded-full border ${(viewPhase < progress.currentPhase || progress.isCompleted) ? 'border-green-500 bg-green-500/20 text-green-400' :
                                    viewPhase === progress.currentPhase ? 'border-accent-cyan bg-accent-cyan/20 text-accent-cyan animate-pulse' :
                                        'border-slate-700 bg-slate-800 text-slate-500'
                                }`}>
                                {(viewPhase < progress.currentPhase || progress.isCompleted) ? 'COMPLETED' :
                                    viewPhase === progress.currentPhase ? 'IN PROGRESS' : 'LOCKED'}
                            </div>
                        </div>

                        <div className="space-y-4 mb-12">
                            {currentPhaseData.skills.map((skill, taskIdx) => {
                                const isChecked = progress.completedTasks.some(
                                    t => t.phaseIndex === viewPhase && t.taskIndex === taskIdx && t.completed
                                );

                                return (
                                    <div
                                        key={taskIdx}
                                        onClick={() => handleTaskToggle(viewPhase, taskIdx)}
                                        className={`flex items-center p-5 rounded-xl border transition-all duration-200 cursor-pointer group
                                          ${isChecked ?
                                                'bg-accent-cyan/10 border-accent-cyan/50' :
                                                'bg-slate-800/50 border-white/5 hover:border-accent-cyan/30 hover:bg-slate-800/80'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded border mr-4 flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(0,0,0,0.2)]
                                            ${isChecked ? 'bg-accent-cyan border-accent-cyan shadow-[0_0_10px_rgba(0,243,255,0.4)]' : 'border-slate-500 group-hover:border-accent-cyan'}`}
                                        >
                                            {isChecked && <span className="text-black font-bold text-sm">✓</span>}
                                        </div>
                                        <span className={`text-lg md:text-xl font-medium transition-colors ${isChecked ? 'text-accent-cyan line-through decoration-2 opacity-70' : 'text-slate-200 group-hover:text-white'}`}>{skill}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-6 bg-white/5 rounded-xl border border-white/5">
                            <h4 className="text-accent-purple font-bold mb-2 uppercase tracking-wider text-sm">Final Project</h4>
                            <p className="text-slate-300 text-lg leading-relaxed">{currentPhaseData.project}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionControl;
