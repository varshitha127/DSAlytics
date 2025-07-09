import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser,
  faEnvelope,
  faCalendar,
  faEdit,
  faSave,
  faTimes,
  faTrophy,
  faChartLine,
  faBook,
  faBullseye,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Update form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || 'No bio available'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      // Here you would typically make an API call to update the user profile
      // await updateProfile(formData);
      console.log('Profile updated:', formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || 'No bio available'
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show message if not authenticated (though this should be handled by redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  // Show message if no user data
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Unable to load user data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-blue-600 dark:text-blue-400 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user.name || 'User'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.email || 'No email available'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isUpdating}
                    className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={isEditing ? faTimes : faEdit} />
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.bio}</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        ) : (
                          <FontAwesomeIcon icon={faSave} />
                        )}
                        <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isUpdating}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Statistics
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faTrophy} className="text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-700 dark:text-gray-300">Problems Solved</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {user.problemsSolved || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faChartLine} className="text-green-600 dark:text-green-400" />
                      <span className="text-gray-700 dark:text-gray-300">Success Rate</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {user.successRate || 0}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faBook} className="text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-700 dark:text-gray-300">Study Plans</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {user.studyPlans || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faBullseye} className="text-orange-600 dark:text-orange-400" />
                      <span className="text-gray-700 dark:text-gray-300">Current Streak</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {user.currentStreak || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 