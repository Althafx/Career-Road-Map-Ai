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
            <div className="page-container" style={{ textAlign: 'center', paddingTop: '150px' }}>
                <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
                    <h1>Career Map Not Found</h1>
                    <p style={{ margin: '1.5rem 0' }}>Initialize your first career assessment to generate a roadmap.</p>
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
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                    MISSION TRAJECTORY
                </h1>

                <div className="assessment-selector glass-panel">
                    <label htmlFor="assessment-select" style={{ color: 'var(--accent-cyan)' }}>SELECT MISSION PROFILE:</label>
                    <select
                        id="assessment-select"
                        value={selectedAssessmentId}
                        onChange={handleAssessmentChange}
                    >
                        <option value="">-- Choose Career Assessment --</option>
                        {assessments.map((assessment) => (
                            <option key={assessment._id} value={assessment._id}>
                                {assessment.targetRole} [ID: {assessment._id.slice(-4)}]
                            </option>
                        ))}
                    </select>
                </div>

                {error && <div className="error">{error}</div>}

                {loading ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                        <h2 className="text-gradient">Analyzing Career Parameters...</h2>
                        <div className="spinner"></div>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${progress}%` }}>
                                {progress > 5 && `${progress}%`}
                            </div>
                        </div>
                        <p>Constructing personalized roadmap matrix...</p>
                    </div>
                ) : !selectedAssessmentId ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', opacity: 0.7 }}>
                        <p>Select a career profile above to visualize your trajectory.</p>
                    </div>
                ) : !roadmap ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                        <h2>Roadmap Not Generated</h2>
                        <p style={{ margin: '1.5rem 0' }}>AI analysis ready for this profile.</p>
                        <button className="btn-primary" onClick={handleGenerate}>Initiate Generation Sequence</button>
                    </div>
                ) : (
                    <div style={{ animation: 'fade-in-up 0.5s ease-out' }}>

                        {/* Strategic Analysis Section */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>STRATEGIC ANALYSIS</h2>

                            {advice ? (
                                <div style={{ display: 'grid', gap: '2rem' }}>
                                    {/* Gap Analysis Card */}
                                    <div className="glass-panel" style={{ padding: '2rem' }}>
                                        <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>GAP ANALYSIS</h3>
                                        <p>{advice.gapAnalysis}</p>
                                    </div>

                                    {/* Skills & Timeline Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                        <div className="glass-panel" style={{ padding: '2rem' }}>
                                            <h3 style={{ color: 'var(--accent-purple)', marginBottom: '1rem' }}>CRITICAL SKILLS ACQUISITION</h3>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {advice.recommendedSkills?.map((skill, i) => (
                                                    <span key={i} style={{
                                                        background: 'rgba(0, 243, 255, 0.1)',
                                                        border: '1px solid var(--accent-cyan)',
                                                        padding: '0.3rem 0.8rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.9rem'
                                                    }}>{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="glass-panel" style={{ padding: '2rem' }}>
                                            <h3 style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>ESTIMATED TIMELINE</h3>
                                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{advice.estimatedTimeline}</p>
                                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                                <strong>💡 Core Directive:</strong> {advice.motivationalTip}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-panel" style={{ padding: '2rem' }}>
                                    {/* Fallback for legacy text data */}
                                    {roadmap.careerAdvice?.split('\n').map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Execution Timeline Section */}
                        <div>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>EXECUTION MATRIX</h2>

                            {roadmapData?.phases ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    {roadmapData.phases.map((phase, idx) => (
                                        <div key={idx} className="glass-panel" style={{
                                            padding: '2rem',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            borderLeft: `4px solid ${idx % 2 === 0 ? 'var(--accent-cyan)' : 'var(--accent-purple)'}`
                                        }}>
                                            <div style={{
                                                position: 'absolute', top: 0, right: 0,
                                                padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)',
                                                borderBottomLeftRadius: '10px', fontWeight: 'bold'
                                            }}>PHASE {idx + 1}</div>

                                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                                                {phase.phaseTitle}
                                            </h3>

                                            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                                                <div>
                                                    <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>SKILLS PROTOCOL</h4>
                                                    <ul style={{ listStyle: 'none' }}>
                                                        {phase.skills.map((skill, sIdx) => (
                                                            <li key={sIdx} style={{ marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <span style={{ color: 'var(--accent-cyan)' }}>›</span> {skill}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 style={{ color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>MISSION PROJECT</h4>
                                                    <p>{phase.project}</p>
                                                </div>
                                                <div>
                                                    <h4 style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>TIME ALLOCATION</h4>
                                                    <p style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '5px' }}>{phase.timeBreakdown}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-panel" style={{ padding: '2rem' }}>
                                    {/* Fallback for legacy text data */}
                                    {roadmap.roadmapContent?.split('\n').map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                            <button className="btn-primary" onClick={handleRegenerate}>Regenerate Trajectory</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Roadmap;