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
    return (
        <div className="assessment-container">
            <h1>Career Assessment - Step {step} of 3</h1>

            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div>
                        <h2>Current Status</h2>
                        <input
                            type="text"
                            name="currentRole"
                            placeholder="Current Role"
                            value={formData.currentRole}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="yearsOfExperience"
                            placeholder="Years of Experience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="educationLevel"
                            placeholder="Education Level"
                            value={formData.educationLevel}
                            onChange={handleChange}
                            required
                        />
                        <button type="button" onClick={nextStep}>Next</button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h2>Goals & Interests</h2>
                        <input
                            type="text"
                            name="targetRole"
                            placeholder="Target Role"
                            value={formData.targetRole}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Skills (comma-separated)"
                            value={skillsInput}
                            onChange={(e) => handleArrayChange(e, 'skills')}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Interests (comma-separated)"
                            value={interestsInput}
                            onChange={(e) => handleArrayChange(e, 'interests')}
                            required
                        />
                        <button type="button" onClick={prevStep}>Back</button>
                        <button type="button" onClick={nextStep}>Next</button>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h2>Learning Preferences</h2>
                        <select
                            name="preferredLearningStyle"
                            value={formData.preferredLearningStyle}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Learning Style</option>
                            <option value="visual">Visual</option>
                            <option value="auditory">Auditory</option>
                            <option value="reading">Reading/Writing</option>
                            <option value="kinesthetic">Hands-on</option>
                        </select>
                        <input
                            type="text"
                            name="timeCommitment"
                            placeholder="Hours per week you can dedicate"
                            value={formData.timeCommitment}
                            onChange={handleChange}
                            required
                        />
                        <button type="button" onClick={prevStep}>Back</button>
                        <button type="submit">Submit Assessment</button>
                    </div>
                )}
            </form>
        </div>
    );
}
export default Assessment;