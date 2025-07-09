import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCode, 
  faUser, 
  faEnvelope, 
  faLock, 
  faUserPlus, 
  faExclamationCircle, 
  faCheckCircle,
  faEye,
  faEyeSlash,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [showAlert, setShowAlert] = useState(true);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Check if form is valid
  const isFormValid = () => {
    const allFieldsFilled = Object.keys(formData).every(field => 
      formData[field].trim() !== ''
    );

    return allFieldsFilled;
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    let feedback = [];

    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (password.length < 6) feedback.push('At least 6 characters');
    if (!/[a-z]/.test(password)) feedback.push('One lowercase letter');
    if (!/[A-Z]/.test(password)) feedback.push('One uppercase letter');
    if (!/\d/.test(password)) feedback.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) feedback.push('One special character');

    const strengthMap = {
      0: { label: 'Very Weak', color: 'red' },
      1: { label: 'Weak', color: 'orange' },
      2: { label: 'Fair', color: 'yellow' },
      3: { label: 'Good', color: 'blue' },
      4: { label: 'Strong', color: 'green' },
      5: { label: 'Very Strong', color: 'emerald' },
      6: { label: 'Excellent', color: 'emerald' }
    };

    return {
      score: Math.min(score, 6),
      label: strengthMap[Math.min(score, 6)].label,
      color: strengthMap[Math.min(score, 6)].color,
      feedback
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrors({ submit: 'Please fill all fields' });
      setShowAlert(true);
      return;
    }
    try {
      setErrors({});
      setSuccess('');
      setShowAlert(true);
      setLoading(true);
      await register(formData);
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        setShowAlert(false);
        navigate('/dashboard', { replace: true });
      }, 2000);
    } catch (err) {
      let msg = 'Registration failed';
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

  const passwordStrength = getPasswordStrength(formData.password);

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
            Join DSAlytics
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Start your DSA learning journey today{' '}
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Sign in to your account
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

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2.5 pl-10 border rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition duration-150 ease-in-out bg-white dark:bg-gray-700 ${
                    touched.name && errors.name 
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

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
                  className={`appearance-none block w-full px-3 py-2.5 pl-10 border rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition duration-150 ease-in-out bg-white dark:bg-gray-700 ${
                    touched.email && errors.email 
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2.5 pl-10 pr-10 border rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition duration-150 ease-in-out bg-white dark:bg-gray-700 ${
                    touched.password && errors.password 
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  />
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Password strength:</span>
                    <span className={`text-xs font-medium text-${passwordStrength.color}-600 dark:text-${passwordStrength.color}-400`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.color === 'red' ? 'bg-red-500' :
                        passwordStrength.color === 'orange' ? 'bg-orange-500' :
                        passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                        passwordStrength.color === 'blue' ? 'bg-blue-500' :
                        passwordStrength.color === 'green' ? 'bg-green-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Password Requirements */}
                  {passwordStrength.feedback.length > 0 && (
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                      <div className="flex items-center mb-1">
                        <FontAwesomeIcon icon={faInfoCircle} className="w-3 h-3 mr-1 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">Requirements:</span>
                      </div>
                      <ul className="space-y-1">
                        {passwordStrength.feedback.map((req, index) => (
                          <li key={index} className="text-gray-500 dark:text-gray-400 flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2.5 pl-10 pr-10 border rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition duration-150 ease-in-out bg-white dark:bg-gray-700 ${
                    touched.confirmPassword && errors.confirmPassword 
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-green-300 dark:border-green-600 focus:ring-green-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                    className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  />
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                <p className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 mr-1" />
                  Passwords match
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-200"
                />
              </span>
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register; 