import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faSearch, faFilter, faCheck, faLock, faCircle, faList, faBook, faCode,
  faDatabase, faNetworkWired, faLaptopCode, faGlobe,
  faObjectGroup, faCompass, faClipboardList, faRobot, faBell, faUser,
  faFire, faHome, faRocket, faInfoCircle, faEnvelope, faBars, faTimes,
  faSignInAlt, faUserPlus, faArrowRight, faShieldAlt, faFileContract,
  faUsers, faChartLine, faClock, faPlay, faCalendarAlt, faBullseye,
  faTrophy, faLightbulb, faStar, faBookmark
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProblemsList from './pages/ProblemsList';
import ProblemDetails from './pages/ProblemDetails';
import StudyPlan from './pages/StudyPlan';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './index.css'; // Assuming you have an index.css for global styles
import { AuthProvider, useAuth } from './contexts/AuthContext';
import FloatingChatbot from './components/FloatingChatbot';
import StudyPlanDetails from './pages/StudyPlanDetails';

// Add all icons to the library
library.add(
  faSearch, faFilter, faCheck, faLock, faCircle, faList, faBook, faCode,
  faDatabase, faNetworkWired, faLaptopCode, faGlobe,
  faObjectGroup, faCompass, faClipboardList, faRobot, faBell, faUser,
  faFire, faHome, faRocket, faInfoCircle, faEnvelope, faBars, faTimes,
  faSignInAlt, faUserPlus, faArrowRight, faShieldAlt, faFileContract,
  faUsers, faChartLine, faClock, faPlay, faCalendarAlt, faBullseye,
  faTrophy, faLightbulb, faStar, faBookmark, faLinkedin, faGithub
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public route with login prompt
const PublicRouteWithLoginPrompt = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sign In Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please sign in to access the problems and track your progress.
            </p>
            <div className="space-y-3">
              <a
                href="/login"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 block"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200 block"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return children;
};

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/problems",
    element: (
      <PublicRouteWithLoginPrompt>
        <ProblemsList />
      </PublicRouteWithLoginPrompt>
    ),
  },
  {
    path: "/problems/:id",
    element: (
      <PublicRouteWithLoginPrompt>
        <ProblemDetails />
      </PublicRouteWithLoginPrompt>
    ),
  },
  {
    path: "/study-plan",
    element: (
      <ProtectedRoute>
        <StudyPlan />
      </ProtectedRoute>
    ),
  },
  {
    path: "/study-plan/:id",
    element: (
      <ProtectedRoute>
        <StudyPlanDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

// Add error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700">{this.state.error?.toString()}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Add logging to help debug
console.log('Starting application render...');

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  console.log('Root element found:', document.getElementById('root'));

  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <>
            <RouterProvider router={router} />
            <FloatingChatbot />
          </>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('Application rendered successfully');
} catch (error) {
  console.error('Error during render:', error);
} 