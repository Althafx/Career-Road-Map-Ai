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
        <div className="page-container flex justify-center items-center">
            <div className="glass-panel w-full max-w-4xl p-12 m-8">
                <h1 className="text-gradient text-center mb-4 text-4xl">Initiate Career Analysis</h1>

                {/* Progress Bar */}
                <div className="progress-container mb-12">
                    <div className="progress-bar flex items-center justify-center text-xs font-bold text-black" style={{ width: `${progress}%` }}>
                        Step {step} of 3
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="animate-[fade-in-up_0.4s_ease-out]">
                    {step === 1 && (
                        <div key="step1">
                            <h2 className="mb-6 text-accent-purple text-2xl">Current Status</h2>

                            <div className="mb-6">
                                <label className="block mb-2 text-accent-cyan font-semibold">Current Role</label>
                                <input
                                    className="w-full p-4 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all"
                                    type="text"
                                    name="currentRole"
                                    placeholder="e.g. Junior Developer"
                                    value={formData.currentRole}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-accent-cyan font-semibold">Years of Experience</label>
                                <input
                                    className="w-full p-4 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all"
                                    type="number"
                                    name="yearsOfExperience"
                                    placeholder="0"
                                    value={formData.yearsOfExperience}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block mb-2 text-accent-cyan font-semibold">Education Level</label>
                                <input
                                    className="w-full p-4 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all"
                                    type="text"
                                    name="educationLevel"
                                    placeholder="e.g. Bachelor's Degree"
                                    value={formData.educationLevel}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="text-right">
                                <button type="button" className="btn-primary" onClick={nextStep}>Next Phase &rarr;</button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div key="step2" className="animate-[fade-in-up_0.4s_ease-out]">
                            <h2 className="mb-6 text-accent-purple text-2xl">Target Parameters</h2>

                            <div className="mb-6">
                                <label className="block mb-2 text-accent-cyan font-semibold">Target Role</label>
                                <input
                                    className="w-full p-4 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all"
                                    type="text"
                                    name="targetRole"
                                    placeholder="e.g. Senior Full Stack Engineer"
                                    value={formData.targetRole}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-accent-cyan font-semibold">Current Skills (Comma Separated)</label>
                                <input
                                    className="w-full p-4 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all"
                                    type="text"
                                    placeholder="JavaScript, React, Node.js"
                                    value={skillsInput}
                                    onChange={(e) => handleArrayChange(e, 'skills')}
                                    required
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block mb-2 text-accent-cyan font-semibold">Interests / Passions (Comma Separated)</label>
                                <input
                                    className="w-full p-4 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all"
                                    type="text"
                                    placeholder="AI, Blockchain, UI Design"
                                    value={interestsInput}
                                    onChange={(e) => handleArrayChange(e, 'interests')}
                                    required
                                />
                            </div>

                            <div className="flex justify-between">
                                <button type="button" className="btn-primary !bg-transparent !border !border-accent-blue hover:!bg-accent-blue/10" onClick={prevStep}>&larr; Back</button>
                                <button type="button" className="btn-primary" onClick={nextStep}>Next Phase &rarr;</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div key="step3" className="animate-[fade-in-up_0.4s_ease-out]">
                            <h2 className="mb-6 text-accent-purple text-2xl">Learning Profile</h2>

                            <div className="mb-6">
                                <label className="block mb-2 text-accent-cyan font-semibold">Preferred Learning Style</label>
                                <select
                                    className="w-full p-4 bg-black/50 border border-white/10 rounded-lg text-white cursor-pointer focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all"
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

                            <div className="mb-8">
                                <label className="block mb-2 text-accent-cyan font-semibold">Time Commitment</label>
                                <input
                                    className="w-full p-4 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all"
                                    type="text"
                                    name="timeCommitment"
                                    placeholder="e.g. 10 hours per week"
                                    value={formData.timeCommitment}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex justify-between">
                                <button type="button" className="btn-primary !bg-transparent !border !border-accent-blue hover:!bg-accent-blue/10" onClick={prevStep}>&larr; Back</button>
                                <button type="submit" className="btn-primary">Submit Assessment</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Assessment;