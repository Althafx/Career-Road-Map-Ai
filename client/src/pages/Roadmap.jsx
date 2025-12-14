import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

function Roadmap() {
    const [searchParams] = useSearchParams();
    const [assessments, setAssessments] = useState([]);
    const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssessments();
        const assessmentId = searchParams.get('assessmentId');
        if (assessmentId) {
            setSelectedAssessmentId(assessmentId);
            fetchRoadmap(assessmentId);
        }
    }, []);

    const fetchAssessments = async () => {
        try {
            const response = await api.get('/assessment');
            setAssessments(response.data.assessments || []);
        } catch (error) {
            console.error('Failed to fetch assessments:', error);
        }
    };

    const fetchRoadmap = async (assessmentId) => {
        if (!assessmentId) return;

        try {
            const response = await api.get(`/roadmap?assessmentId=${assessmentId}`);
            setRoadmap(response.data.roadmap);

            if (response.data.roadmap?.status === 'generating') {
                setLoading(true);
                pollRoadmapStatus(assessmentId);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setRoadmap(null);
            }
        }
    };

    const pollRoadmapStatus = (assessmentId) => {
        const interval = setInterval(async () => {
            try {
                const response = await api.get(`/roadmap?assessmentId=${assessmentId}`);
                const currentRoadmap = response.data.roadmap;

                if (currentRoadmap.status === 'completed') {
                    clearInterval(interval);
                    setRoadmap(currentRoadmap);
                    setLoading(false);
                    setProgress(100);
                } else if (currentRoadmap.status === 'failed') {
                    clearInterval(interval);
                    setError('Roadmap generation failed. Please try again.');
                    setLoading(false);
                }
            } catch (err) {
                clearInterval(interval);
                setError('Failed to check roadmap status');
                setLoading(false);
            }
        }, 3000);
    };

    const handleGenerate = async () => {
        if (!selectedAssessmentId) {
            setError('Please select an assessment first');
            return;
        }

        setLoading(true);
        setError('');
        setProgress(0);

        try {
            const response = await api.post('/roadmap/generate', {
                assessmentId: selectedAssessmentId
            });
            const { jobId } = response.data;

            if (jobId) {
                pollJobStatus(jobId);
            } else {
                setRoadmap(response.data.roadmap);
                setLoading(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate roadmap');
            setLoading(false);
        }
    };

    const pollJobStatus = (jobId) => {
        const interval = setInterval(async () => {
            try {
                const response = await api.get(`/roadmap/job/${jobId}`);
                const { state, progress: jobProgress } = response.data;

                setProgress(jobProgress);

                if (state === 'completed') {
                    clearInterval(interval);
                    await fetchRoadmap(selectedAssessmentId);
                    setLoading(false);
                } else if (state === 'failed') {
                    clearInterval(interval);
                    setError('Roadmap generation failed. Please try again.');
                    setLoading(false);
                }
            } catch (err) {
                clearInterval(interval);
                setError('Failed to check job status');
                setLoading(false);
            }
        }, 2000);
    };

    const handleRegenerate = async () => {
        if (!window.confirm('Regenerate roadmap? This will replace your current one.')) {
            return;
        }

        setLoading(true);
        setError('');
        setProgress(0);

        try {
            const response = await api.post('/roadmap/regenerate', {
                assessmentId: selectedAssessmentId
            });
            const { jobId } = response.data;

            if (jobId) {
                pollJobStatus(jobId);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to regenerate roadmap');
            setLoading(false);
        }
    };

    const handleAssessmentChange = (e) => {
        const assessmentId = e.target.value;
        setSelectedAssessmentId(assessmentId);
        setRoadmap(null);
        setError('');
        if (assessmentId) {
            fetchRoadmap(assessmentId);
        }
    };

    const parseJSON = (str) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return null;
        }
    };

    if (assessments.length === 0) {
        return (
            <div className="page-container text-center pt-[150px]">
                <div className="glass-panel max-w-2xl mx-auto p-12">
                    <h1 className="text-4xl mb-6">Career Map Not Found</h1>
                    <p className="mb-8 text-slate-300">Initialize your first career assessment to generate a roadmap.</p>
                    <button className="btn-primary" onClick={() => navigate('/assessment')}>Start Assessment</button>
                </div>
            </div>
        );
    }

    const advice = roadmap ? parseJSON(roadmap.careerAdvice) : null;
    const roadmapData = roadmap ? parseJSON(roadmap.roadmapContent) : null;

    return (
        <div className="page-container">
            <div className="roadmap-container">
                <h1 className="text-gradient text-5xl mb-8 text-center">
                    MISSION TRAJECTORY
                </h1>

                <div className="assessment-selector glass-panel p-8">
                    <label htmlFor="assessment-select" className="text-accent-cyan block mb-4 font-bold tracking-wider">SELECT MISSION PROFILE:</label>
                    <select
                        id="assessment-select"
                        value={selectedAssessmentId}
                        onChange={handleAssessmentChange}
                        className="w-full bg-slate-900/90 text-slate-100 border border-accent-blue py-4 px-8 rounded-xl text-lg cursor-pointer outline-none focus:shadow-[0_0_15px_rgba(77,121,255,0.4)]"
                    >
                        <option value="">-- Choose Career Assessment --</option>
                        {assessments.map((assessment) => (
                            <option key={assessment._id} value={assessment._id}>
                                {assessment.targetRole} [ID: {assessment._id.slice(-4)}]
                            </option>
                        ))}
                    </select>
                </div>

                {error && <div className="text-red-500 bg-red-500/10 p-4 rounded-lg mb-8 text-center border border-red-500">{error}</div>}

                {loading ? (
                    <div className="glass-panel p-12 text-center">
                        <h2 className="text-gradient text-3xl mb-8">Analyzing Career Parameters...</h2>
                        <div className="spinner"></div>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${progress}%` }}>
                                {/* Note: Inline style for dynamic width is fine/necessary */}
                                {progress > 5 && <span className="px-2 text-xs font-bold text-black">{progress}%</span>}
                            </div>
                        </div>
                        <p className="text-slate-300">Constructing personalized roadmap matrix...</p>
                    </div>
                ) : !selectedAssessmentId ? (
                    <div className="glass-panel p-12 text-center opacity-70">
                        <p className="text-xl">Select a career profile above to visualize your trajectory.</p>
                    </div>
                ) : !roadmap ? (
                    <div className="glass-panel p-12 text-center">
                        <h2 className="text-3xl mb-6">Roadmap Not Generated</h2>
                        <p className="mb-8 text-slate-300">AI analysis ready for this profile.</p>
                        <button className="btn-primary" onClick={handleGenerate}>Initiate Generation Sequence</button>
                    </div>
                ) : (
                    <div className="animate-fade-in-up">

                        {/* Strategic Analysis Section */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 text-slate-100">STRATEGIC ANALYSIS</h2>

                            {advice ? (
                                <div className="grid gap-8">
                                    {/* Gap Analysis Card */}
                                    <div className="glass-panel p-8">
                                        <h3 className="text-accent-cyan text-xl mb-4 font-bold">GAP ANALYSIS</h3>
                                        <p className="text-slate-300 leading-relaxed">{advice.gapAnalysis}</p>
                                    </div>

                                    {/* Skills & Timeline Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="glass-panel p-8">
                                            <h3 className="text-accent-purple text-xl mb-4 font-bold">CRITICAL SKILLS ACQUISITION</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {advice.recommendedSkills?.map((skill, i) => (
                                                    <span key={i} className="bg-accent-cyan/10 border border-accent-cyan px-3 py-1 rounded-full text-sm text-slate-200">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="glass-panel p-8">
                                            <h3 className="text-accent-blue text-xl mb-4 font-bold">ESTIMATED TIMELINE</h3>
                                            <p className="text-2xl font-bold text-white mb-4">{advice.estimatedTimeline}</p>
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                                <strong className="block text-accent-cyan mb-2">💡 Core Directive:</strong>
                                                <span className="text-slate-300">{advice.motivationalTip}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-panel p-8">
                                    {/* Fallback for legacy text data */}
                                    {roadmap.careerAdvice?.split('\n').map((line, index) => (
                                        <p key={index} className="mb-2 text-slate-300">{line}</p>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Execution Timeline Section */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-slate-100">EXECUTION MATRIX</h2>

                            {roadmapData?.phases ? (
                                <div className="flex flex-col gap-8">
                                    {roadmapData.phases.map((phase, idx) => (
                                        <div key={idx} className={`glass-panel p-8 relative overflow-hidden border-l-4 ${idx % 2 === 0 ? 'border-l-accent-cyan' : 'border-l-accent-purple'}`}>
                                            <div className="absolute top-0 right-0 px-4 py-2 bg-white/10 rounded-bl-xl font-bold text-sm tracking-wider">
                                                PHASE {idx + 1}
                                            </div>

                                            <h3 className="text-2xl font-bold mb-6 text-white">
                                                {phase.phaseTitle}
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <h4 className="text-accent-cyan font-bold mb-2 text-sm uppercase tracking-wider">SKILLS PROTOCOL</h4>
                                                    <ul className="space-y-2">
                                                        {phase.skills.map((skill, sIdx) => (
                                                            <li key={sIdx} className="flex items-center gap-2 text-slate-300">
                                                                <span className="text-accent-cyan">›</span> {skill}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="text-accent-purple font-bold mb-2 text-sm uppercase tracking-wider">MISSION PROJECT</h4>
                                                    <p className="text-slate-300">{phase.project}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-accent-blue font-bold mb-2 text-sm uppercase tracking-wider">TIME ALLOCATION</h4>
                                                    <p className="bg-black/30 p-3 rounded-lg text-slate-300 text-sm border border-white/5">{phase.timeBreakdown}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-panel p-8">
                                    {/* Fallback for legacy text data */}
                                    {roadmap.roadmapContent?.split('\n').map((line, index) => (
                                        <p key={index} className="mb-2 text-slate-300">{line}</p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="text-center mt-16">
                            <button className="btn-primary" onClick={handleRegenerate}>Regenerate Trajectory</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Roadmap;