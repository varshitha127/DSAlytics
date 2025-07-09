import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faBook, faTrophy, faChartLine, faCalendarAlt, faFire, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import ProblemStats from '../components/ProblemStats';
import Leaderboard from '../components/Leaderboard';
import AuthContext from '../contexts/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [solvedStats, setSolvedStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0 });
  const [studyPlanAnalytics, setStudyPlanAnalytics] = useState({ totalCompleted: 0, completedToday: 0, streak: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext) || {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user info
        const userRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error('Failed to fetch user info');
        const userData = await userRes.json();
        setUser(userData);

        // Fetch solved problems
        const statusRes = await fetch('/api/problems/status/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!statusRes.ok) throw new Error('Failed to fetch problem statuses');
        const { statuses } = await statusRes.json();
        let easy = 0, medium = 0, hard = 0, total = 0;
        let activity = [];
        statuses.forEach(s => {
          if (s.status === 'solved') {
            total++;
            if (s.difficulty === 'easy') easy++;
            else if (s.difficulty === 'medium') medium++;
            else if (s.difficulty === 'hard') hard++;
            activity.push({
              id: s.problemId,
              type: 'solve',
              problem: s.problemTitle || s.problemId,
              difficulty: s.difficulty,
              timestamp: s.updatedAt || s.createdAt,
            });
          }
        });
        setSolvedStats({ total, easy, medium, hard });

        // Fetch study plan analytics
        const analyticsRes = await fetch('/api/user-study-plans/analytics/summary', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!analyticsRes.ok) throw new Error('Failed to fetch study plan analytics');
        const analytics = await analyticsRes.json();
        setStudyPlanAnalytics(analytics);

        // Fetch user study plans for more activity (optional)
        // const plansRes = await fetch('/api/userStudyPlan/', {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // if (plansRes.ok) {
        //   const plans = await plansRes.json();
        //   // You can add more activity from plans if needed
        // }

        // Sort activity by timestamp (descending)
        activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRecentActivity(activity.slice(0, 10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* User Greeting */}
        {user && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user.name || user.email}!</h1>
          </div>
        )}
        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leaderboard'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Leaderboard
            </button>
          </nav>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Solved</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{solvedStats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <span>Easy</span>
                    <span>{solvedStats.easy}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(solvedStats.total ? (solvedStats.easy / solvedStats.total) * 100 : 0)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>Medium</span>
                    <span>{solvedStats.medium}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(solvedStats.total ? (solvedStats.medium / solvedStats.total) * 100 : 0)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>Hard</span>
                    <span>{solvedStats.hard}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(solvedStats.total ? (solvedStats.hard / solvedStats.total) * 100 : 0)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{studyPlanAnalytics.streak} days</p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                    <FontAwesomeIcon icon={faFire} className="text-orange-600 dark:text-orange-400 text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completed today: {studyPlanAnalytics.completedToday}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Study Plan Progress</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{studyPlanAnalytics.totalCompleted} topics</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <FontAwesomeIcon icon={faBook} className="text-purple-600 dark:text-purple-400 text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Keep up the good work!
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Activity</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">Last 7 days</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <FontAwesomeIcon icon={faChartLine} className="text-green-600 dark:text-green-400 text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {recentActivity.length} activities
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.length === 0 && <div className="text-gray-500">No recent activity.</div>}
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      {activity.type === 'solve' ? (
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-3" />
                      ) : (
                        <FontAwesomeIcon icon={faFire} className="text-orange-500 mr-3" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.type === 'solve' ? (
                            <>
                              Solved <span className={getDifficultyColor(activity.difficulty)}>{activity.problem}</span>
                            </>
                          ) : (
                            <>
                              Achieved {activity.days} day streak!
                            </>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                to="/problems"
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Practice Problems</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Continue solving problems to improve your skills
                    </p>
                  </div>
                  <FontAwesomeIcon icon={faCode} className="text-blue-500 text-2xl" />
                </div>
              </Link>
              <Link
                to="/study-plan"
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Study Plan</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Track your study plan progress
                    </p>
                  </div>
                  <FontAwesomeIcon icon={faBook} className="text-purple-500 text-2xl" />
                </div>
              </Link>
            </div>
          </>
        ) : (
          <Leaderboard />
        )}
      </div>
    </div>
  );
};

export default Dashboard; 