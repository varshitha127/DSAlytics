import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay,
  faCheck,
  faLock,
  faClock,
  faBook,
  faCode,
  faDatabase,
  faNetworkWired,
  faLaptopCode,
  faGlobe,
  faObjectGroup,
  faChartLine,
  faCalendarAlt,
  faBullseye,
  faTrophy,
  faLightbulb,
  faArrowRight,
  faStar,
  faUsers,
  faBookmark
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import Confetti from 'react-confetti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudyPlan = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [studyPlans, setStudyPlans] = useState([]);
  const [userPlans, setUserPlans] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [lastProgress, setLastProgress] = useState({});
  const [analytics, setAnalytics] = useState({ totalCompleted: 0, completedToday: 0, streak: 0 });
  const [showReminder, setShowReminder] = useState(false);
  const [lastActivity, setLastActivity] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customTopics, setCustomTopics] = useState([{ title: '', duration: '' }]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [groupIdInput, setGroupIdInput] = useState('');
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const categories = [
    { id: 'all', name: 'All Plans', icon: faBook },
    { id: 'dsa', name: 'Data Structures & Algorithms', icon: faCode },
    { id: 'dbms', name: 'Database Management', icon: faDatabase },
    { id: 'cn', name: 'Computer Networks', icon: faNetworkWired },
    { id: 'os', name: 'Operating Systems', icon: faLaptopCode },
    { id: 'web', name: 'Web Development', icon: faGlobe }
  ];

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      try {
        const [plansRes, userPlansRes] = await Promise.all([
          axios.get('/api/study-plans'),
          axios.get('/api/user-study-plans')
        ]);
        setStudyPlans(plansRes.data);
        setUserPlans(userPlansRes.data);
      } catch (err) {
        setStudyPlans([]);
        setUserPlans([]);
      }
      setLoading(false);
    }
    fetchPlans();
  }, []);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await axios.get('/api/user-study-plans/analytics/summary');
        setAnalytics(res.data);
      } catch (err) {
        setAnalytics({ totalCompleted: 0, completedToday: 0, streak: 0 });
      }
    }
    fetchAnalytics();
  }, [userPlans]);

  useEffect(() => {
    // Find the most recent lastActivityAt from all user plans
    const mostRecent = userPlans.reduce((latest, up) => {
      if (up.lastActivityAt) {
        const d = new Date(up.lastActivityAt);
        return !latest || d > latest ? d : latest;
      }
      return latest;
    }, null);
    setLastActivity(mostRecent);
    if (mostRecent) {
      const now = new Date();
      const diff = (now - mostRecent) / (1000 * 60 * 60 * 24);
      setShowReminder(diff >= 3);
    } else {
      setShowReminder(true);
    }
  }, [userPlans]);

  // Helper to get user-specific plan data
  const getUserPlan = (planId) => userPlans.find(up => up.studyPlanId._id === planId);

  const filteredPlans = activeTab === 'all' 
    ? studyPlans 
    : studyPlans.filter(plan => plan.category === activeTab);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheck} className="text-green-500" />;
      case 'in-progress':
        return <FontAwesomeIcon icon={faPlay} className="text-blue-500" />;
      case 'locked':
        return <FontAwesomeIcon icon={faLock} className="text-gray-400" />;
      default:
        return <FontAwesomeIcon icon={faClock} className="text-gray-300" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
  };

  const handleStartPlan = (planId) => {
    navigate(`/study-plan/${planId}`);
  };

  // Update topic progress for user
  const handleTopicStatusChange = async (planId, topicId, status) => {
    const userPlan = getUserPlan(planId);
    const prevTopic = userPlan?.topicsProgress.find(t => t.topicId === topicId);
    setHistory(h => [...h, { planId, topicId, prevStatus: prevTopic?.status }]);
    setRedoStack([]);
    try {
      const res = await axios.patch(`/api/user-study-plans/${planId}/topics/${topicId}`, { status });
      setUserPlans(prev => prev.map(up => up._id === res.data._id ? res.data : up));
    } catch (err) {
      // handle error
    }
  };
  const handleUndo = async () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setRedoStack(r => [...r, last]);
    try {
      const res = await axios.patch(`/api/user-study-plans/${last.planId}/topics/${last.topicId}`, { status: last.prevStatus });
      setUserPlans(prev => prev.map(up => up._id === res.data._id ? res.data : up));
    } catch (err) {}
  };
  const handleRedo = async () => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    setRedoStack(r => r.slice(0, -1));
    setHistory(h => [...h, last]);
    // Redo means reapplying the change, so set to the next logical status
    const userPlan = getUserPlan(last.planId);
    const topic = userPlan?.topicsProgress.find(t => t.topicId === last.topicId);
    let nextStatus = 'not-started';
    if (last.prevStatus === 'completed') nextStatus = 'in-progress';
    else if (last.prevStatus === 'in-progress') nextStatus = 'completed';
    try {
      const res = await axios.patch(`/api/user-study-plans/${last.planId}/topics/${last.topicId}`, { status: nextStatus });
      setUserPlans(prev => prev.map(up => up._id === res.data._id ? res.data : up));
    } catch (err) {}
  };

  // Animate progress bar and show feedback
  useEffect(() => {
    if (!selectedPlan) return;
    const userPlan = getUserPlan(selectedPlan._id);
    if (!userPlan) return;
    const prev = lastProgress[selectedPlan._id] || 0;
    if (userPlan.progress > prev) {
      if (userPlan.progress === 100) {
        toast.success('Congratulations! You completed the plan!');
        setShowConfetti(true);
        setConfettiKey(k => k + 1);
        setTimeout(() => setShowConfetti(false), 4000);
      } else {
        toast.success('Topic completed!');
      }
    }
    setLastProgress(lp => ({ ...lp, [selectedPlan._id]: userPlan.progress }));
  }, [userPlans, selectedPlan]);

  const handleAddCustomTopic = () => setCustomTopics([...customTopics, { title: '', duration: '' }]);
  const handleRemoveCustomTopic = idx => setCustomTopics(customTopics.filter((_, i) => i !== idx));
  const handleCustomTopicChange = (idx, field, value) => {
    setCustomTopics(customTopics.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };
  const handleCreateCustomPlan = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/user-study-plans/custom', {
        title: customTitle,
        description: customDescription,
        topics: customTopics.filter(t => t.title.trim())
      });
      setShowCustomModal(false);
      setCustomTitle('');
      setCustomDescription('');
      setCustomTopics([{ title: '', duration: '' }]);
      // Refetch plans
      const userPlansRes = await axios.get('/api/user-study-plans');
      setUserPlans(userPlansRes.data);
      toast.success('Custom plan created!');
    } catch (err) {
      toast.error('Failed to create custom plan');
    }
  };

  const handleSharePlan = async () => {
    if (!selectedPlan || !selectedPlan._id) return;
    if (shareEmail) {
      // Simulate finding user by email (in real app, fetch userId by email)
      toast.info('Invite by email is a placeholder. Use userId for demo.');
    }
    // For demo, just copy a share link
    const link = `${window.location.origin}/study-plan/${selectedPlan._id}`;
    setShareLink(link);
    navigator.clipboard.writeText(link);
    toast.success('Share link copied!');
  };
  const handleJoinGroup = async () => {
    try {
      await axios.post('/api/user-study-plans/join-group', { groupId: groupIdInput, planId: selectedPlan?._id });
      setShowJoinGroupModal(false);
      toast.success('Joined group plan!');
    } catch (err) {
      toast.error('Failed to join group');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading study plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Study Plans
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Structured learning paths to master computer science concepts and advance your career
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FontAwesomeIcon icon={faBook} />
                </div>
                <div className="ml-4">
                  <p className="text-sm opacity-90">Total Plans</p>
                  <p className="text-2xl font-bold">{studyPlans.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                <div className="ml-4">
                  <p className="text-sm opacity-90">Completed</p>
                  <p className="text-2xl font-bold">
                    {studyPlans.filter(p => p.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FontAwesomeIcon icon={faPlay} />
                </div>
                <div className="ml-4">
                  <p className="text-sm opacity-90">In Progress</p>
                  <p className="text-2xl font-bold">
                    {studyPlans.filter(p => p.status === 'in-progress').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FontAwesomeIcon icon={faBullseye} />
                </div>
                <div className="ml-4">
                  <p className="text-sm opacity-90">Available</p>
                  <p className="text-2xl font-bold">
                    {studyPlans.filter(p => p.status === 'not-started').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveTab(category.id)}
              >
                <FontAwesomeIcon icon={category.icon} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Study Plans List */}
          <div className="lg:col-span-2">
            <div className="flex justify-end mb-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                onClick={() => setShowCustomModal(true)}
              >
                + Create Custom Plan
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPlans.map(plan => (
                <div 
                  key={plan._id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedPlan?._id === plan._id 
                      ? 'border-blue-500 ring-2 ring-blue-500/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => handlePlanClick(plan)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                        <FontAwesomeIcon icon={categories.find(c => c.id === plan.category)?.icon || faBook} className={`text-xl`} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(plan.difficulty)}`}>
                          {plan.difficulty}
                        </span>
                        {plan.status === 'in-progress' && (
                          <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {plan.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <FontAwesomeIcon icon={faClock} />
                          <span>{plan.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FontAwesomeIcon icon={faBook} />
                          <span>{plan.topics.length} topics</span>
                        </div>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    {plan.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{plan.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                            style={{ width: `${plan.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                          plan.status === 'locked'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : plan.status === 'in-progress'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                        onClick={e => {
                          e.stopPropagation();
                          if (plan.status !== 'locked') {
                            handleStartPlan(plan._id);
                          }
                        }}
                        disabled={plan.status === 'locked'}
                      >
                        {plan.status === 'locked' ? (
                          <span className="flex items-center justify-center space-x-2">
                            <FontAwesomeIcon icon={faLock} />
                            <span>Locked</span>
                          </span>
                        ) : plan.status === 'in-progress' ? (
                          <span className="flex items-center justify-center space-x-2">
                            <FontAwesomeIcon icon={faPlay} />
                            <span>Continue</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center space-x-2">
                            <FontAwesomeIcon icon={faPlay} />
                            <span>Start Plan</span>
                          </span>
                        )}
                      </button>
                      {plan.youtubeUrl && (
                        <button
                          className="flex-1 py-2 px-4 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                          onClick={e => {
                            e.stopPropagation();
                            window.open(plan.youtubeUrl, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          <FontAwesomeIcon icon={faPlay} className="mr-2" />YouTube
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {userPlans.filter(up => up.isCustom).map(customPlan => (
                <div key={customPlan._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-blue-300 mb-4 p-4">
                  <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">{customPlan.custom.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{customPlan.custom.description}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{customPlan.custom.topics.length} topics</div>
                  <button className="text-blue-600 hover:underline" onClick={() => setSelectedPlan({ ...customPlan, ...customPlan.custom, topics: customPlan.custom.topics })}>View</button>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedPlan ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-8">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedPlan.title}
                    </h3>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <FontAwesomeIcon icon={faBookmark} />
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {selectedPlan.description}
                  </p>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(selectedPlan.difficulty)}`}>
                        {selectedPlan.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="text-gray-900 dark:text-white">{selectedPlan.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Topics:</span>
                      <span className="text-gray-900 dark:text-white">{selectedPlan.topics.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className="text-gray-900 dark:text-white capitalize">{selectedPlan.status.replace('-', ' ')}</span>
                    </div>
                  </div>
                  {showReminder && (
                    <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700 rounded-lg flex items-center justify-between">
                      <span className="text-yellow-800 dark:text-yellow-200 text-sm">
                        It’s been a while since your last progress! Jump back in to keep your streak alive.
                      </span>
                      <button onClick={() => setShowReminder(false)} className="ml-2 text-yellow-700 dark:text-yellow-300 hover:underline text-xs">Dismiss</button>
                    </div>
                  )}
                  <div className="flex gap-2 mb-4">
                    <button className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50" onClick={handleUndo} disabled={history.length === 0}>Undo</button>
                    <button className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50" onClick={handleRedo} disabled={redoStack.length === 0}>Redo</button>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Your Analytics</h4>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Current Streak:</span>
                        <span className="font-bold text-orange-500">{analytics.streak} day{analytics.streak === 1 ? '' : 's'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Completed Today:</span>
                        <span className="font-bold text-green-500">{analytics.completedToday}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Completed:</span>
                        <span className="font-bold text-blue-500">{analytics.totalCompleted}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Topics</h4>
                    <div className="space-y-2">
                      {selectedPlan.topics.map((topic, idx) => {
                        const userPlan = getUserPlan(selectedPlan._id);
                        const userTopic = userPlan?.topicsProgress.find(t => t.topicId === topic._id);
                        const status = userTopic?.status || 'not-started';
                        // Sequential unlocking logic
                        let isLocked = false;
                        if (idx > 0) {
                          const prevTopic = selectedPlan.topics[idx - 1];
                          const prevUserTopic = userPlan?.topicsProgress.find(t => t.topicId === prevTopic._id);
                          isLocked = !prevUserTopic || prevUserTopic.status !== 'completed';
                        }
                        return (
                          <div key={topic._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(isLocked ? 'locked' : status)}
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{topic.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{topic.duration}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleTopicStatusChange(selectedPlan._id, topic._id, 'completed')}
                                className={`text-green-500 hover:text-green-600 dark:hover:text-green-400 ${status === 'completed' ? 'font-bold' : ''}`}
                                title="Mark as completed"
                                disabled={status === 'completed' || isLocked}
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                              <button
                                onClick={() => handleTopicStatusChange(selectedPlan._id, topic._id, 'in-progress')}
                                className={`text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 ${status === 'in-progress' ? 'font-bold' : ''}`}
                                title="Mark as in-progress"
                                disabled={status === 'in-progress' || isLocked}
                              >
                                <FontAwesomeIcon icon={faPlay} />
                              </button>
                              <button
                                onClick={() => handleTopicStatusChange(selectedPlan._id, topic._id, 'not-started')}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                title="Undo"
                                disabled={status === 'not-started' || isLocked}
                              >
                                <FontAwesomeIcon icon={faArrowRight} rotation={180} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        selectedPlan.status === 'locked'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedPlan.status === 'in-progress'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                      onClick={() => handleStartPlan(selectedPlan._id)}
                      disabled={selectedPlan.status === 'locked'}
                    >
                      {selectedPlan.status === 'locked' ? (
                        <span className="flex items-center justify-center space-x-2">
                          <FontAwesomeIcon icon={faLock} />
                          <span>Plan Locked</span>
                        </span>
                      ) : selectedPlan.status === 'in-progress' ? (
                        <span className="flex items-center justify-center space-x-2">
                          <FontAwesomeIcon icon={faPlay} />
                          <span>Continue Learning</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <FontAwesomeIcon icon={faPlay} />
                          <span>Start Learning</span>
                        </span>
                      )}
                    </button>
                    {selectedPlan.youtubeUrl && (
                      <button
                        className="flex-1 py-3 px-4 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                        onClick={() => window.open(selectedPlan.youtubeUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <FontAwesomeIcon icon={faPlay} className="mr-2" />YouTube
                      </button>
                    )}
                  </div>
                  {selectedPlan && (
                    <button className="ml-2 text-blue-500 hover:underline text-xs" onClick={() => setShowShareModal(true)}>
                      Share
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <FontAwesomeIcon icon={faLightbulb} className="text-gray-400 text-4xl mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a Study Plan
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a study plan to see details and start learning.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2500} />
      {showConfetti && <Confetti key={confettiKey} recycle={false} numberOfPieces={400} />}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Create Custom Study Plan</h2>
            <form onSubmit={handleCreateCustomPlan}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={customTitle} onChange={e => setCustomTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full border rounded px-3 py-2" value={customDescription} onChange={e => setCustomDescription(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Topics</label>
                {customTopics.map((topic, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input type="text" placeholder="Topic title" className="flex-1 border rounded px-2 py-1" value={topic.title} onChange={e => handleCustomTopicChange(idx, 'title', e.target.value)} required />
                    <input type="text" placeholder="Duration" className="w-24 border rounded px-2 py-1" value={topic.duration} onChange={e => handleCustomTopicChange(idx, 'duration', e.target.value)} />
                    <button type="button" className="text-red-500" onClick={() => handleRemoveCustomTopic(idx)} disabled={customTopics.length === 1}>Remove</button>
                  </div>
                ))}
                <button type="button" className="text-blue-600 hover:underline mt-1" onClick={handleAddCustomTopic}>+ Add Topic</button>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowCustomModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-2">Share Plan</h3>
            <div className="mb-2">
              <label className="block text-sm mb-1">Invite by email (demo only):</label>
              <input type="email" className="w-full border rounded px-2 py-1" value={shareEmail} onChange={e => setShareEmail(e.target.value)} />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSharePlan}>Copy Share Link</button>
            {shareLink && <div className="mt-2 text-xs text-green-600">Link copied: {shareLink}</div>}
            <div className="flex justify-end mt-4">
              <button className="text-gray-500 hover:underline" onClick={() => setShowShareModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {showJoinGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-2">Join Group Plan</h3>
            <input type="text" className="w-full border rounded px-2 py-1 mb-2" placeholder="Enter Group ID" value={groupIdInput} onChange={e => setGroupIdInput(e.target.value)} />
            <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handleJoinGroup}>Join</button>
            <div className="flex justify-end mt-4">
              <button className="text-gray-500 hover:underline" onClick={() => setShowJoinGroupModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlan; 