import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, AlertCircle, Users } from 'lucide-react';
import axios from 'axios';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required';
        else if (value.trim().length < 2) error = 'First name must be at least 2 characters';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Last name is required';
        else if (value.trim().length < 2) error = 'Last name must be at least 2 characters';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) error = 'Email is required';
        else if (!emailRegex.test(value)) error = 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '', color: '' };
    
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score++;
    else feedback.push('8+ characters');
    
    if (/[a-z]/.test(password)) score++;
    else feedback.push('lowercase letter');
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('uppercase letter');
    
    if (/\d/.test(password)) score++;
    else feedback.push('number');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push('special character');
    
    const strengthLevels = [
      { text: 'Very Weak', color: 'text-red-600' },
      { text: 'Weak', color: 'text-red-500' },
      { text: 'Fair', color: 'text-yellow-500' },
      { text: 'Good', color: 'text-blue-500' },
      { text: 'Strong', color: 'text-green-500' },
      { text: 'Very Strong', color: 'text-green-600' }
    ];
    
    return {
      score,
      text: strengthLevels[score].text,
      color: strengthLevels[score].color,
      feedback: feedback.length > 0 ? `Missing: ${feedback.join(', ')}` : 'All requirements met'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field]);
      setTouched(prev => ({ ...prev, [field]: true }));
    });
    
    // Check if form is valid
    const hasErrors = Object.values(errors).some(error => error !== '');
    const isEmpty = Object.values(formData).some(value => !value.trim());
    
    if (!hasErrors && !isEmpty) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/v1/register',{
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        });
        console.log('Registration successful:', response.data);
        alert('Registration successful! Welcome to SplitEase!');
      } catch (error) {
        console.error('Registration failed:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                setErrors({ email: 'Email already exists' });
            } else {
                alert('Registration failed. Please try again.');
            }
        } else {
            alert('Registration failed. Please try again.');
        }
      }
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('firstName')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors bg-gray-50 ${
                      touched.firstName && errors.firstName 
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('lastName')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors bg-gray-50 ${
                      touched.lastName && errors.lastName 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Doe"
                  />
                </div>
                {touched.lastName && errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('email')}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('password')}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors bg-gray-50 ${
                    touched.password && errors.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors bg-gray-50 ${
                    touched.confirmPassword && errors.confirmPassword 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:from-teal-500 hover:to-blue-600 focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center"
            >
              Create Account
            </button>
            </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <a href="#" className="text-blue-600 font-medium hover:underline">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}