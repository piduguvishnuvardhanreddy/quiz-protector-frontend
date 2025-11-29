import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  ShieldCheckIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminRegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, error: authError, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (authError) {
      toast.error(authError, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      clearError();
    }
  }, [authError, clearError]);

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
    
    // Check password strength
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.adminCode) {
      newErrors.adminCode = 'Admin code is required';
    } else if (formData.adminCode !== 'ADMIN123') { // In production, use a more secure method
      newErrors.adminCode = 'Invalid admin code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'admin'
      });
      
      if (result?.success) {
        setRegistrationSuccess(true);
        toast.success('Admin registration successful! Redirecting to login...', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login/admin', { state: { registered: true } });
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.', {
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Moderate';
    if (passwordStrength === 3) return 'Strong';
    return 'Very Strong';
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
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Admin Registration
          </p>
        </motion.div>

        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
          variants={itemVariants}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                    disabled={isSubmitting || registrationSuccess}
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
                    placeholder="admin@example.com"
                    disabled={isSubmitting || registrationSuccess}
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
                    disabled={isSubmitting || registrationSuccess}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting || registrationSuccess}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors duration-200" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors duration-200" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Password strength:</span>
                      <span className="text-xs font-medium text-gray-700">{getPasswordStrengthText()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2.5 border ${
                      errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:text-sm transition duration-200`}
                    placeholder="••••••••"
                    disabled={isSubmitting || registrationSuccess}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting || registrationSuccess}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors duration-200" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors duration-200" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Access Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheckIcon 
                      className={`h-5 w-5 ${errors.adminCode ? 'text-red-500' : 'text-gray-400'}`} 
                    />
                  </div>
                  <input
                    id="adminCode"
                    name="adminCode"
                    type="password"
                    value={formData.adminCode}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.adminCode ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:text-sm transition duration-200`}
                    placeholder="Enter admin access code"
                    disabled={isSubmitting || registrationSuccess}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Contact system administrator if you don't have an access code
                </p>
                {errors.adminCode && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.adminCode}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isSubmitting || registrationSuccess}
                className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  registrationSuccess 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                  (isSubmitting || registrationSuccess) ? 'opacity-80 cursor-not-allowed' : 'hover:-translate-y-0.5'
                }`}
                whileHover={!isSubmitting && !registrationSuccess ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting && !registrationSuccess ? { scale: 0.99 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : registrationSuccess ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2 text-white" />
                    Success! Redirecting...
                  </>
                ) : (
                  'Create Admin Account'
                )}
              </motion.button>
            </motion.div>
          </form>
          
          <motion.div 
            className="mt-6 pt-6 border-t border-gray-200"
            variants={itemVariants}
          >
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login/admin" 
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
};

export default AdminRegisterPage;
