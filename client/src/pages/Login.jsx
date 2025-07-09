import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCode, 
  faEnvelope, 
  faLock, 
  faSignInAlt, 
  faExclamationCircle, 
  faCheckCircle,
  faEye,
  faEyeSlash,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { VALIDATION_RULES, validateField } from '../utils/validation';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  // Remove validationRules and isFormValid

  // Handle field changes with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle field blur for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Check if form is valid
  // Remove isFormValid function

  // Check if account is locked out
  const isLockedOut = () => {
    if (!lockoutTime) return false;
    const now = new Date().getTime();
    const lockoutDuration = 5 * 60 * 1000; // 5 minutes
    return (now - lockoutTime) < lockoutDuration;
  };

  // Get remaining lockout time
  const getRemainingLockoutTime = () => {
    if (!lockoutTime) return 0;
    const now = new Date().getTime();
    const lockoutDuration = 5 * 60 * 1000; // 5 minutes
    const remaining = Math.max(0, lockoutDuration - (now - lockoutTime));
    return Math.ceil(remaining / 1000); // Return seconds
  };

  // Handle login attempts
  const handleLoginAttempt = (success) => {
    if (success) {
      setLoginAttempts(0);
      setLockoutTime(null);
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setLockoutTime(new Date().getTime());
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLockedOut()) return;
    if (!formData.email || !formData.password) {
      setErrors({ submit: 'Please enter email and password' });
      setShowAlert(true);
      return;
    }
    try {
      setErrors({});
      setSuccess('');
      setShowAlert(true);
      setLoading(true);
      await login(formData.email, formData.password);
      setSuccess('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        setShowAlert(false);
        navigate('/dashboard', { replace: true });
      }, 2000);
    } catch (err) {
      let msg = 'Login failed';
      if (err.response?.data?.message) msg = err.response.data.message;
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        msg = err.response.data.errors.map(error => error.msg).join(', ');
      }
      setErrors({ submit: msg });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  // Update lockout timer
  useEffect(() => {
    if (isLockedOut()) {
      const timer = setInterval(() => {
        if (!isLockedOut()) {
          setLockoutTime(null);
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        <div>
          <div className="flex justify-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
              <FontAwesomeIcon icon={faCode} className="text-blue-500 text-5xl" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Ready to continue your DSA journey?{' '}
            <Link
              to="/register"
              className="font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Alert */}
          {errors.submit && showAlert && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/50 p-4 border border-red-200 dark:border-red-800 flex justify-between items-center">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 text-red-400 mr-2" />
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{errors.submit}</h3>
              </div>
              <button onClick={() => setShowAlert(false)} className="ml-4 text-red-500 hover:text-red-700">&times;</button>
            </div>
          )}
          {/* Success Alert */}
          {success && showAlert && (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/50 p-4 border border-green-200 dark:border-green-800 flex justify-between items-center">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-400 mr-2" />
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">{success}</h3>
              </div>
              <button onClick={() => setShowAlert(false)} className="ml-4 text-green-500 hover:text-green-700">&times;</button>
            </div>
          )}

          {/* Login Attempts Warning */}
          {loginAttempts >= 3 && loginAttempts < 5 && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/50 p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Warning: {5 - loginAttempts} login attempts remaining before temporary lockout
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLockedOut()}
                  className={`appearance-none block w-full px-3 py-2.5 pl-10 border rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition duration-150 ease-in-out bg-white dark:bg-gray-700 ${
                    touched.email && errors.email 
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  } ${isLockedOut() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLockedOut()}
                  className={`appearance-none block w-full px-3 py-2.5 pl-10 pr-10 border rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition duration-150 ease-in-out bg-white dark:bg-gray-700 ${
                    touched.password && errors.password 
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  } ${isLockedOut() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLockedOut()}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  />
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                disabled={isLockedOut()}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 transition duration-150 ease-in-out"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || isLockedOut()}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-200"
                />
              </span>
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : isLockedOut() ? (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faLock} className="mr-2" />
                  Account Locked ({Math.floor(getRemainingLockoutTime() / 60)}:{(getRemainingLockoutTime() % 60).toString().padStart(2, '0')})
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Helpful Tips */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start">
              <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-blue-500 mt-0.5 mr-2" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Login Tips:</p>
                <ul className="space-y-1">
                  <li>• Make sure your email is spelled correctly</li>
                  <li>• Check that Caps Lock is off</li>
                  <li>• If you forgot your password, use the "Forgot password?" link</li>
                  <li>• After 5 failed attempts, your account will be temporarily locked</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 