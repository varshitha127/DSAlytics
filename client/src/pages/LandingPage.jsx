import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import FloatingChatbot from '../components/FloatingChatbot';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap,
  faUsers, 
  faCode, 
  faChartLine, 
  faClock,
  faArrowRight,
  faEnvelope,
  faShieldAlt,
  faFileContract,
  faRobot,
  faBrain,
  faLightbulb,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import { 
  faLinkedin, 
  faGithub 
} from '@fortawesome/free-brands-svg-icons';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    setIsVisible(true);
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const scrollToSection = (sectionId) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error scrolling to section:', error);
    }
  };

  const handleNavLinkClick = (sectionId) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToSection(sectionId);
    }
  };

  const fadeInUp = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.6s ease-out'
  };

  try {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
        <Navbar />

        {/* Hero Section */}
        <section id="home" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center justify-center text-center md:text-left relative z-10">
            <div className="w-full md:w-1/2 lg:w-2/5 mb-12 md:mb-0 md:mr-12" style={fadeInUp}>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="relative flex items-center justify-center space-x-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25"></div>
                  <FontAwesomeIcon icon={faGraduationCap} className="relative text-7xl text-blue-600 dark:text-blue-400" />
                  <div className="relative">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      DSAlytics
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">AI-Powered Learning</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-3/5" style={{...fadeInUp, transitionDelay: '0.2s'}}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight">
                Master DSA with
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DSAlytics
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
                Your AI-powered companion for mastering Data Structures and Algorithms. Get personalized guidance, track progress, and excel in your coding journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  to="/login" 
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="explore" className="py-24 bg-white dark:bg-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20" style={{...fadeInUp, transitionDelay: '0.4s'}}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
                Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DSAlytics</span>?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Experience the future of DSA learning with our cutting-edge AI technology
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: faBrain,
                  title: "AI-Powered Learning",
                  description: "Get personalized problem recommendations and instant feedback with our advanced AI system.",
                  color: "blue"
                },
                {
                  icon: faChartLine,
                  title: "Smart Progress Tracking",
                  description: "Track your progress with AI-driven analytics and identify areas for improvement.",
                  color: "green"
                },
                {
                  icon: faUsers,
                  title: "Community Learning",
                  description: "Join a community of learners, share solutions, and learn from others' approaches.",
                  color: "purple"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="group bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  style={{...fadeInUp, transitionDelay: `${0.6 + index * 0.2}s`}}
                >
                  <div className={`w-16 h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <FontAwesomeIcon icon={feature.icon} className={`text-2xl text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center" style={{...fadeInUp, transitionDelay: '1.2s'}}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-8">
                About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DSAlytics</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-16 leading-relaxed">
                DSAlytics is your AI-powered platform for mastering Data Structures and Algorithms. We combine cutting-edge AI technology with comprehensive learning resources to provide a personalized and effective learning experience.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: faUsers, value: "5K+", label: "Active Users" },
                  { icon: faCode, value: "300+", label: "Problems" },
                  { icon: faChartLine, value: "90%", label: "Success Rate" },
                  { icon: faRobot, value: "24/7", label: "AI Support" }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{...fadeInUp, transitionDelay: `${1.4 + index * 0.2}s`}}
                  >
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      <FontAwesomeIcon icon={stat.icon} className="w-8 h-8 mx-auto mb-2" />
                      {stat.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-gray-900 py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start mb-12">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25"></div>
                    <FontAwesomeIcon icon={faGraduationCap} className="relative text-3xl text-blue-500 mr-3" />
                  </div>
                  <span className="text-2xl font-bold text-white">DSAlytics</span>
                </div>
                <p className="text-gray-400 mt-4 max-w-md">
                  Your AI-powered DSA learning companion. Join thousands of developers mastering DSA with our intelligent platform.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
                  <ul className="space-y-4">
                    {[
                      { to: "/", label: "Home", icon: faArrowRight },
                      { to: "/#explore", label: "Features", icon: faArrowRight, onClick: () => handleNavLinkClick('explore') },
                      { to: "/#about", label: "About", icon: faArrowRight, onClick: () => handleNavLinkClick('about') }
                    ].map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.to}
                          onClick={link.onClick}
                          className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition duration-300 group"
                        >
                          <FontAwesomeIcon icon={link.icon} className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                          <span>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-6">Connect</h3>
                  <ul className="space-y-4">
                    {[
                      { href: "https://www.linkedin.com/in/varshithareddy-lakkireddy-1b1326290", label: "LinkedIn", icon: faLinkedin },
                      { href: "https://github.com/varshitha127", label: "GitHub", icon: faGithub },
                      { href: "mailto:lakkireddyvarshithareddy@gmail.com", label: "Email", icon: faEnvelope }
                    ].map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition duration-300 group"
                        >
                          <FontAwesomeIcon icon={link.icon} className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                          <span>{link.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>
                  <ul className="space-y-4">
                    {[
                      { to: "/privacy", label: "Privacy Policy", icon: faShieldAlt },
                      { to: "/terms", label: "Terms of Service", icon: faFileContract }
                    ].map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.to}
                          className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition duration-300 group"
                        >
                          <FontAwesomeIcon icon={link.icon} className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                          <span>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400">&copy; 2024 DSAlytics. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Floating Chatbot */}
        <FloatingChatbot />
      </div>
    );
  } catch (error) {
    console.error('Error rendering LandingPage:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <FontAwesomeIcon icon={faRocket} className="text-4xl text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-400">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }
};

export default LandingPage; 