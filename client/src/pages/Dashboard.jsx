import { Link } from 'react-router-dom';
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="dashboard-links">
        <Link to="/assessment">
          <button>Take Assessment</button>
        </Link>
        <Link to="/roadmap">
          <button>View Roadmap</button>
        </Link>
      </div>
    </div>
  );
}
export default Dashboard;