import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LockClosedIcon, 
  EnvelopeIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
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
  
  // Get role from URL or default to 'student'
  const role = location.pathname.includes('admin') ? 'admin' : 'student';
  
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
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
    
    // Clear any previous errors
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
    
    // Clear error for the field being edited
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
      const result = await login(formData.email, formData.password);
      
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
        
        // Small delay to show success message before redirect
        setTimeout(() => {
          navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
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
          <p className="mt-2 text-gray-600">
            {role === 'admin' ? 'Administrator Portal' : 'Student Portal'}
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
              className="flex items-center justify-between mt-4"
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
              
              {role === 'student' && (
                <div className="text-sm">
                  <span className="text-gray-500">New here? </span>
                  <Link 
                    to="/register/student" 
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                  >
                    Create an account
                  </Link>
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
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
                  'Sign in to your account'
                )}
              </motion.button>
            </motion.div>
          </form>
          
          {role === 'admin' && (
            <motion.div 
              className="mt-6 pt-6 border-t border-gray-200"
              variants={itemVariants}
            >
              <p className="text-sm text-center text-gray-600">
                Need an admin account?{' '}
                <Link 
                  to="/register/admin" 
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Request access
                </Link>
              </p>
            </motion.div>
          )}
          
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

export default LoginPage;
