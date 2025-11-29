import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LockClosedIcon, 
  EnvelopeIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentLoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Check for registration success message
  useEffect(() => {
    if (location.state?.registered) {
      toast.success('Registration successful! Please log in.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      window.history.replaceState({}, document.title);
    }
    
    if (authError) {
      clearError();
    }
  }, [location.state, authError, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setLoginSuccess(false);
    
    try {
      const result = await login(formData.email, formData.password, 'student');
      
      if (result?.success) {
        setLoginSuccess(true);
        toast.success('Login successful! Redirecting...', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast.error(result?.error || 'Login failed. Please check your credentials.', {
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
            Quiz Proctor
          </h1>
          <p className="mt-2 text-gray-600 flex items-center justify-center">
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            Student Portal
          </p>
        </motion.div>

        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
          variants={itemVariants}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div className="space-y-5" variants={itemVariants}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Student Email
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
                    placeholder="student@example.com"
                    disabled={isSubmitting || loginSuccess}
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
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="text-sm">
                    <Link 
                      to="/forgot-password" 
                      className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
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
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2.5 border ${
                      errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:text-sm transition duration-200`}
                    placeholder="••••••••"
                    disabled={isSubmitting || loginSuccess}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting || loginSuccess}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors duration-200" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors duration-200" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center justify-between"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                  disabled={isSubmitting || loginSuccess}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-500">New student? </span>
                <Link 
                  to="/register/student" 
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Create an account
                </Link>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isSubmitting || loginSuccess}
                className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  loginSuccess 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                  (isSubmitting || loginSuccess) ? 'opacity-80 cursor-not-allowed' : 'hover:-translate-y-0.5'
                }`}
                whileHover={!isSubmitting && !loginSuccess ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting && !loginSuccess ? { scale: 0.99 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : loginSuccess ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2 text-white" />
                    Success! Redirecting...
                  </>
                ) : (
                  'Sign in to Student Portal'
                )}
              </button>
            </motion.div>
          </form>
          
          <motion.div 
            className="mt-6 pt-6 border-t border-gray-200"
            variants={itemVariants}
          >
            <p className="text-sm text-center text-gray-600">
              Are you an administrator?{' '}
              <Link 
                to="/login/admin" 
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Admin Login
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
};

export default StudentLoginPage;
