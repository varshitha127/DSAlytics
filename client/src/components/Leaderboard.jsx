import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal, faCrown, faChartLine } from '@fortawesome/free-solid-svg-icons';

const Leaderboard = () => {
  const [timeFrame, setTimeFrame] = useState('all'); // 'all', 'month', 'week'
  const [category, setCategory] = useState('all'); // 'all', 'dsa', 'dbms', etc.

  // This would typically come from a backend
  const leaderboardData = [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe',
      rank: 1,
      score: 2500,
      solved: 85,
      streak: 15,
      category: 'dsa'
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
      rank: 2,
      score: 2300,
      solved: 78,
      streak: 12,
      category: 'dbms'
    },
    {
      id: 3,
      name: 'Alex Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson',
      rank: 3,
      score: 2100,
      solved: 72,
      streak: 10,
      category: 'cn'
    },
    // Add more users...
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'dsa', name: 'Data Structures & Algorithms' },
    { id: 'dbms', name: 'Database Management' },
    { id: 'cn', name: 'Computer Networks' },
    { id: 'os', name: 'Operating Systems' }
  ];

  const timeFrames = [
    { id: 'all', name: 'All Time' },
    { id: 'month', name: 'This Month' },
    { id: 'week', name: 'This Week' }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FontAwesomeIcon icon={faCrown} className="text-yellow-500" />;
      case 2:
        return <FontAwesomeIcon icon={faMedal} className="text-gray-400" />;
      case 3:
        return <FontAwesomeIcon icon={faMedal} className="text-amber-600" />;
      default:
        return <FontAwesomeIcon icon={faChartLine} className="text-blue-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 mr-2" />
          Leaderboard
        </h2>
        <div className="flex space-x-4">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeFrames.map(tf => (
              <option key={tf.id} value={tf.id}>{tf.name}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Solved</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Streak</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboardData.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white mr-2">
                      {user.rank}
                    </span>
                    {getRankIcon(user.rank)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {categories.find(c => c.id === user.category)?.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.score}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.solved} problems
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.streak} days
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing 1-10 of 100 users
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 