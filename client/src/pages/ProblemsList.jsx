import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faFilter,
  faCheck,
  faLock,
  faCircle,
  faList,
  faBook,
  faCode,
  faDatabase,
  faNetworkWired,
  faLaptopCode,
  faGlobe,
  faObjectGroup,
  faPlus,
  faSort,
  faEye
} from '@fortawesome/free-solid-svg-icons';

const ProblemsList = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  // Categories with their icons
  const categories = [
    { id: 'dsa', name: 'Data Structures & Algorithms', icon: faCode, color: 'text-blue-500', count: 0 },
    { id: 'dbms', name: 'Database Management', icon: faDatabase, color: 'text-green-500', count: 0 },
    { id: 'cn', name: 'Computer Networks', icon: faNetworkWired, color: 'text-purple-500', count: 0 },
    { id: 'os', name: 'Operating Systems', icon: faLaptopCode, color: 'text-red-500', count: 0 },
    { id: 'java', name: 'Java Programming', icon: faCode, color: 'text-orange-500', count: 0 },
    { id: 'python', name: 'Python Programming', icon: faCode, color: 'text-yellow-500', count: 0 },
    { id: 'web', name: 'Web Development', icon: faGlobe, color: 'text-indigo-500', count: 0 },
    { id: 'oops', name: 'Object Oriented Programming', icon: faObjectGroup, color: 'text-pink-500', count: 0 }
  ];

  // Mock data for problems
  const mockProblems = [
    {
      id: 1,
      title: "Two Sum",
      category: "dsa",
      difficulty: "easy",
      status: "solved",
      type: "practical",
      acceptance: "85%",
      description: "Find two numbers in an array that add up to a target value"
    },
    {
      id: 2,
      title: "Binary Tree Traversal",
      category: "dsa",
      difficulty: "medium",
      status: "attempted",
      type: "practical",
      acceptance: "72%",
      description: "Implement inorder, preorder, and postorder traversal"
    },
    {
      id: 3,
      title: "SQL Joins",
      category: "dbms",
      difficulty: "medium",
      status: "unsolved",
      type: "theoretical",
      acceptance: "68%",
      description: "Understand different types of SQL joins"
    },
    {
      id: 4,
      title: "TCP/IP Protocol",
      category: "cn",
      difficulty: "hard",
      status: "locked",
      type: "theoretical",
      acceptance: "45%",
      description: "Deep dive into TCP/IP protocol stack"
    },
    {
      id: 5,
      title: "Process Scheduling",
      category: "os",
      difficulty: "medium",
      status: "unsolved",
      type: "theoretical",
      acceptance: "58%",
      description: "Implement various process scheduling algorithms"
    },
    {
      id: 6,
      title: "Java Collections",
      category: "java",
      difficulty: "easy",
      status: "solved",
      type: "practical",
      acceptance: "90%",
      description: "Work with Java collections framework"
    },
    {
      id: 7,
      title: "Python Decorators",
      category: "python",
      difficulty: "medium",
      status: "attempted",
      type: "practical",
      acceptance: "63%",
      description: "Create and use Python decorators"
    },
    {
      id: 8,
      title: "RESTful API Design",
      category: "web",
      difficulty: "medium",
      status: "unsolved",
      type: "practical",
      acceptance: "71%",
      description: "Design RESTful APIs following best practices"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProblems(mockProblems);
      setLoading(false);
    }, 1000);
  }, []);

  const handleProblemClick = (problemId) => {
    navigate(`/problems/${problemId}`);
  };

  // Filter problems based on selected filters
  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'all' || problem.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory;
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDifficulty && matchesStatus && matchesCategory && matchesSearch;
  });

  // Sort problems
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'difficulty') {
      const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
      aValue = difficultyOrder[a.difficulty];
      bValue = difficultyOrder[b.difficulty];
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'solved':
        return <FontAwesomeIcon icon={faCheck} className="text-green-500" />;
      case 'locked':
        return <FontAwesomeIcon icon={faLock} className="text-gray-400" />;
      case 'attempted':
        return <FontAwesomeIcon icon={faCircle} className="text-yellow-500" />;
      default:
        return <FontAwesomeIcon icon={faCircle} className="text-gray-300" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Problems</h1>
              <p className="text-gray-600 dark:text-gray-400">Master DSA concepts through practice</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                <FontAwesomeIcon icon={faPlus} />
                <span>Create Problem</span>
              </button>
            </div>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search problems by title or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-3.5 text-gray-400"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="solved">Solved</option>
                <option value="attempted">Attempted</option>
                <option value="unsolved">Unsolved</option>
                <option value="locked">Locked</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>

              <select
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
              >
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="difficulty-asc">Difficulty (Easy to Hard)</option>
                <option value="difficulty-desc">Difficulty (Hard to Easy)</option>
                <option value="acceptance-desc">Acceptance Rate (High to Low)</option>
                <option value="acceptance-asc">Acceptance Rate (Low to High)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FontAwesomeIcon icon={faCheck} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Solved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {problems.filter(p => p.status === 'solved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <FontAwesomeIcon icon={faCircle} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attempted</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {problems.filter(p => p.status === 'attempted').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <FontAwesomeIcon icon={faCircle} className="text-gray-600 dark:text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unsolved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {problems.filter(p => p.status === 'unsolved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FontAwesomeIcon icon={faList} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{problems.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => {
              const categoryCount = problems.filter(p => p.category === category.id).length;
              return (
                <button
                  key={category.id}
                  className={`flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition duration-200 border-2 ${
                    selectedCategory === category.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-transparent'
                  }`}
                  onClick={() => setSelectedCategory(category.id === selectedCategory ? 'all' : category.id)}
                >
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={category.icon} className={`${category.color} text-xl`} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {categoryCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Problems ({sortedProblems.length})
            </h2>
          </div>
          
          {sortedProblems.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No problems found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedProblems.map(problem => (
                <div 
                  key={problem.id} 
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                  onClick={() => handleProblemClick(problem.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(problem.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {problem.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {problem.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <FontAwesomeIcon 
                              icon={categories.find(c => c.id === problem.category)?.icon || faCode} 
                              className={`${categories.find(c => c.id === problem.category)?.color || 'text-gray-500'}`}
                            />
                            <span>{categories.find(c => c.id === problem.category)?.name || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FontAwesomeIcon 
                              icon={problem.type === 'theoretical' ? faBook : faCode} 
                              className="text-gray-400"
                            />
                            <span>{problem.type === 'theoretical' ? 'Theoretical' : 'Practical'}</span>
                          </div>
                          <span>Acceptance: {problem.acceptance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon icon={faEye} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemsList; 