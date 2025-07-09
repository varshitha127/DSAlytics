import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoon,
  faSun,
  faBell,
  faEnvelope,
  faCheckCircle,
  faExclamationCircle,
  faSpinner,
  faSave,
} from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    dailyReminder: false,
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings((prev) => ({ ...prev, theme: newTheme }));
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      setLoading(true);
      // Here you would typically make an API call to save the settings
      // await axios.put('/api/settings', settings);
      setMessage('Settings saved successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Settings
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              <p>Manage your account settings and preferences.</p>
            </div>

            <form className="mt-5 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-5 w-5 text-red-400"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        {error}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {message && (
                <div className="rounded-md bg-green-50 dark:bg-green-900/50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="h-5 w-5 text-green-400"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                        {message}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Theme Settings */}
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  Theme
                </h4>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FontAwesomeIcon
                      icon={settings.theme === 'light' ? faMoon : faSun}
                      className="mr-2 h-4 w-4"
                    />
                    Switch to {settings.theme === 'light' ? 'dark' : 'light'} mode
                  </button>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  Notifications
                </h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="emailNotifications"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        Email notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive email notifications about your account activity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="pushNotifications"
                        name="pushNotifications"
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="pushNotifications"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        Push notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive push notifications in your browser.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="weeklyReport"
                        name="weeklyReport"
                        type="checkbox"
                        checked={settings.weeklyReport}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="weeklyReport"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        Weekly progress report
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive a weekly email with your progress summary.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="dailyReminder"
                        name="dailyReminder"
                        type="checkbox"
                        checked={settings.dailyReminder}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="dailyReminder"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        Daily practice reminder
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive a daily reminder to practice coding problems.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faSave}
                        className="-ml-1 mr-2 h-4 w-4"
                      />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 