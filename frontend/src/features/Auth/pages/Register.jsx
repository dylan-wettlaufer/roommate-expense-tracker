import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, AlertCircle, Users } from 'lucide-react';
import useForm from '../../../hooks/useForm';
import usePasswordStrength from '../../../hooks/usePasswordStrength';
import useRegister from '../hooks/useRegister';
import useToggle from '../../../hooks/useToggle';
import useValidation from '../../../hooks/useValidation';


export default function RegisterForm() {

  const validationRules = {
    firstName: (value) => {
      if (!value.trim()) return 'First name is required';
      if (value.trim().length < 2) return 'First name must be at least 2 characters';
      return '';
    },
    lastName: (value) => {
      if (!value.trim()) return 'Last name is required';
      if (value.trim().length < 2) return 'Last name must be at least 2 characters';
      return '';
    },
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) return 'Email is required';
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
      return '';
    },
    password: (value) => {
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      return '';
    },
    confirmPassword: (value, formData) => { // validation for confirmPassword now uses formData
      if (!value) return 'Please confirm your password';
      if (value !== formData.password) return 'Passwords do not match';
      return '';
    },
  };

  const { values: formData, handleChange, resetForm } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { errors, touched, handleBlur, validateForm, setErrors } = useValidation();
  const [showPassword, toggleShowPassword] = useToggle(false);
  const [showConfirmPassword, toggleConfirmPassword] = useToggle(false);
  const passwordStrength = usePasswordStrength(formData.password); // Using the new hook
  const { handleRegister, isSubmitting, registerError } = useRegister(); // Using the new hook

  const handleFieldBlur = (field) => {
    handleBlur(field, formData[field], formData, validationRules); // Pass formData
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formIsValid = validateForm(formData, validationRules);
    
    if (formIsValid) {
      const { success, error } = await handleRegister(formData.first_name, formData.last_name, formData.email, formData.password, formData.confirmPassword);
      if (success) {
        resetForm(); // Reset form on success
        alert("Registration successful!");
        // Navigation handled by useRegister
      } else {
        // Errors are set within useRegister; display them here or map to specific fields
        if (error) {
            // Check if error contains email-related message
            const emailError = error.toLowerCase().includes('email') ? error : null;
            if (emailError) {
                setErrors(prev => ({ ...prev, email: emailError }));
            } else {
                // Set as general error
                setErrors(prev => ({ ...prev, general: error }));
            }
        }
      }
    }
    
  }
  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Join SplitEase</h1>
          <p className="text-gray-500">Create your account and start splitting bills with your roommates</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6"> {/* Use form tag */}
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    onBlur={() => handleFieldBlur('first_name')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors bg-gray-50 ${
                      touched.first_name && errors.first_name
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="John"
                  />
                </div>
                {touched.firstName && errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    onBlur={() => handleFieldBlur('last_name')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors bg-gray-50 ${
                      touched.last_name && errors.last_name
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Doe"
                  />
                </div>
                {touched.last_name && errors.last_name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleFieldBlur('email')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors bg-gray-50 ${
                    touched.email && errors.email
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="john.doe@example.com"
                />
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleFieldBlur('password')}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors bg-gray-50 ${
                    touched.password && errors.password
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600">Password Strength:</span>
                    <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        passwordStrength.score <= 1 ? 'bg-red-500' :
                        passwordStrength.score <= 2 ? 'bg-yellow-500' :
                        passwordStrength.score <= 3 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{passwordStrength.feedback}</p>
                </div>
              )}

              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleFieldBlur('confirmPassword')}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors bg-gray-50 ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-1">
                  {formData.password === formData.confirmPassword ? (
                    <p className="text-sm text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Passwords match
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      Passwords do not match
                    </p>
                  )}
                </div>
              )}

              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* General Register Error Display */}
            {registerError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <XCircle className="w-4 h-4 mr-1" />
                {/* Check if registerError is an object and has a 'msg' property, then display msg.
        Otherwise, display registerError as is (assuming it's already a string). */}
                {typeof registerError === 'object' && registerError !== null && registerError.msg
                  ? registerError.msg
                  : registerError}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl font-medium focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-400 to-blue-500 text-white hover:from-teal-500 hover:to-blue-600'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className='text-blue-600 font-medium hover:underline'>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}