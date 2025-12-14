import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Dashboard() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await api.get('/assessment');
      setAssessments(response.data.assessments || []);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assessment? This will also delete its roadmap.')) {
      return;
    }

    try {
      await api.delete(`/assessment/${id}`);
      setAssessments(assessments.filter(a => a._id !== id));
    } catch (error) {
      alert('Failed to delete assessment');
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="text-gradient">Your Command Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
            Manage your career paths and track your progress.
          </p>
        </div>

        <div className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Active Assessments</h2>
            <Link to="/assessment">
              <button className="btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem' }}>
                + New Assessment
              </button>
            </Link>
          </div>

          {assessments.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🚀</div>
              <h3 style={{ marginBottom: '1rem' }}>No Career Paths Found</h3>
              <p style={{ marginBottom: '2rem' }}>Start your journey by creating a new AI assessment.</p>
              <Link to="/assessment">
                <button className="btn-primary">Initialize Career Path</button>
              </Link>
            </div>
          ) : (
            <div className="assessment-cards">
              {assessments.map((assessment) => (
                <div key={assessment._id} className="assessment-card glass-panel" style={{ position: 'relative' }}>
                  <h3>{assessment.targetRole || 'Untitled Path'}</h3>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <p><strong>Current:</strong> {assessment.currentRole}</p>
                    <p><strong>Experience:</strong> {assessment.yearsOfExperience} years</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Created: {new Date(assessment.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="card-actions">
                    <Link to={`/roadmap?assessmentId=${assessment._id}`} style={{ flex: 1 }}>
                      <button className="btn-primary" style={{ width: '100%' }}>View Map</button>
                    </Link>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(assessment._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;