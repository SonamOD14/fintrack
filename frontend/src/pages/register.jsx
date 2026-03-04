import { createUserApi } from "../services/api";

import React, { useState } from 'react';
import { Eye, EyeOff, Wallet, TrendingUp, PieChart, Lock, Mail, User, Check, X } from 'lucide-react';
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function ExpenseTrackerSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [focusedField, setFocusedField] = useState('');

  const passwordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 50, label: 'Fair', color: 'bg-orange-500' };
    if (password.length < 14) return { strength: 75, label: 'Good', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = passwordStrength(formData.password);

  const handleSubmit = async () => {

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      return toast.error("Please fill in all fields");
    } else if (!formData.agreeToTerms) {
      return toast.error("You must agree to the terms and conditions");
    } else if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const sendData = {
      username: formData.fullName,
      email: formData.email,
      password: formData.password
    }

    try {

      await toast.promise(
        createUserApi(sendData),
        {
          loading: <b>registering user...</b>,
          success: (res) => {
            setTimeout(() => {
              navigate('/signin');
            }, 100);
            return <b>{res.data.message}</b>
          }
        }
      )

    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred during registration");

    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex">

      {/* Left Panel - Enhanced with animations */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}>
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-16 text-white">
          {/* Logo with animation */}
          <div className="mb-12 transform hover:scale-110 transition-transform duration-300">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Wallet className="w-16 h-16 text-emerald-600" strokeWidth={2} />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4 text-center">Expense Tracker</h1>
          <p className="text-xl text-emerald-100 mb-16 text-center">Smart Money Management</p>

          {/* Feature cards with hover effects */}
          <div className="space-y-6 w-full max-w-md">
            {[
              { icon: TrendingUp, text: 'Track expenses effortlessly', delay: '0ms' },
              { icon: PieChart, text: 'Get insights with analytics', delay: '100ms' },
              { icon: Lock, text: 'Secure & private data', delay: '200ms' }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:translate-x-2"
                style={{ animationDelay: feature.delay }}
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          {/* <div className="flex gap-6 mt-16">
            <button className="px-8 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
              CREATE HERE
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
              DISCOVER HERE
            </button>
          </div> */}
        </div>
      </div>

      {/* Right Panel - Enhanced Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative">
        {/* Decorative zigzag pattern overlay */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-32 -ml-16">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 0,0 L 50,10 L 0,20 L 50,30 L 0,40 L 50,50 L 0,60 L 50,70 L 0,80 L 50,90 L 0,100 L 0,0 Z"
              fill="white" opacity="0.7" />
          </svg>
        </div>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <Wallet className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">Join us and start managing your expenses today!</p>
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'fullName' ? 'transform scale-[1.02]' : ''}`}>
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Password strength:</span>
                    <span className={`text-xs font-semibold ${strength.strength < 50 ? 'text-red-600' : strength.strength < 75 ? 'text-orange-600' : strength.strength < 100 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-500 ease-out`}
                      style={{ width: `${strength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'confirmPassword' ? 'transform scale-[1.02]' : ''}`}>
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="w-5 h-5 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-600 cursor-pointer">
                I agree to the <span className="text-emerald-600 font-medium hover:underline">terms and conditions</span> and <span className="text-emerald-600 font-medium hover:underline">privacy policy</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-gray-500">Or sign up with</span>
              </div>
            </div>
          
            {/* Sign In Link */}
            <div className="text-center text-gray-600">
              Already have an account?{' '}
              <Link to='/signin' className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors">
                Sign In
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}