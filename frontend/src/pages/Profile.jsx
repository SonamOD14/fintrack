import React, { useState, useRef } from 'react';
import { Menu, Bell, User, ChevronDown, Camera, Edit, Save, X, Mail, Phone, MapPin, Calendar, Lock, Shield, Smartphone, Eye, EyeOff, Award, Star, DollarSign, CheckCircle, AlertCircle, Download, Share2, LogOut, Trophy } from 'lucide-react';

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('achievements');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState({
    name: 'Sonam',
    email: 'sonam@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    profession: 'Software Engineer',
    website: 'sonam.com',
    bio: 'Passionate about personal finance and building wealth. Love traveling and trying new restaurants.',
    joinDate: 'January 2024',
    avatar: null,
  });

  const [editedData, setEditedData] = useState({ ...userData });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Budget limit reached for Shopping', time: '2 hours ago', read: false },
    { id: 2, message: 'Weekly expense report ready', time: '1 day ago', read: false },
    { id: 3, message: 'New achievement unlocked!', time: '2 days ago', read: true },
  ]);

  const achievements = [
    { id: 1, title: 'First Transaction', description: 'Logged your first expense', icon: CheckCircle, earned: true, color: 'from-green-400 to-emerald-500', date: 'Jan 15, 2024' },
    { id: 2, title: 'Budget Master', description: 'Stayed within budget for 3 months', icon: Trophy, earned: true, color: 'from-yellow-400 to-orange-500', date: 'Mar 22, 2024' },
    { id: 3, title: 'Savings Streak', description: 'Saved money for 30 days straight', icon: Star, earned: true, color: 'from-blue-400 to-indigo-500', date: 'Apr 8, 2024' },
    { id: 4, title: '100 Transactions', description: 'Tracked 100 transactions', icon: Star, earned: true, color: 'from-purple-400 to-pink-500', date: 'May 3, 2024' },
    { id: 5, title: 'Goal Achiever', description: 'Completed your first savings goal', icon: Trophy, earned: false, color: 'from-gray-300 to-gray-400', date: null },
    { id: 6, title: 'Consistent Tracker', description: 'Logged expenses for 60 days', icon: Award, earned: false, color: 'from-gray-300 to-gray-400', date: null },
    { id: 7, title: 'Money Saver', description: 'Saved over $10,000', icon: DollarSign, earned: true, color: 'from-green-400 to-teal-500', date: 'May 28, 2024' },
    { id: 8, title: 'Streak Master', description: '100 day login streak', icon: Star, earned: false, color: 'from-gray-300 to-gray-400', date: null }
  ];

  const tabs = [
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: User },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showSuccess('Please select a valid image file', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showSuccess('Image size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, avatar: reader.result });
        setEditedData({ ...editedData, avatar: reader.result });
        showSuccess('Profile picture updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleEditProfile = () => {
    if (isEditing) {
      setEditedData({ ...userData });
      setIsEditing(false);
      showSuccess('Edit cancelled');
    } else {
      setIsEditing(true);
      setActiveTab('settings');
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone);
  };

  const handleSaveProfile = () => {
    if (!editedData.name.trim()) {
      showSuccess('Name cannot be empty', 'error');
      return;
    }
    
    if (!isValidEmail(editedData.email)) {
      showSuccess('Please enter a valid email address', 'error');
      return;
    }
    
    if (editedData.phone && !isValidPhone(editedData.phone)) {
      showSuccess('Please enter a valid phone number', 'error');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setUserData({ ...editedData });
      setIsSaving(false);
      setIsEditing(false);
      showSuccess('Profile updated successfully!');
    }, 1000);
  };

  const handleShareProfile = async () => {
    const profileUrl = `https://financeapp.com/profile/${userData.name.toLowerCase().replace(/\s+/g, '-')}`;
    const shareText = `Check out ${userData.name}'s profile on FinanceApp!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userData.name}'s Profile`,
          text: shareText,
          url: profileUrl,
        });
        showSuccess('Profile shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackShare(profileUrl);
        }
      }
    } else {
      fallbackShare(profileUrl);
    }
  };

  const fallbackShare = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      showSuccess('Profile link copied to clipboard!');
    }).catch(() => {
      showSuccess('Failed to copy link', 'error');
    });
  };

  const handleExportData = () => {
    const exportData = {
      profile: userData,
      achievements: achievements,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${userData.name.replace(/\s+/g, '_')}_profile_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showSuccess('Data exported successfully!');
  };

  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      showSuccess('Please fill in all password fields', 'error');
      return;
    }
    
    if (passwords.new !== passwords.confirm) {
      showSuccess('New passwords do not match', 'error');
      return;
    }
    
    if (passwords.new.length < 8) {
      showSuccess('Password must be at least 8 characters long', 'error');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(passwords.new);
    const hasLowerCase = /[a-z]/.test(passwords.new);
    const hasNumbers = /\d/.test(passwords.new);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      showSuccess('Password must contain uppercase, lowercase, and numbers', 'error');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setPasswords({ current: '', new: '', confirm: '' });
      showSuccess('Password updated successfully!');
    }, 1000);
  };

  const handleEnable2FA = () => {
    showSuccess('Two-factor authentication enabled! Check your phone for verification code.');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
    showSuccess('All notifications cleared');
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm(
      'Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.'
    );
    if (confirm) {
      const doubleConfirm = window.confirm(
        'This is your final warning. Click OK to proceed with account deletion.'
      );
      if (doubleConfirm) {
        const finalConfirm = window.prompt('Type DELETE to confirm:');
        if (finalConfirm === 'DELETE') {
          showSuccess('Account deletion initiated. You will receive a confirmation email.');
        } else {
          showSuccess('Account deletion cancelled', 'error');
        }
      }
    }
  };

  const handleLogout = () => {
    const confirm = window.confirm('Are you sure you want to logout?');
    if (confirm) {
      showSuccess('Logging out...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
  };

  const showSuccess = (message, type = 'success') => {
    setShowSuccessMessage({ message, type });
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`${
            showSuccessMessage.type === 'error' 
              ? 'bg-gradient-to-r from-red-500 to-pink-600' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600'
          } text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3`}>
            {showSuccessMessage.type === 'error' ? (
              <AlertCircle className="w-6 h-6" />
            ) : (
              <CheckCircle className="w-6 h-6" />
            )}
            <span className="font-semibold">{showSuccessMessage.message}</span>
          </div>
        </div>
      )}

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-40 border-b border-gray-200">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">My Profile</h1>
                <p className="text-sm text-gray-500">Manage your account and track progress</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
                      <h3 className="font-bold">Notifications</h3>
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearAllNotifications}
                          className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-all"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div 
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all ${
                              !notif.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <p className="text-sm font-semibold text-gray-900">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            {!notif.read && (
                              <span className="inline-block mt-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative group">
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-xl p-2 transition-all">
                  <div className="relative">
                    {userData.avatar ? (
                      <img src={userData.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-200" />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-emerald-200">
                        {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </div>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 transition-all flex items-center gap-2 text-red-600 font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative z-10 p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="Profile" 
                      className="relative w-40 h-40 rounded-full object-cover shadow-2xl ring-8 ring-white/50"
                    />
                  ) : (
                    <div className="relative w-40 h-40 bg-white rounded-full flex items-center justify-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 to-teal-600 shadow-2xl ring-8 ring-white/50">
                      {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                  <button 
                    onClick={triggerFileInput}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="flex-1 text-center md:text-left text-white space-y-4">
                  <div>
                    <h2 className="text-5xl font-bold mb-2 drop-shadow-lg">{userData.name}</h2>
                    <p className="text-xl opacity-90 mb-1">{userData.profession}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                      <Mail className="w-4 h-4" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.location}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {userData.joinDate}</span>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 max-w-2xl">
                    <p className="text-sm opacity-90">{userData.bio}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleEditProfile}
                    className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2"
                  >
                    {isEditing ? (
                      <>
                        <X className="w-5 h-5" />
                        Cancel Edit
                      </>
                    ) : (
                      <>
                        <Edit className="w-5 h-5" />
                        Edit Profile
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleShareProfile}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Profile
                  </button>
                  <button 
                    onClick={handleExportData}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg"></div>
                )}
                <tab.icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'achievements' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Achievements & Badges</h3>
                <p className="text-gray-500">Unlock badges by reaching milestones and completing challenges</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative p-6 rounded-2xl transition-all transform hover:scale-105 ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-white to-gray-50 border-2 border-emerald-200 shadow-xl'
                        : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                    }`}
                  >
                    {achievement.earned && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                    <div className={`w-20 h-20 bg-gradient-to-r ${achievement.color} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-2xl ${achievement.earned ? 'animate-pulse' : 'grayscale'}`}>
                      <achievement.icon className="w-10 h-10" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-center mb-2">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 text-center mb-3">{achievement.description}</p>
                    {achievement.earned && achievement.date && (
                      <div className="text-center">
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                          Unlocked {achievement.date}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-900">Overall Progress</h4>
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {achievements.filter(a => a.earned).length}/{achievements.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full transition-all duration-1000 shadow-lg"
                    style={{ width: `${(achievements.filter(a => a.earned).length / achievements.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-3 text-center">
                  {achievements.length - achievements.filter(a => a.earned).length} more to unlock all achievements!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h3>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={editedData.phone}
                    onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={editedData.location}
                    onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="City, State/Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profession</label>
                  <input
                    type="text"
                    value={editedData.profession}
                    onChange={(e) => setEditedData({ ...editedData, profession: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="Your profession"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={editedData.website}
                    onChange={(e) => setEditedData({ ...editedData, website: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="yourwebsite.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={editedData.bio}
                    onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                    rows={4}
                    maxLength={200}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-gray-500 mt-1">{editedData.bio.length}/200 characters</p>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      setEditedData({ ...userData });
                      setIsEditing(false);
                    }}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Security Settings</h3>
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all pr-12"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password *</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                      placeholder="Enter new password (min. 8 characters)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Password must contain uppercase, lowercase, and numbers</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password *</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button 
                    onClick={handleUpdatePassword}
                    disabled={isSaving}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Update Password
                      </>
                    )}
                  </button>

                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">SMS Authentication</p>
                          <p className="text-sm text-gray-500">Receive codes via text message</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleEnable2FA}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 font-semibold"
                      >
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 border-2 border-red-300 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                  <h4 className="text-xl font-bold text-red-900">Danger Zone</h4>
                </div>
                <p className="text-sm text-red-700 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}