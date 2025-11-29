import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserGroupIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, error: authError, clearError } = useAuth();
  
  // Get role from URL or default to 'student'
  const role = location.pathname.includes('admin') ? 'admin' : 'student';
  const isAdmin = role === 'admin';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: role,
    adminCode: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '' });
  
  // Clear any previous errors on mount
  useEffect(() => {
    if (authError) {
      clearError();
    }
  }, [authError, clearError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Check password strength when password changes
    if (name === 'password') {
      checkPasswordStrength(newValue);
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (!password) {
      setPasswordStrength({ score: 0, label: '' });
      return;
    }
    
    // Length check
    if (password.length >= 8) score += 1;
    // Contains number
    if (/\d/.test(password)) score += 1;
    // Contains special char
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    // Contains upper and lower case
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    setPasswordStrength({
      score,
      label: score > 0 ? labels[score - 1] : ''
    });
  };
  
  const getPasswordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 2) {
      newErrors.password = 'Please choose a stronger password';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { confirmPassword, agreeTerms, ...registerData } = formData;
      if (!isAdmin) delete registerData.adminCode;
      const result = await register(registerData);
      
      if (result?.success) {
        toast.success('Registration successful! Redirecting...', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // The AuthContext will handle the navigation after successful registration
      } else {
        toast.error(result?.error || 'Registration failed. Please try again.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div 
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="mt-2 text-gray-600">
            Join us to get started with {role === 'admin' ? 'admin' : 'student'} access
          </p>
        </motion.div>

        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
          variants={itemVariants}
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <motion.div className="space-y-5" variants={itemVariants}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircleIcon 
                      className={`h-5 w-5 ${errors.name ? 'text-red-500' : 'text-gray-400'}`} 
                    />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:text-sm transition duration-200`}
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon 
                      className={`h-5 w-5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`} 
                    />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:text-sm transition duration-200`}
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon 
                      className={`h-5 w-5 ${errors.password ? 'text-red-500' : 'text-gray-400'}`} 
                    />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2.5 border ${
                      errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:text-sm transition duration-200`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors duration-200" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors duration-200" />
                    )}
                  </button>
                </div>
                
                <div className="mt-1">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Password Strength: 
                      {formData.password ? (
                        <span className={`font-medium ${
                          passwordStrength.score < 2 ? 'text-red-500' : 
                          passwordStrength.score < 3 ? 'text-yellow-500' : 
                          'text-green-500'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      ) : 'Not set'}
                    </span>
                    {passwordStrength.score > 0 && (
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div 
                            key={i} 
                            className={`h-1 w-3 rounded-full ${
                              i <= passwordStrength.score ? getPasswordStrengthColor() : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1 mt-2">
                    <p className={`flex items-center ${formData.password?.length >= 8 ? 'text-green-500' : ''}`}>
                      {formData.password?.length >= 8 ? (
                        <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <span className="inline-block w-3.5 h-3.5 mr-1">•</span>
                      )}
                      At least 8 characters
                    </p>
                    <p className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-500' : ''}`}>
                      {/\d/.test(formData.password) ? (
                        <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <span className="inline-block w-3.5 h-3.5 mr-1">•</span>
                      )}
                      At least one number
                    </p>
                    <p className={`flex items-center ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-green-500' : ''}`}>
                      {/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? (
                        <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <span className="inline-block w-3.5 h-3.5 mr-1">•</span>
                      )}
                      Uppercase & lowercase letters
                    </p>
                  </div>
                </div>
                
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon 
                      className={`h-5 w-5 ${errors.confirmPassword ? 'text-red-500' : 'text-gray-400'}`} 
                    />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:text-sm transition duration-200`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start"
              variants={itemVariants}
            >
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className={`focus:ring-indigo-500 h-4 w-4 ${
                    errors.agreeTerms ? 'text-red-600 border-red-300' : 'text-indigo-600 border-gray-300'
                  } rounded`}
                  disabled={isSubmitting}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                    Privacy Policy
                  </a>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.agreeTerms}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  isSubmitting 
                    ? 'bg-indigo-400' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                  isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:-translate-y-0.5'
                }`}
                whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.99 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </motion.div>
          </form>
          {isAdmin && (
            <motion.div className="mt-3" variants={itemVariants}>
              <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Access Code
              </label>
              <input
                id="adminCode"
                name="adminCode"
                type="text"
                value={formData.adminCode}
                onChange={handleChange}
                className={`block w-full px-3 py-2.5 border ${
                  errors.adminCode ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:text-sm transition duration-200`}
                placeholder="Enter admin code"
                disabled={isSubmitting}
              />
              {errors.adminCode && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {errors.adminCode}
                </p>
              )}
            </motion.div>
          )}
          
          <motion.div 
            className="mt-6 pt-6 border-t border-gray-200"
            variants={itemVariants}
          >
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link 
                to={`/login/${role}`} 
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
          
          <motion.div 
            className="mt-8 text-center text-sm text-gray-500"
            variants={itemVariants}
          >
            <p>© {new Date().getFullYear()} Quiz Proctor. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Add missing icons
const EyeIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeSlashIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

export default RegisterPage;
