import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faEnvelope, faInfoCircle, faRocket } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { path: '/', label: 'Home', icon: faCode },
    { path: '/problems', label: 'Problems', icon: faRocket },
    { path: '/about', label: 'About', icon: faInfoCircle },
    { path: '/contact', label: 'Contact', icon: faEnvelope },
  ];

  const socialLinks = [
    { url: 'https://www.linkedin.com/in/varshithareddy-lakkireddy-1b1326290', icon: faLinkedin, label: 'LinkedIn' },
    { url: 'https://github.com/varshitha127', icon: faGithub, label: 'GitHub' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faCode} className="text-blue-500 text-2xl" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">DSA Tracker</span>
            </Link>
            <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
              Track your DSA progress, solve problems, and improve your coding skills with our comprehensive platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <FontAwesomeIcon icon={link.icon} className="mr-2 h-4 w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Connect With Us
            </h3>
            <ul className="mt-4 space-y-4">
              {socialLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <FontAwesomeIcon icon={link.icon} className="mr-2 h-4 w-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-base text-gray-400 text-center">
            &copy; {currentYear} DSA Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 