import React, { useEffect, useState } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, DollarSign,
  Menu, Bell, ChevronDown, Search, Filter,
  Calendar, Download, Plus, Edit, Trash2,
  Eye, ShoppingCart, Utensils, Car, Film,
  Heart, ShoppingBag, Coffee, Zap, MoreVertical, X, Check
} from 'lucide-react';
import { getAllTransactions, saveTransaction } from '../services/api';

export default function ExpenseTrackerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // MODAL STATES
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [viewingTransaction, setViewingTransaction] = useState(null);

  // DATA STATE
  const [transactions, setTransactions] = useState([]);

  // FORM STATE
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food',
    transactionType: 'expense', // 'income' or 'expense'
    amount: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    status: 'completed',
    merchant: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const expenseCategories = [
    { name: 'Food', value: 'Food', icon: Utensils, color: 'bg-green-500' },
    { name: 'Transport', value: 'Transport', icon: Car, color: 'bg-blue-500' },
    { name: 'Shopping', value: 'Shopping', icon: ShoppingBag, color: 'bg-purple-500' },
    { name: 'Entertainment', value: 'Entertainment', icon: Film, color: 'bg-red-500' },
    { name: 'Healthcare', value: 'Healthcare', icon: Heart, color: 'bg-pink-500' },
    { name: 'Bills', value: 'Bills', icon: Zap, color: 'bg-yellow-500' },
    { name: 'Coffee', value: 'Coffee', icon: Coffee, color: 'bg-amber-500' }
  ];

  const incomeCategories = [
    { name: 'Salary', value: 'Salary', icon: DollarSign, color: 'bg-emerald-500' },
    { name: 'Freelance', value: 'Freelance', icon: TrendingUp, color: 'bg-blue-500' },
    { name: 'Investment', value: 'Investment', icon: TrendingUp, color: 'bg-purple-500' },
    { name: 'Business', value: 'Business', icon: DollarSign, color: 'bg-indigo-500' },
    { name: 'Other Income', value: 'Other Income', icon: DollarSign, color: 'bg-teal-500' }
  ];

  const categories = [
    { name: 'All', value: 'all' },
    ...expenseCategories,
    { name: 'Income', value: 'Income', icon: DollarSign, color: 'bg-emerald-500' }
  ];

  useEffect(() => {
    const getAllTransactionsFromAPI = async () => {
      try {
        const res = await getAllTransactions()
        setTransactions(res?.data?.data || [])
        console.log(res.data)
      } catch (error) {
        console.log(error.response?.data?.message)
      }
    }
    getAllTransactionsFromAPI()
  }, [])

  // --- CALCULATIONS ---
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
  const totalBalance = totalIncome - totalExpenses;
  const budgetLeft = totalBalance * 0.3; // Example: 30% of balance as budget

  // --- VALIDATION ---
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Transaction name is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Please enter a valid amount';
    }

    if (!formData.date) {
      errors.date = 'Date is required';gi
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- FUNCTIONALITY ---

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setFormData({
      name: '',
      category: 'Food',
      transactionType: 'expense',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      merchant: '',
      notes: ''
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTransaction(t);
    const isIncome = t.amount > 0;
    setFormData({
      name: t.name,
      category: t.category,
      transactionType: isIncome ? 'income' : 'expense',
      amount: Math.abs(t.amount).toString(),
      date: t.date,
      time: t.time,
      status: t.status,
      merchant: t.merchant || t.name,
      notes: t.notes || ''
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const currentCategories = formData.transactionType === 'income' ? incomeCategories : expenseCategories;
    const catInfo = currentCategories.find(c => c.value === formData.category);
    const amountNum = formData.transactionType === 'income' ? Math.abs(parseFloat(formData.amount)) : -Math.abs(parseFloat(formData.amount));

    if (editingTransaction) {
      setTransactions(transactions.map(t =>
        t.id === editingTransaction.id
          ? {
            ...t,
            name: formData.name,
            category: formData.category,
            amount: amountNum,
            date: formData.date,
            time: formData.time,
            status: formData.status,
            merchant: formData.merchant || formData.name,
            notes: formData.notes,
            type: formData.transactionType,
            icon: catInfo.icon,
            color: catInfo.color
          }
          : t
      ));
    } else {
      const newEntry = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        amount: amountNum,
        date: formData.date,
        time: formData.time,
        status: formData.status,
        merchant: formData.merchant || formData.name,
        notes: formData.notes,
        type: formData.transactionType,
        icon: catInfo.icon,
        color: catInfo.color
      };
      setTransactions([newEntry, ...transactions]);

      try {
        const res = await saveTransaction(formData)
        console.log(res?.data?.message)
      } catch (error) {
        console.log(error.response?.data?.message)
      }
    }

    setShowAddModal(false);
    setFormData({
      name: '',
      category: 'Food',
      transactionType: 'expense',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      merchant: '',
      notes: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>

        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <Menu />
            </button>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleOpenAdd}
              className="bg-emerald-600 text-white flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline font-bold">Add Transaction</span>
            </button>
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-emerald-600 transition-colors">
              JD
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-900">
            <StatCard
              icon={<DollarSign />}
              label="Total Balance"
              val={`$${totalBalance.toFixed(2)}`}
              trend="+12.5%"
              trendColor="text-emerald-600"
              iconBg="bg-emerald-100"
            />
            <StatCard
              icon={<TrendingDown />}
              label="Total Expenses"
              val={`$${totalExpenses.toFixed(2)}`}
              trend="-8.2%"
              trendColor="text-red-600"
              iconBg="bg-red-100"
            />
            <StatCard
              icon={<TrendingUp />}
              label="Total Income"
              val={`$${totalIncome.toFixed(2)}`}
              trend="+5.8%"
              trendColor="text-blue-600"
              iconBg="bg-blue-100"
            />
            <StatCard
              icon={<Wallet />}
              label="Budget Left"
              val={`$${budgetLeft.toFixed(2)}`}
              trend="78%"
              trendColor="text-purple-600"
              iconBg="bg-purple-100"
            />
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-100 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat.value
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <p className="text-lg font-medium">No transactions found</p>
                <p className="text-sm mt-2">Try adjusting your filters or add a new transaction</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-6 text-left">Transaction</th>
                      <th className="p-6 text-left">Category</th>
                      <th className="p-6 text-left">Status</th>
                      <th className="p-6 text-right">Amount</th>
                      <th className="p-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition-all">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 ${t.color} rounded-lg flex items-center justify-center text-white`}>
                              <t.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{t.name}</p>
                              <p className="text-xs text-gray-400">{t.date} • {t.time}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${t.color} text-white`}>
                            {t.category}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className={`text-xs font-bold capitalize ${t.status === 'completed' ? 'text-green-600' : 'text-amber-500'
                            }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className={`p-6 text-right font-bold text-lg ${t.amount > 0 ? 'text-emerald-600' : 'text-red-500'
                          }`}>
                          {t.amount > 0 ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                        </td>
                        <td className="p-6">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => { setViewingTransaction(t); setShowViewModal(true); }}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(t)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Edit Transaction"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(t.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Transaction"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTransaction ? 'Edit' : 'Add'} Transaction
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X />
              </button>
            </div>

            <div className="p-8 space-y-5">
              {/* Transaction Type Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Transaction Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        transactionType: 'expense',
                        category: 'Food'
                      });
                    }}
                    className={`p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${formData.transactionType === 'expense'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <TrendingDown className="w-5 h-5" />
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        transactionType: 'income',
                        category: 'Salary'
                      });
                    }}
                    className={`p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${formData.transactionType === 'income'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    Income
                  </button>
                </div>
              </div>

              {/* Transaction Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {formData.transactionType === 'income' ? 'Income Source' : 'Transaction Name'} *
                </label>
                <input
                  type="text"
                  placeholder={formData.transactionType === 'income' ? 'e.g., Monthly Salary' : 'e.g., Grocery Shopping'}
                  className={`w-full p-4 bg-gray-50 rounded-xl outline-none border-2 transition-all ${formErrors.name ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-emerald-500'
                    }`}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Category and Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    className="w-full p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    {(formData.transactionType === 'income' ? incomeCategories : expenseCategories).map(c => (
                      <option key={c.value} value={c.value}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Amount * ($)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full p-4 bg-gray-50 rounded-xl outline-none border-2 transition-all ${formErrors.amount ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-emerald-500'
                      }`}
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  />
                  {formErrors.amount && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>
                  )}
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    className={`w-full p-4 bg-gray-50 rounded-xl outline-none border-2 transition-all ${formErrors.date ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-emerald-500'
                      }`}
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                  {formErrors.date && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Merchant (Optional) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Merchant (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Whole Foods"
                  className="w-full p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all"
                  value={formData.merchant}
                  onChange={e => setFormData({ ...formData, merchant: e.target.value })}
                />
              </div>

              {/* Notes (Optional) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  placeholder="Add any additional notes..."
                  rows="3"
                  className="w-full p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all resize-none"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  {editingTransaction ? 'Update' : 'Save'} Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW MODAL --- */}
      {showViewModal && viewingTransaction && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className={`w-16 h-16 ${viewingTransaction.color} rounded-2xl flex items-center justify-center text-white`}>
                  <viewingTransaction.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{viewingTransaction.name}</h3>
                  <p className="text-sm text-gray-500">{viewingTransaction.merchant}</p>
                </div>
              </div>

              <div className="space-y-4">
                <DetailRow label="Amount" value={
                  <span className={`font-bold text-xl ${viewingTransaction.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {viewingTransaction.amount > 0 ? '+' : '-'}${Math.abs(viewingTransaction.amount).toFixed(2)}
                  </span>
                } />
                <DetailRow label="Category" value={
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${viewingTransaction.color} text-white`}>
                    {viewingTransaction.category}
                  </span>
                } />
                <DetailRow label="Date" value={viewingTransaction.date} />
                <DetailRow label="Time" value={viewingTransaction.time} />
                <DetailRow label="Status" value={
                  <span className={`text-sm font-bold capitalize ${viewingTransaction.status === 'completed' ? 'text-green-600' : 'text-amber-500'}`}>
                    {viewingTransaction.status}
                  </span>
                } />
                {viewingTransaction.notes && (
                  <DetailRow label="Notes" value={viewingTransaction.notes} />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleOpenEdit(viewingTransaction);
                  }}
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleDelete(viewingTransaction.id);
                  }}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ icon, label, val, trend, trendColor, iconBg }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center text-gray-700`}>
          {icon}
        </div>
        <span className={`text-sm font-semibold ${trendColor}`}>{trend}</span>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{label}</h3>
      <p className="text-3xl font-bold mt-1">{val}</p>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold">{value}</span>
    </div>
  );
}