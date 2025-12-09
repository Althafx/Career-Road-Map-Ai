import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
function Roadmap() {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        fetchRoadmap();
    }, []);
    const fetchRoadmap = async () => {
        try {
            const response = await api.get('/roadmap');
            setRoadmap(response.data.roadmap);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('No roadmap found. Generate one below!');
            }
        }
    };
    const handleGenerate = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/roadmap/generate');
            setRoadmap(response.data.roadmap);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate roadmap');
        } finally {
            setLoading(false);
        }
    };
    const handleRegenerate = async () => {
        if (!window.confirm('Regenerate roadmap? This will replace your current one.')) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/roadmap/regenerate');
            setRoadmap(response.data.roadmap);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to regenerate roadmap');
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="roadmap-container">
                <h1>Generating Your Career Roadmap...</h1>
                <p>This may take a few moments. Please wait.</p>
                <div className="spinner"></div>
            </div>
        );
    }
    return (
        <div className="roadmap-container">
            <h1>Your Career Roadmap</h1>

            {error && <p className="error">{error}</p>}

            {!roadmap ? (
                <div>
                    <p>Generate your personalized career roadmap based on your assessment.</p>
                    <button onClick={handleGenerate}>Generate Roadmap</button>
                </div>
            ) : (
                <div>
                    <div className="roadmap-section">
                        <h2>Career Advice</h2>
                        <div className="advice-content">
                            {roadmap.careerAdvice.split('\n').map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                    </div>

                    <div className="roadmap-section">
                        <h2>Learning Roadmap</h2>
                        <div className="roadmap-content">
                            {roadmap.roadmapContent.split('\n').map((line, index) => {
                                // Bold headers (lines starting with **)
                                if (line.startsWith('**') && line.endsWith('**')) {
                                    return <h3 key={index}>{line.replace(/\*\*/g, '')}</h3>;
                                }
                                // Bullet points
                                if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                                    return <li key={index}>{line.replace(/^[\-\*]\s/, '')}</li>;
                                }
                                // Regular paragraphs
                                if (line.trim()) {
                                    return <p key={index}>{line}</p>;
                                }
                                return null;
                            })}
                        </div>
                    </div>

                    <button onClick={handleRegenerate}>Regenerate Roadmap</button>
                </div>
            )}
        </div>
    );
}
export default Roadmap;