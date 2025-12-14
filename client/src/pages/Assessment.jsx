import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Assessment() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        currentRole: '',
        yearsOfExperience: 0,
        targetRole: '',
        skills: [],
        interests: [],
        educationLevel: '',
        preferredLearningStyle: '',
        timeCommitment: ''
    });
    const [skillsInput, setSkillsInput] = useState('');
    const [interestsInput, setInterestsInput] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (e, field) => {
        const value = e.target.value;
        const array = value.split(',').map(item => item.trim());
        setFormData({ ...formData, [field]: array });
        if (field === 'skills') setSkillsInput(value);
        if (field === 'interests') setInterestsInput(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assessment', formData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Assessment submission failed:', error);
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    // Calculate progress based on step (1=33%, 2=66%, 3=100%)
    const progress = (step / 3) * 100;

    return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-panel" style={{ width: '100%', maxSelf: 'center', maxWidth: '800px', padding: '3rem', margin: '2rem' }}>
                <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1rem' }}>Initiate Career Analysis</h1>

                {/* Progress Bar */}
                <div className="progress-container" style={{ margin: '1.5rem 0 3rem' }}>
                    <div className="progress-bar" style={{ width: `${progress}%` }}>
                        Step {step} of 3
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ animation: 'fade-in-up 0.4s ease-out' }}>
                    {step === 1 && (
                        <div key="step1">
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-purple)' }}>Current Status</h2>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>Current Role</label>
                                <input
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    type="text"
                                    name="currentRole"
                                    placeholder="e.g. Junior Developer"
                                    value={formData.currentRole}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>Years of Experience</label>
                                <input
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    type="number"
                                    name="yearsOfExperience"
                                    placeholder="0"
                                    value={formData.yearsOfExperience}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>Education Level</label>
                                <input
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    type="text"
                                    name="educationLevel"
                                    placeholder="e.g. Bachelor's Degree"
                                    value={formData.educationLevel}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <button type="button" className="btn-primary" onClick={nextStep}>Next Phase &rarr;</button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div key="step2" style={{ animation: 'fade-in-up 0.4s ease-out' }}>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-purple)' }}>Target Parameters</h2>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>Target Role</label>
                                <input
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    type="text"
                                    name="targetRole"
                                    placeholder="e.g. Senior Full Stack Engineer"
                                    value={formData.targetRole}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>Current Skills (Comma Separated)</label>
                                <input
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    type="text"
                                    placeholder="JavaScript, React, Node.js"
                                    value={skillsInput}
                                    onChange={(e) => handleArrayChange(e, 'skills')}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>Interests / Passions (Comma Separated)</label>
                                <input
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    type="text"
                                    placeholder="AI, Blockchain, UI Design"
                                    value={interestsInput}
                                    onChange={(e) => handleArrayChange(e, 'interests')}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--accent-blue)' }} onClick={prevStep}>&larr; Back</button>
                                <button type="button" className="btn-primary" onClick={nextStep}>Next Phase &rarr;</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div key="step3" style={{ animation: 'fade-in-up 0.4s ease-out' }}>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-purple)' }}>Learning Profile</h2>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>Preferred Learning Style</label>
                                <select
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}
                                    name="preferredLearningStyle"
                                    value={formData.preferredLearningStyle}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Style</option>
                                    <option value="visual">Visual (Videos/Diagrams)</option>
                                    <option value="auditory">Auditory (Podcasts/Lectures)</option>
                                    <option value="reading">Reading/Writing (Docs/Books)</option>
                                    <option value="kinesthetic">Kinesthetic (Hands-on/Building)</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>Time Commitment</label>
                                <input
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    type="text"
                                    name="timeCommitment"
                                    placeholder="e.g. 10 hours per week"
                                    value={formData.timeCommitment}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--accent-blue)' }} onClick={prevStep}>&larr; Back</button>
                                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(45deg, var(--accent-cyan), var(--accent-purple))', boxShadow: '0 0 15px rgba(0, 243, 255, 0.5)' }}>Submit Assessment</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Assessment;