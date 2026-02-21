import React, { useState } from 'react';
import { Mail, ArrowLeft, Wallet, TrendingUp, PieChart, Lock, CheckCircle } from 'lucide-react';

import { forgetPasswordApi } from '../services/api';
import { toast } from 'react-hot-toast';

import { Link } from 'react-router-dom';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }
  
    try {
      await toast.promise(
        forgetPasswordApi({ email }),
        {
          loading: "Sending reset link...",
          success: (res) => {
            setIsSubmitted(true);
            return <b>{res.data.message}</b>; // show backend success message
          },
          error: (err) => <b>{err?.response?.data?.message || "Something went wrong!"}</b>
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-16 text-white">
          <div className="mb-12 transform hover:scale-110 transition-transform duration-300">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Wallet className="w-16 h-16 text-emerald-600" strokeWidth={2} />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4 text-center">Expense Tracker</h1>
          <p className="text-xl text-emerald-100 mb-16 text-center">Smart Money Management</p>

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
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative">
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-32 -ml-16">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 0,0 L 50,10 L 0,20 L 50,30 L 0,40 L 50,50 L 0,60 L 50,70 L 0,80 L 50,90 L 0,100 L 0,0 Z" 
                  fill="white" opacity="0.7"/>
          </svg>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <Wallet className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
          </div>

          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <Link to="/Signin" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold mb-6 transition-colors">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Sign In
                </Link>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-600">No worries! Enter your email and we'll send you reset instructions.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                >
                  Send Reset Link
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link to ="/signin" className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h2>
              <p className="text-gray-600 mb-2">We've sent password reset instructions to:</p>
              <p className="text-emerald-600 font-semibold mb-6">{email}</p>
              <p className="text-sm text-gray-500 mb-8">
                Didn't receive the email? Check your spam folder or{' '}
                <button onClick={() => setIsSubmitted(false)} className="text-emerald-600 font-semibold hover:underline">
                  try another email address
                </button>
              </p>
              <Link to="/signin" className="inline-flex items-center justify-center w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}