import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Home, Menu, Bell, User, ChevronDown, Plus, Edit, Trash2, Target, AlertCircle, CheckCircle, TrendingDown, DollarSign, Calendar, ShoppingCart, Utensils, Car, Film, Heart, ShoppingBag, Coffee, Zap, CreditCard, Flame, Award, ArrowUpCircle, ArrowDownCircle, X } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, RadialBarChart, RadialBar } from 'recharts';

export default function BudgetPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [formData, setFormData] = useState({ id: null, category: '', amount: '' });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Budget Alert',
      message: 'Entertainment spending is over budget by $20',
      time: '2 hours ago',
      read: false,
      icon: AlertCircle,
      color: 'text-yellow-600'
    },
    {
      id: 2,
      type: 'success',
      title: 'Goal Achieved',
      message: 'You saved $585 this month!',
      time: '5 hours ago',
      read: false,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'danger',
      title: 'Over Budget',
      message: 'Shopping category at 94% of budget',
      time: '1 day ago',
      read: true,
      icon: AlertCircle,
      color: 'text-red-600'
    },
    {
      id: 4,
      type: 'info',
      title: 'Monthly Report',
      message: 'Your monthly budget report is ready',
      time: '2 days ago',
      read: true,
      icon: Target,
      color: 'text-blue-600'
    }
  ]);

  const [budgets, setBudgets] = useState([
    { 
      id: 1, 
      category: 'Food & Dining', 
      icon: Utensils, 
      color: 'bg-green-500',
      budget: 1000, 
      spent: 850, 
      remaining: 150,
      transactions: 24,
      trend: 'up',
      lastMonth: 780,
      status: 'good'
    },
    { 
      id: 2, 
      category: 'Transportation', 
      icon: Car, 
      color: 'bg-blue-500',
      budget: 500, 
      spent: 420, 
      remaining: 80,
      transactions: 18,
      trend: 'down',
      lastMonth: 480,
      status: 'good'
    },
    { 
      id: 3, 
      category: 'Shopping', 
      icon: ShoppingBag, 
      color: 'bg-purple-500',
      budget: 800, 
      spent: 750, 
      remaining: 50,
      transactions: 12,
      trend: 'up',
      lastMonth: 650,
      status: 'warning'
    },
    { 
      id: 4, 
      category: 'Entertainment', 
      icon: Film, 
      color: 'bg-red-500',
      budget: 400, 
      spent: 420, 
      remaining: -20,
      transactions: 15,
      trend: 'up',
      lastMonth: 380,
      status: 'danger'
    },
    { 
      id: 5, 
      category: 'Healthcare', 
      icon: Heart, 
      color: 'bg-pink-500',
      budget: 300, 
      spent: 180, 
      remaining: 120,
      transactions: 5,
      trend: 'down',
      lastMonth: 220,
      status: 'good'
    },
    { 
      id: 6, 
      category: 'Bills & Utilities', 
      icon: Zap, 
      color: 'bg-yellow-500',
      budget: 800, 
      spent: 750, 
      remaining: 50,
      transactions: 8,
      trend: 'stable',
      lastMonth: 740,
      status: 'good'
    },
    { 
      id: 7, 
      category: 'Coffee & Snacks', 
      icon: Coffee, 
      color: 'bg-amber-500',
      budget: 200, 
      spent: 165, 
      remaining: 35,
      transactions: 28,
      trend: 'down',
      lastMonth: 190,
      status: 'good'
    },
    { 
      id: 8, 
      category: 'Groceries', 
      icon: ShoppingCart, 
      color: 'bg-emerald-500',
      budget: 600, 
      spent: 480, 
      remaining: 120,
      transactions: 16,
      trend: 'down',
      lastMonth: 520,
      status: 'good'
    }
  ]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-menu')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddBudget = () => {
    setShowAddModal(true);
  };

  const handleDeleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const handleSubmitBudget = () => {
    if (!formData.category || !formData.amount) return;

    if (formData.id) {
      setBudgets(prev => prev.map(b =>
        b.id === formData.id
          ? { ...b, category: formData.category, budget: parseFloat(formData.amount), remaining: parseFloat(formData.amount) - b.spent }
          : b
      ));
    } else {
      const newBudget = {
        id: Date.now(),
        category: formData.category,
        icon: Target,
        color: 'bg-gray-500',
        budget: parseFloat(formData.amount),
        spent: 0,
        remaining: parseFloat(formData.amount),
        transactions: 0,
        trend: 'stable',
        lastMonth: 0,
        status: 'good'
      };
      setBudgets(prev => [...prev, newBudget]);
    }

    setFormData({ id: null, category: '', amount: '' });
    setShowAddModal(false);
  };

  const handleEditBudget = (id) => {
    const budgetToEdit = budgets.find(b => b.id === id);
    if (!budgetToEdit) return;
    setFormData({ id: budgetToEdit.id, category: budgetToEdit.category, amount: budgetToEdit.budget });
    setShowAddModal(true);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remaining, 0);
  const percentageUsed = ((totalSpent / totalBudget) * 100).toFixed(1);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'danger': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'good': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'danger': return AlertCircle;
      default: return Target;
    }
  };

  const monthlyProgressData = [
    { month: 'Jan', budgeted: 4500, spent: 4200 },
    { month: 'Feb', budgeted: 4500, spent: 3900 },
    { month: 'Mar', budgeted: 4600, spent: 4300 },
    { month: 'Apr', budgeted: 4600, spent: 4100 },
    { month: 'May', budgeted: 4600, spent: 3800 },
    { month: 'Jun', budgeted: 4600, spent: 4015 }
  ];

  const categoryDistribution = budgets.map(b => ({
    name: b.category,
    value: b.spent,
    color: b.color.replace('bg-', '')
  }));

  const radialData = budgets.slice(0, 5).map(b => ({
    name: b.category,
    value: (b.spent / b.budget) * 100,
    fill: b.color.replace('bg-', '#')
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-900">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700">Budget Management</h1>
                <p className="text-sm text-gray-500">Plan and track your spending limits</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleAddBudget}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Budget
              </button>
              
              {/* Notification Bell - WORKING */}
              <div className="relative notification-menu">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
                      <div>
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <p className="text-xs text-gray-500">{unreadCount} unread</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                        >
                          Mark all read
                        </button>
                        <button 
                          onClick={clearAllNotifications}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold"
                        >
                          Clear all
                        </button>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-all ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.read ? 'bg-gray-100' : 'bg-white'}`}>
                                <notification.icon className={`w-5 h-5 ${notification.color}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                                  <button 
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-gray-400 hover:text-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-400">{notification.time}</span>
                                  {!notification.read && (
                                    <button 
                                      onClick={() => markNotificationAsRead(notification.id)}
                                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                                    >
                                      Mark as read
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                  OD
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Target className="w-6 h-6" />
                </div>
                <Flame className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-sm opacity-90 mb-1">Total Budget</p>
              <p className="text-4xl font-bold mb-2">${totalBudget.toLocaleString()}</p>
              <div className="flex items-center gap-2 text-xs opacity-75">
                <Calendar className="w-3 h-3" />
                <span>Monthly Limit</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <DollarSign className="w-6 h-6" />
                </div>
                <TrendingUp className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-sm opacity-90 mb-1">Total Spent</p>
              <p className="text-4xl font-bold mb-2">${totalSpent.toLocaleString()}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-white/20 px-2 py-1 rounded-full">{percentageUsed}% used</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Wallet className="w-6 h-6" />
                </div>
                <ArrowDownCircle className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-sm opacity-90 mb-1">Remaining</p>
              <p className="text-4xl font-bold mb-2">${totalRemaining.toLocaleString()}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-white/20 px-2 py-1 rounded-full">{(100 - parseFloat(percentageUsed)).toFixed(1)}% left</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Award className="w-6 h-6" />
                </div>
                <Flame className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-sm opacity-90 mb-1">Budget Score</p>
              <p className="text-4xl font-bold mb-2">87/100</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-white/20 px-2 py-1 rounded-full">Excellent</span>
              </div>
            </div>
          </div>

          {/* Monthly Progress & Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Budget Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Budget vs Spending Trend</h2>
                <p className="text-sm text-gray-500">6-month comparison</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                    <YAxis tick={{ fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="budgeted" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} name="Budgeted" />
                    <Line type="monotone" dataKey="spent" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 6 }} name="Spent" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution Pie Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Spending Distribution</h2>
                <p className="text-sm text-gray-500">By category this month</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => {
                        const colorMap = {
                          'green-500': '#10b981',
                          'blue-500': '#3b82f6',
                          'purple-500': '#a855f7',
                          'red-500': '#ef4444',
                          'pink-500': '#ec4899',
                          'yellow-500': '#eab308',
                          'amber-500': '#f59e0b',
                          'emerald-500': '#10b981'
                        };
                        return <Cell key={`cell-${index}`} fill={colorMap[entry.color] || '#6b7280'} />;
                      })}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Budget Categories Grid */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Budget Categories</h2>
                <p className="text-sm text-gray-500">Track spending across all categories</p>
              </div>
              <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all font-semibold">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {budgets.map((budget) => {
                const percentage = (budget.spent / budget.budget) * 100;
                const StatusIcon = getStatusIcon(budget.status);
                
                return (
                  <div 
                    key={budget.id} 
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100 hover:border-emerald-300 hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 ${budget.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                        <budget.icon className="w-7 h-7" />
                      </div>
                      <StatusIcon className={`w-6 h-6 ${getStatusColor(budget.status).split(' ')[0]}`} />
                    </div>

                    <h3 className="font-bold text-gray-900 mb-1">{budget.category}</h3>
                    <p className="text-xs text-gray-500 mb-4">{budget.transactions} transactions</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">${budget.spent}</span>
                        <span className="text-sm font-semibold text-gray-500">of ${budget.budget}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full ${budget.color} transition-all duration-500 rounded-full ${percentage > 100 ? 'animate-pulse' : ''}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs font-bold ${percentage > 100 ? 'text-red-600' : percentage > 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {percentage.toFixed(1)}% used
                        </span>
                        <span className={`text-xs font-semibold ${budget.remaining < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          ${Math.abs(budget.remaining)} {budget.remaining < 0 ? 'over' : 'left'}
                        </span>
                      </div>
                    </div>

                    {/* Trend Indicator */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        {budget.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-red-600" />
                        ) : budget.trend === 'down' ? (
                          <TrendingDown className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-0.5 bg-gray-400"></div>
                        )}
                        <span className={`text-xs font-semibold ${budget.trend === 'up' ? 'text-red-600' : budget.trend === 'down' ? 'text-green-600' : 'text-gray-600'}`}>
                          {budget.trend === 'stable' ? 'Stable' : `${Math.abs(((budget.spent - budget.lastMonth) / budget.lastMonth * 100)).toFixed(0)}%`}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEditBudget(budget.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteBudget(budget.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">On Track!</h3>
              <p className="text-sm text-gray-600">You're staying within budget for 6 out of 8 categories. Great job!</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Watch Out</h3>
              <p className="text-sm text-gray-600">Entertainment spending is over budget by $20. Consider reducing expenses.</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Goal Achieved</h3>
              <p className="text-sm text-gray-600">You've saved $585 this month, exceeding your savings goal!</p>
            </div>
          </div>
        </main>
      </div>
      {/* Modal for Add/Edit Budget */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit Budget' : 'Add Budget'}</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Category Name"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <input
                type="number"
                placeholder="Budget Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ id: null, category: '', amount: '' });
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBudget}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              >
                {formData.id ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )} 
    </div>
  );
}