import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <FontAwesomeIcon icon={faCode} className="text-blue-500 text-6xl" />
        </div>
        <h1 className="mt-6 text-9xl font-extrabold text-gray-900 dark:text-white">404</h1>
        <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          Page not found
        </h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8 space-y-4">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Go back home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 