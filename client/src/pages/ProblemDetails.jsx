import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCode, faBook, faLightbulb, faComments } from '@fortawesome/free-solid-svg-icons';
import problemsData from '../data/problems.json';
import CodeEditor from '../components/CodeEditor';
import ProblemStats from '../components/ProblemStats';
import DiscussionSection from '../components/DiscussionSection';

const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('problem'); // 'problem', 'solution', or 'discussion'
  const problem = problemsData.problems.find(p => p.id === parseInt(id));

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="container mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-red-600">Problem not found</h1>
            <button
              onClick={() => navigate('/dashboard/problems')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Back to Problems
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard/problems')}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Problems
        </button>

        {/* Stats Section */}
        <ProblemStats />

        {/* Problem Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {problem.title}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Acceptance Rate: {problem.acceptance}
                  </span>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FontAwesomeIcon 
                      icon={problem.type === 'theoretical' ? faBook : faCode} 
                      className="mr-2"
                    />
                    {problem.type}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('problem')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === 'problem'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <FontAwesomeIcon icon={faBook} />
                  <span>Problem</span>
                </button>
                <button
                  onClick={() => setActiveTab('solution')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === 'solution'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <FontAwesomeIcon icon={faCode} />
                  <span>Solution</span>
                </button>
                <button
                  onClick={() => setActiveTab('discussion')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === 'discussion'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <FontAwesomeIcon icon={faComments} />
                  <span>Discussion</span>
                </button>
              </nav>
            </div>

            {/* Content */}
            {activeTab === 'problem' && (
              <>
                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Description
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {problem.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hints */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <FontAwesomeIcon icon={faLightbulb} className="mr-2 text-yellow-500" />
                    Hints
                  </h2>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    <li>Think about the time complexity of your solution</li>
                    <li>Consider edge cases and boundary conditions</li>
                    <li>Try to optimize your solution for space complexity</li>
                  </ul>
                </div>
              </>
            )}

            {activeTab === 'solution' && (
              <CodeEditor
                initialCode={`// ${problem.title}\n// Write your solution here\n\n`}
                language={problem.category === 'python' ? 'python' : 'javascript'}
              />
            )}

            {activeTab === 'discussion' && (
              <DiscussionSection problemId={problem.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails; 