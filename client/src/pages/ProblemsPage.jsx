import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  faObjectGroup
} from '@fortawesome/free-solid-svg-icons';
import { FixedSizeList as List } from 'react-window';
import Leaderboard from '../components/Leaderboard';

const ProblemsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('dsa');
  const [searchQuery, setSearchQuery] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 20;
  const [minAcceptance, setMinAcceptance] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [userStatus, setUserStatus] = useState({});
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [showFavorites, setShowFavorites] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'info' });
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Fetch problems from backend when selectedCategory changes
  useEffect(() => {
    if (!selectedCategory) return;
    setLoading(true);
    setError(null);
    fetch(`/api/problems/${selectedCategory}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch problems');
        return res.json();
      })
      .then(data => {
        setProblems(data.problems || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setProblems([]);
        setLoading(false);
      });
  }, [selectedCategory]);

  // Fetch user problem statuses from backend
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/problems/status/all', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => {
        const statusMap = {};
        (data.statuses || []).forEach(s => {
          statusMap[s.problemId] = { status: s.status, favorite: s.favorite };
        });
        setUserStatus(statusMap);
      })
      .catch(() => setUserStatus({}));
  }, [isAuthenticated, selectedCategory]);

  // Show snackbar for 2 seconds
  const showSnackbar = (message, type = 'info') => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => setSnackbar({ open: false, message: '', type: 'info' }), 2000);
  };

  // Optimistic UI for updateStatus
  const updateStatus = (problemId, status, favorite) => {
    // Save previous state for rollback
    const prev = userStatus[problemId] || {};
    // Optimistically update UI
    setUserStatus(prevStatus => ({
      ...prevStatus,
      [problemId]: {
        status: typeof status === 'string' ? status : prev.status,
        favorite: typeof favorite === 'boolean' ? favorite : prev.favorite
      }
    }));
    fetch('/api/problems/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ problemId, status, favorite })
    })
      .then(res => res.json())
      .then(data => {
        setUserStatus(prevStatus => ({
          ...prevStatus,
          [problemId]: {
            status: data.status.status,
            favorite: data.status.favorite
          }
        }));
        if (typeof favorite === 'boolean') {
          showSnackbar(data.status.favorite ? 'Added to favorites!' : 'Removed from favorites!', 'success');
        } else if (status === 'solved') {
          showSnackbar('Marked as solved!', 'success');
        } else if (status === 'attempted') {
          showSnackbar('Marked as attempted!', 'info');
        } else if (status === 'unsolved') {
          showSnackbar('Marked as unsolved!', 'info');
        }
      })
      .catch(() => {
        // Rollback on error
        setUserStatus(prevStatus => ({
          ...prevStatus,
          [problemId]: prev
        }));
        showSnackbar('Failed to update. Please try again.', 'error');
      });
  };

  const toggleStatus = (problemId, status) => {
    const current = userStatus[problemId] || {};
    if (status === 'favorite') {
      updateStatus(problemId, current.status, !current.favorite);
    } else {
      updateStatus(problemId, current.status === status ? 'unsolved' : status, current.favorite);
    }
  };

  // Categories with their icons
  const categories = [
    { id: 'dsa', name: 'Data Structures & Algorithms', icon: faCode, color: 'text-blue-500' },
    { id: 'dbms', name: 'Database Management', icon: faDatabase, color: 'text-green-500' },
    { id: 'cn', name: 'Computer Networks', icon: faNetworkWired, color: 'text-purple-500' },
    { id: 'os', name: 'Operating Systems', icon: faLaptopCode, color: 'text-red-500' },
    { id: 'java', name: 'Java Programming', icon: faCode, color: 'text-orange-500' },
    { id: 'python', name: 'Python Programming', icon: faCode, color: 'text-yellow-500' },
    { id: 'web', name: 'Web Development', icon: faGlobe, color: 'text-indigo-500' },
    { id: 'oops', name: 'Object Oriented Programming', icon: faObjectGroup, color: 'text-pink-500' }
  ];

  // Collect all unique tags from problems
  const allTags = Array.from(new Set(problems.flatMap(p => p.tags || []))).filter(Boolean);

  // Pagination logic
  const totalPages = Math.ceil(problems.length / problemsPerPage);
  // Sorting logic
  const sortedProblems = [...problems].filter(problem => {
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty?.toLowerCase() === selectedDifficulty;
    const statusToCheck = userStatus[problem.id]?.status || 'unsolved';
    const matchesStatus = selectedStatus === 'all' || statusToCheck === selectedStatus;
    const matchesSearch = problem.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAcceptance = minAcceptance === 'all' || (problem.acceptance && Number(problem.acceptance) >= Number(minAcceptance));
    const matchesType = selectedType === 'all' || (problem.type ? problem.type.toLowerCase() === selectedType : false);
    const matchesTag = selectedTag === 'all' || (problem.tags && problem.tags.includes(selectedTag));
    return matchesDifficulty && matchesStatus && matchesSearch && matchesAcceptance && matchesType && matchesTag;
  }).sort((a, b) => {
    if (sortOption === 'difficulty') {
      const order = { easy: 1, medium: 2, hard: 3 };
      return (order[a.difficulty?.toLowerCase()] || 0) - (order[b.difficulty?.toLowerCase()] || 0);
    }
    if (sortOption === 'acceptance') {
      return (b.acceptance || 0) - (a.acceptance || 0);
    }
    if (sortOption === 'title') {
      return (a.title || '').localeCompare(b.title || '');
    }
    return 0;
  });
  // Filter for favorites if showFavorites is true
  const displayedProblems = showFavorites
    ? sortedProblems.filter(p => userStatus[p.id]?.favorite)
    : sortedProblems;
  const paginatedProblems = displayedProblems.slice(
    (currentPage - 1) * problemsPerPage,
    currentPage * problemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters/category change
  }, [selectedCategory, selectedDifficulty, selectedStatus, searchQuery, minAcceptance, selectedType, selectedTag, sortOption]);

  const handleProblemClick = (problemId) => {
    navigate(`/dashboard/problems/${problemId}`);
  };

  // Filter problems based on selected filters
  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty?.toLowerCase() === selectedDifficulty;
    const statusToCheck = userStatus[problem.id]?.status || 'unsolved';
    const matchesStatus = selectedStatus === 'all' || statusToCheck === selectedStatus;
    const matchesSearch = problem.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAcceptance = minAcceptance === 'all' || (problem.acceptance && Number(problem.acceptance) >= Number(minAcceptance));
    const matchesType = selectedType === 'all' || (problem.type ? problem.type.toLowerCase() === selectedType : false);
    const matchesTag = selectedTag === 'all' || (problem.tags && problem.tags.includes(selectedTag));
    return matchesDifficulty && matchesStatus && matchesSearch && matchesAcceptance && matchesType && matchesTag;
  });

  const allVisibleProblemIds = paginatedProblems.filter(problem => filteredProblems.includes(problem)).map(p => p.id);
  const allSelected = allVisibleProblemIds.length > 0 && allVisibleProblemIds.every(id => selectedProblems.includes(id));

  const toggleSelectProblem = (id) => {
    setSelectedProblems(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (allSelected) setSelectedProblems(prev => prev.filter(id => !allVisibleProblemIds.includes(id)));
    else setSelectedProblems(prev => [...new Set([...prev, ...allVisibleProblemIds])]);
  };
  const bulkMarkStatus = (status) => {
    selectedProblems.forEach(id => toggleStatus(id, status));
    setSelectedProblems([]);
  };
  const bulkFavorite = () => {
    selectedProblems.forEach(id => toggleStatus(id, 'favorite'));
    setSelectedProblems([]);
  };

  // Calculate progress for the selected category
  const totalProblems = problems.length;
  const solvedCount = problems.filter(p => userStatus[p.id]?.status === 'solved').length;
  const progressPercent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  // Calculate streaks/analytics
  const today = new Date().toISOString().slice(0, 10);
  const solvedDates = Object.entries(userStatus)
    .filter(([_, s]) => s.status === 'solved' && s.solvedAt)
    .map(([_, s]) => s.solvedAt.slice(0, 10));
  const solvedToday = solvedDates.filter(d => d === today).length;
  const solvedThisWeek = solvedDates.filter(d => {
    const now = new Date();
    const date = new Date(d);
    const diff = (now - date) / (1000 * 60 * 60 * 24);
    return diff < 7 && diff >= 0;
  }).length;
  // Calculate current streak
  const streak = (() => {
    let count = 0;
    let date = new Date();
    while (solvedDates.includes(date.toISOString().slice(0, 10))) {
      count++;
      date.setDate(date.getDate() - 1);
    }
    return count;
  })();

  // Generate recommendations: suggest unsolved problems with tags the user has solved before
  const solvedTags = new Set(
    problems.filter(p => userStatus[p.id]?.status === 'solved').flatMap(p => p.tags || [])
  );
  const recommendedProblems = problems.filter(
    p => !userStatus[p.id]?.status || userStatus[p.id]?.status === 'unsolved'
  ).filter(
    p => (p.tags || []).some(tag => solvedTags.has(tag))
  ).slice(0, 5);

  // Keyboard navigation handlers
  const handleKeyDown = (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      if (e.key === 'ArrowDown') {
        setFocusedIndex(i => Math.min(i + 1, paginatedProblems.length - 1));
      } else if (e.key === 'ArrowUp') {
        setFocusedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        if (focusedIndex >= 0) handleProblemClick(paginatedProblems[focusedIndex].id);
      } else if (e.key === ' ') {
        if (focusedIndex >= 0) toggleSelectProblem(paginatedProblems[focusedIndex].id);
      }
    }
  };

  const rowHeight = 56; // px, adjust as needed
  const visibleProblems = paginatedProblems.length > 0 ? paginatedProblems : displayedProblems;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Problem Set</h1>
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search problems..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-3 text-gray-400"
              />
            </div>
            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
              <button
                className={`px-4 py-2 rounded ${selectedStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setSelectedStatus('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded ${selectedStatus === 'solved' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setSelectedStatus('solved')}
              >
                Solved
              </button>
              <button
                className={`px-4 py-2 rounded ${selectedStatus === 'attempted' ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setSelectedStatus('attempted')}
              >
                Attempted
              </button>
              <button
                className={`px-4 py-2 rounded ${selectedStatus === 'unsolved' ? 'bg-gray-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setSelectedStatus('unsolved')}
              >
                Unsolved
              </button>
              <select
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="all">Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={minAcceptance}
                onChange={e => setMinAcceptance(e.target.value)}
              >
                <option value="all">Acceptance Rate</option>
                <option value="50">50%+</option>
                <option value="60">60%+</option>
                <option value="70">70%+</option>
                <option value="80">80%+</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
              >
                <option value="all">Type</option>
                <option value="theoretical">Theoretical</option>
                <option value="practical">Practical</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTag}
                onChange={e => setSelectedTag(e.target.value)}
              >
                <option value="all">Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              className={`flex items-center space-x-3 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition duration-200 ${
                selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <FontAwesomeIcon icon={category.icon} className={`${category.color} text-xl`} />
              <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
            </button>
          ))}
        </div>
        {/* Streaks/Analytics */}
        <div className="mb-4 flex flex-wrap gap-6 items-center">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-300">{streak}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Current Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-green-600 dark:text-green-300">{solvedToday}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Solved Today</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-yellow-600 dark:text-yellow-300">{solvedThisWeek}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Solved This Week</span>
          </div>
        </div>
        {/* Progress Bar for Category */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-200">Progress in {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}</span>
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-200">{solvedCount} / {totalProblems} solved</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        {/* Favorites Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${!showFavorites ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setShowFavorites(false)}
          >
            All Problems
          </button>
          <button
            className={`px-4 py-2 rounded ${showFavorites ? 'bg-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setShowFavorites(true)}
          >
            Favorites
          </button>
        </div>
        {/* Bulk Actions Bar */}
        {selectedProblems.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 items-center bg-blue-50 dark:bg-blue-900/30 p-2 rounded shadow">
            <span className="font-medium text-blue-700 dark:text-blue-200">Bulk actions for {selectedProblems.length} selected:</span>
            <button className="px-3 py-1 rounded bg-green-500 text-white" onClick={() => bulkMarkStatus('solved')}>Mark Solved</button>
            <button className="px-3 py-1 rounded bg-yellow-500 text-white" onClick={() => bulkMarkStatus('attempted')}>Mark Attempted</button>
            <button className="px-3 py-1 rounded bg-gray-500 text-white" onClick={() => bulkMarkStatus('unsolved')}>Mark Unsolved</button>
            <button className="px-3 py-1 rounded bg-pink-500 text-white" onClick={bulkFavorite}>Favorite</button>
            <button className="px-3 py-1 rounded bg-red-500 text-white" onClick={() => setSelectedProblems([])}>Clear</button>
          </div>
        )}
        {/* Tag Filter UI */}
        {allTags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
            <button
              className={`px-3 py-1 rounded-full border ${selectedTag === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setSelectedTag('all')}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full border ${selectedTag === tag ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        {/* Sort Options UI */}
        <div className="flex gap-2 items-center mb-2">
          <label htmlFor="sort" className="text-sm text-gray-700 dark:text-gray-300">Sort by:</label>
          <select
            id="sort"
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="difficulty">Difficulty</option>
            <option value="acceptance">Acceptance</option>
            <option value="title">Title</option>
          </select>
        </div>
        {/* Problems Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-6 w-6" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/12" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/12" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/12" />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-2 py-3"><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} /></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acceptance</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {visibleProblems.length > 50 ? (
                  <List
                    height={Math.min(10, visibleProblems.length) * rowHeight}
                    itemCount={visibleProblems.length}
                    itemSize={rowHeight}
                    width="100%"
                  >
                    {({ index, style }) => {
                      const problem = visibleProblems[index];
                      return (
                        <tr
                          key={problem.id}
                          style={style}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150${focusedIndex === index ? ' ring-2 ring-blue-400' : ''}`}
                          onClick={() => handleProblemClick(problem.id)}
                          tabIndex={0}
                          aria-selected={selectedProblems.includes(problem.id)}
                          aria-label={`Problem ${problem.title}`}
                          onKeyDown={handleKeyDown}
                          onFocus={() => setFocusedIndex(index)}
                        >
                          <td className="px-2 py-4"><input type="checkbox" checked={selectedProblems.includes(problem.id)} onChange={e => { e.stopPropagation(); toggleSelectProblem(problem.id); }} /></td>
                          <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                            <button onClick={e => { e.stopPropagation(); toggleStatus(problem.id, 'solved'); }} title="Mark as Solved">
                              <FontAwesomeIcon icon={faCheck} className={userStatus[problem.id]?.status === 'solved' ? 'text-green-500' : 'text-gray-300'} />
                            </button>
                            <button onClick={e => { e.stopPropagation(); toggleStatus(problem.id, 'attempted'); }} title="Mark as Attempted">
                              <FontAwesomeIcon icon={faCircle} className={userStatus[problem.id]?.status === 'attempted' ? 'text-yellow-500' : 'text-gray-300'} />
                            </button>
                            <button onClick={e => { e.stopPropagation(); toggleStatus(problem.id, 'favorite'); }} title="Favorite">
                              <FontAwesomeIcon icon={faBook} className={userStatus[problem.id]?.favorite ? 'text-pink-500' : 'text-gray-300'} />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{problem.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FontAwesomeIcon 
                                icon={categories.find(c => c.id === selectedCategory)?.icon || faCode} 
                                className={`${categories.find(c => c.id === selectedCategory)?.color || 'text-gray-500'} mr-2`}
                              />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {categories.find(c => c.id === selectedCategory)?.name || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                                problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FontAwesomeIcon 
                                icon={problem.type === 'theoretical' ? faBook : faCode} 
                                className="mr-2 text-gray-400"
                              />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {problem.type === 'theoretical' ? 'Theoretical' : 'Practical'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {problem.acceptance ? `${problem.acceptance}%` : '--'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {(problem.tags || []).map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-xs">{tag}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    }}
                  </List>
                ) : (
                  visibleProblems.map((problem, i) => (
                    <tr
                      key={problem.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150${focusedIndex === i ? ' ring-2 ring-blue-400' : ''}`}
                      onClick={() => handleProblemClick(problem.id)}
                      tabIndex={0}
                      aria-selected={selectedProblems.includes(problem.id)}
                      aria-label={`Problem ${problem.title}`}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setFocusedIndex(i)}
                    >
                      <td className="px-2 py-4"><input type="checkbox" checked={selectedProblems.includes(problem.id)} onChange={e => { e.stopPropagation(); toggleSelectProblem(problem.id); }} /></td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                        <button onClick={e => { e.stopPropagation(); toggleStatus(problem.id, 'solved'); }} title="Mark as Solved">
                          <FontAwesomeIcon icon={faCheck} className={userStatus[problem.id]?.status === 'solved' ? 'text-green-500' : 'text-gray-300'} />
                        </button>
                        <button onClick={e => { e.stopPropagation(); toggleStatus(problem.id, 'attempted'); }} title="Mark as Attempted">
                          <FontAwesomeIcon icon={faCircle} className={userStatus[problem.id]?.status === 'attempted' ? 'text-yellow-500' : 'text-gray-300'} />
                        </button>
                        <button onClick={e => { e.stopPropagation(); toggleStatus(problem.id, 'favorite'); }} title="Favorite">
                          <FontAwesomeIcon icon={faBook} className={userStatus[problem.id]?.favorite ? 'text-pink-500' : 'text-gray-300'} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{problem.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FontAwesomeIcon 
                            icon={categories.find(c => c.id === selectedCategory)?.icon || faCode} 
                            className={`${categories.find(c => c.id === selectedCategory)?.color || 'text-gray-500'} mr-2`}
                          />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {categories.find(c => c.id === selectedCategory)?.name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                            problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FontAwesomeIcon 
                            icon={problem.type === 'theoretical' ? faBook : faCode} 
                            className="mr-2 text-gray-400"
                          />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {problem.type === 'theoretical' ? 'Theoretical' : 'Practical'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {problem.acceptance ? `${problem.acceptance}%` : '--'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {(problem.tags || []).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-xs">{tag}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        {/* Snackbar */}
        {snackbar.open && (
          <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white transition-all duration-300 ${snackbar.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
            {snackbar.message}
          </div>
        )}
      </div>
      {/* Leaderboard Section */}
      <div className="mt-8">
        <Leaderboard category={selectedCategory} />
      </div>
      {/* Recommendations Section */}
      {recommendedProblems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-300">Recommended for You</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recommendedProblems.map(problem => (
              <div key={problem.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-2 cursor-pointer hover:ring-2 hover:ring-blue-400 transition" onClick={() => handleProblemClick(problem.id)}>
                <div className="font-semibold text-gray-900 dark:text-white">{problem.title}</div>
                <div className="flex flex-wrap gap-1">
                  {(problem.tags || []).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-xs">{tag}</span>
                  ))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{problem.difficulty}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemsPage; 