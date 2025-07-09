import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCompass,
  faCode,
  faClipboardList,
  faRobot,
  faBell,
  faUser,
  faFire
} from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.svg';

const DashboardNav = () => {
  // TODO: Replace with actual user streak data from API
  const [hasStreak, setHasStreak] = useState(false);

  // Updated styles for smaller, more refined icons
  const iconStyle = "w-4 h-4 border-[5px] border-gray-200 dark:border-gray-600 rounded-full p-0.5";
  const iconContainerStyle = "text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition duration-300";

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <img src={logo} alt="DSAlytic Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">DSAlytic</span>
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard/explore" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition duration-300">
              <FontAwesomeIcon icon={faCompass} className="w-5 h-5" />
              <span>Explore</span>
            </Link>
            <Link to="/dashboard/problems" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition duration-300">
              <FontAwesomeIcon icon={faCode} className="w-5 h-5" />
              <span>Problems</span>
            </Link>
            <Link to="/dashboard/mocktest" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition duration-300">
              <FontAwesomeIcon icon={faClipboardList} className="w-5 h-5" />
              <span>Mock Test</span>
            </Link>
            <Link to="/dashboard/ai-interview" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition duration-300">
              <FontAwesomeIcon icon={faRobot} className="w-5 h-5" />
              <span>AI Interview</span>
            </Link>
          </div>

          {/* User Interface Elements */}
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <button className={iconContainerStyle}>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faBell} 
                  className={iconStyle}
                  style={{ backgroundColor: 'transparent' }}
                />
              </div>
            </button>

            {/* Streak Icon (Fire) */}
            <button className={iconContainerStyle}>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faFire} 
                  className={iconStyle}
                  style={{ 
                    backgroundColor: 'transparent',
                    color: hasStreak ? '#F97316' : 'currentColor'
                  }}
                />
              </div>
            </button>

            {/* Profile Icon */}
            <button className={`${iconContainerStyle} flex items-center space-x-2`}>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faUser} 
                  className={iconStyle}
                  style={{ backgroundColor: 'transparent' }}
                />
              </div>
              <span className="hidden md:inline text-sm">Profile</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu - To be implemented if needed */}
      </div>
    </nav>
  );
};

export default DashboardNav; 