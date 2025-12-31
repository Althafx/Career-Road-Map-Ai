import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ConfirmationModal from '../components/ConfirmationModal';

function Dashboard() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState(null);

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

  const confirmDelete = async () => {
    if (!assessmentToDelete) return;

    try {
      await api.delete(`/assessment/${assessmentToDelete}`);
      setAssessments(assessments.filter(a => a._id !== assessmentToDelete));
    } catch (error) {
      alert('Failed to delete assessment');
    }
  };

  if (loading) {
    return (
      <div className="page-container flex justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="dashboard-container">
        <div className="text-center mb-16">
          <h1 className="text-gradient text-6xl mb-4">Your Command Center</h1>
          <p className="text-slate-400 text-xl">
            Manage your career paths and track your progress.
          </p>
        </div>

        <div className="dashboard-section">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl">Active Assessments</h2>
            <Link to="/assessment">
              <button className="btn-primary !px-6 !py-3 !text-sm">
                + New Assessment
              </button>
            </Link>
          </div>

          {assessments.length === 0 ? (
            <div className="glass-panel p-12 text-center">
              <div className="text-6xl mb-4 opacity-50">🚀</div>
              <h3 className="text-2xl mb-4">No Career Paths Found</h3>
              <p className="mb-8 text-slate-300">Start your journey by creating a new AI assessment.</p>
              <Link to="/assessment">
                <button className="btn-primary">Initialize Career Path</button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {assessments.map((assessment) => (
                <div key={assessment._id} className="assessment-card glass-panel relative flex flex-col justify-between h-full">
                  {/* Note: assessment-card class handles basic styling */}
                  <div>
                    <h3 className="text-accent-cyan text-2xl mb-6">{assessment.targetRole || 'Untitled Path'}</h3>

                    <div className="mb-6 space-y-2">
                      <p><strong className="text-slate-300">Current:</strong> {assessment.currentRole}</p>
                      <p><strong className="text-slate-300">Experience:</strong> {assessment.yearsOfExperience} years</p>

                      {assessment.hasRoadmap && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Mission Progress</span>
                            <span className="text-accent-cyan font-bold">{assessment.progressPercentage || 0}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-accent-cyan to-accent-purple h-full transition-all duration-1000"
                              style={{ width: `${assessment.progressPercentage || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <p className="text-sm text-slate-400 mt-2">
                        Created: {new Date(assessment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link to={`/roadmap?assessmentId=${assessment._id}`} className="flex-1">
                      <button className="btn-primary w-full">View Map</button>
                    </Link>
                    <button
                      className="btn-danger"
                      onClick={() => {
                        setAssessmentToDelete(assessment._id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  {/* Completion Badge */}
                  {assessment.roadmapCompleted && (
                    <div className="absolute -top-0 -right-0 bg-gradient-to-r from-green-400 to-green-600 text-black font-bold px-4 py-1 rounded-md text-xs shadow-[0_0_15px_rgba(74,222,128,0.5)] border border-white/20 z-10 animate-pulse">
                      ALL MISSIONS COMPLETE
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Assessment?"
        message="This action will permanently remove this career trajectory and all linked mission progress. This cannot be undone."
        type="danger"
      />
    </div>
  );
}

export default Dashboard;
