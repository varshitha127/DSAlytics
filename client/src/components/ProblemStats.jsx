import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faChartLine, faClock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ProblemStats = () => {
  // This would typically come from a backend/context
  const stats = {
    totalSolved: 42,
    easySolved: 25,
    mediumSolved: 12,
    hardSolved: 5,
    streak: 7,
    totalProblems: 100,
    averageTime: '25 mins'
  };

  const progress = (stats.totalSolved / stats.totalProblems) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Progress</h2>
      
      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Solved</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSolved}</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faChartLine} className="text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Current Streak</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.streak} days</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faClock} className="text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageTime}</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {((stats.totalSolved / stats.totalProblems) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Difficulty Breakdown</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-green-600 dark:text-green-400">Easy</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{stats.easySolved} solved</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.easySolved / 30) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-yellow-600 dark:text-yellow-400">Medium</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{stats.mediumSolved} solved</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(stats.mediumSolved / 50) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-red-600 dark:text-red-400">Hard</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{stats.hardSolved} solved</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(stats.hardSolved / 20) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemStats; 