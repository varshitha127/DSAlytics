import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLock } from 'react-icons/fa';
import PropTypes from 'prop-types';

const statusLabels = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

function formatDate(date) {
  if (!date) return '-';
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const TopicRow = ({ topic, idx, planTopics, userPlan, updating, onStatusChange, onResetClick }) => {
  const userTopic = userPlan?.topicsProgress.find(t => t.topicId === topic._id || t.topicId === topic.id || t.topicId === topic.title);
  const status = userTopic?.status || 'not-started';
  // Sequential unlocking logic
  let isLocked = false;
  if (idx > 0) {
    const prevTopic = planTopics[idx - 1];
    const prevUserTopic = userPlan?.topicsProgress.find(t => t.topicId === prevTopic._id || t.topicId === prevTopic.id || t.topicId === prevTopic.title);
    isLocked = !prevUserTopic || prevUserTopic.status !== 'completed';
  }
  // Topic completion date
  const completedAt = userTopic?.completedAt ? formatDate(new Date(userTopic.completedAt)) : null;
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg" tabIndex={0} aria-label={`Topic: ${topic.title}`}> 
      <div>
        <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          {isLocked && <FaLock className="text-gray-400" title="Complete the previous topic to unlock" aria-label="Locked" />}
          {topic.title}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{topic.duration}</div>
        <div className="text-xs mt-1">Status: <span className="font-semibold">{statusLabels[status] || status}</span></div>
        {completedAt && (
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">Completed: {completedAt}</div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className={`px-2 py-1 rounded text-white bg-blue-500 hover:bg-blue-600 text-xs ${status === 'in-progress' || isLocked ? 'opacity-60' : ''}`}
          disabled={status === 'in-progress' || updating || isLocked}
          onClick={() => onStatusChange(topic._id, 'in-progress')}
          aria-label={`Start ${topic.title}`}
        >
          Start
        </button>
        <button
          className={`px-2 py-1 rounded text-white bg-green-500 hover:bg-green-600 text-xs ${status === 'completed' || isLocked ? 'opacity-60' : ''}`}
          disabled={status === 'completed' || updating || isLocked}
          onClick={() => onStatusChange(topic._id, 'completed')}
          aria-label={`Complete ${topic.title}`}
        >
          Complete
        </button>
        <button
          className={`px-2 py-1 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 text-xs ${status === 'not-started' || isLocked ? 'opacity-60' : ''}`}
          disabled={status === 'not-started' || updating || isLocked}
          onClick={() => onResetClick(topic._id, status)}
          aria-label={`Reset ${topic.title}`}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

TopicRow.propTypes = {
  topic: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  planTopics: PropTypes.array.isRequired,
  userPlan: PropTypes.object.isRequired,
  updating: PropTypes.bool.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onResetClick: PropTypes.func.isRequired,
};

const StudyPlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [confirmReset, setConfirmReset] = useState({ show: false, topicId: null });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [planRes, userPlanRes] = await Promise.all([
          axios.get(`/api/study-plans/${id}`),
          axios.get(`/api/user-study-plans/${id}`)
        ]);
        setPlan(planRes.data);
        setUserPlan(userPlanRes.data);
        setError(null);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          toast.error('Session expired. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Failed to load study plan');
        }
        setPlan(null);
        setUserPlan(null);
      }
      setLoading(false);
    }
    fetchData();
  }, [id, navigate]);

  const handleStatusChange = async (topicId, status) => {
    if (!userPlan) return;
    setUpdating(true);
    try {
      await axios.patch(`/api/user-study-plans/${id}/topics/${topicId}`, { status });
      // Refresh user plan
      const userPlanRes = await axios.get(`/api/user-study-plans/${id}`);
      setUserPlan(userPlanRes.data);
      toast.success('Status updated!');
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        toast.error('Session expired. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error('Failed to update topic status');
      }
    }
    setUpdating(false);
  };

  const handleResetClick = (topicId, status) => {
    if (status === 'completed') {
      setConfirmReset({ show: true, topicId });
    } else {
      handleStatusChange(topicId, 'not-started');
    }
  };

  const handleConfirmReset = () => {
    handleStatusChange(confirmReset.topicId, 'not-started');
    setConfirmReset({ show: false, topicId: null });
  };

  const handleCancelReset = () => {
    setConfirmReset({ show: false, topicId: null });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  if (!plan) {
    return <div className="min-h-screen flex items-center justify-center">No plan found.</div>;
  }

  // Progress calculation
  const completed = userPlan?.topicsProgress.filter(t => t.status === 'completed').length || 0;
  const total = plan.topics.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  // Analytics/history helpers
  const streak = userPlan?.streak || 0; // If backend provides streak
  const startedAt = userPlan?.startedAt ? new Date(userPlan.startedAt) : null;
  const completedAt = userPlan?.completedAt ? new Date(userPlan.completedAt) : null;
  const lastActivityAt = userPlan?.lastActivityAt ? new Date(userPlan.lastActivityAt) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
      {updating && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-gray-700 dark:text-gray-200">Updating...</div>
          </div>
        </div>
      )}
      {confirmReset.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Reset Topic Progress?</div>
            <div className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to reset this topic? This will mark it as not started.</div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleConfirmReset} aria-label="Confirm reset topic">Yes, Reset</button>
              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded" onClick={handleCancelReset} aria-label="Cancel reset topic">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{plan.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{plan.description}</p>
        {/* Analytics/History */}
        <div className="mb-4 flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-300">
          <div><span className="font-semibold">Started:</span> {formatDate(startedAt)}</div>
          <div><span className="font-semibold">Completed:</span> {formatDate(completedAt)}</div>
          <div><span className="font-semibold">Last Activity:</span> {formatDate(lastActivityAt)}</div>
          <div><span className="font-semibold">Streak:</span> {streak} day{streak === 1 ? '' : 's'}</div>
        </div>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percent}%` }}></div>
          </div>
          <div className="text-sm text-gray-600">{percent}% completed</div>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Topics</h2>
        <div className="space-y-3">
          {plan.topics && plan.topics.length > 0 ? (
            plan.topics.map((topic, idx) => (
              <TopicRow
                key={topic._id || topic.id || topic.title}
                topic={topic}
                idx={idx}
                planTopics={plan.topics}
                userPlan={userPlan}
                updating={updating}
                onStatusChange={handleStatusChange}
                onResetClick={handleResetClick}
              />
            ))
          ) : (
            <div className="text-gray-500">No topics found for this plan.</div>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
};

export default StudyPlanDetails; 