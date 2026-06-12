import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import BlocklistManager from '../components/BlocklistManager';
import WeeklyChart from '../components/WeeklyChart';

export default function Dashboard() {
  const { userId, username, logout } = useAuth();
  const navigate = useNavigate();

  const [todayStats, setTodayStats] = useState(null);
  const [weeklyReports, setWeeklyReports] = useState([]);

  const getToday = () => new Date().toISOString().split('T')[0];

  const generateAndFetchReport = async () => {
    try {
      // Generate today's report from sessions
      await API.post('/reports/generate', { userId, date: getToday() });

      // Fetch today's report
      const res = await API.get(`/reports/${userId}/${getToday()}`);
      setTodayStats(res.data);
    } catch {
      setTodayStats({ totalTimeSeconds: 0, productiveSeconds: 0, unproductiveSeconds: 0, topSites: [] });
    }
  };

  const fetchWeeklyReports = async () => {
    try {
      const res = await API.get(`/reports/${userId}`);
      setWeeklyReports(res.data.reverse()); // oldest to newest
    } catch {
      setWeeklyReports([]);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    generateAndFetchReport();
    fetchWeeklyReports();
  }, [userId]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🎯 Productivity Dashboard</h1>
        <div>
          <span className="username">Hi, {username}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {todayStats && (
        <div className="stats-grid">
          <StatsCard label="Total Time Today" value={formatTime(todayStats.totalTimeSeconds)} color="#3b82f6" />
          <StatsCard label="Productive" value={formatTime(todayStats.productiveSeconds)} color="#10b981" />
          <StatsCard label="Unproductive" value={formatTime(todayStats.unproductiveSeconds)} color="#ef4444" />
        </div>
      )}

      <div className="dashboard-grid">
        <div className="card">
          <h2>📈 Last 7 Days</h2>
          <WeeklyChart data={weeklyReports} />
        </div>

        <div className="card">
          <h2>🔥 Top Sites Today</h2>
          {todayStats?.topSites?.length > 0 ? (
            <ul className="top-sites">
              {todayStats.topSites.map((site, i) => (
                <li key={i}>
                  <span>{site.domain}</span>
                  <span>{formatTime(site.duration)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">No data yet. Browse some sites with the extension active!</p>
          )}
        </div>

        <div className="card">
          <h2>🚫 Blocked Sites</h2>
          <BlocklistManager userId={userId} />
        </div>
      </div>

      <button onClick={generateAndFetchReport} className="refresh-btn">🔄 Refresh Data</button>
    </div>
  );
}