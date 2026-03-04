import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, Menu, Search,
  Plus, Edit, Trash2, Eye, Utensils, Car, Film, Heart,
  ShoppingBag, Coffee, Zap, X
} from 'lucide-react';
import { getAllTransactions, saveTransaction, updateTransaction, deleteTransaction } from '../services/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const EXPENSE_CATS = [
  { value: 'Food',          icon: Utensils,    color: 'bg-green-500'  },
  { value: 'Transport',     icon: Car,          color: 'bg-blue-500'   },
  { value: 'Shopping',      icon: ShoppingBag,  color: 'bg-purple-500' },
  { value: 'Entertainment', icon: Film,         color: 'bg-red-500'    },
  { value: 'Healthcare',    icon: Heart,        color: 'bg-pink-500'   },
  { value: 'Bills',         icon: Zap,          color: 'bg-yellow-500' },
  { value: 'Coffee',        icon: Coffee,       color: 'bg-amber-500'  },
];
const INCOME_CATS = [
  { value: 'Salary',       icon: DollarSign,  color: 'bg-emerald-500' },
  { value: 'Freelance',    icon: TrendingUp,  color: 'bg-blue-500'    },
  { value: 'Investment',   icon: TrendingUp,  color: 'bg-purple-500'  },
  { value: 'Business',     icon: DollarSign,  color: 'bg-indigo-500'  },
  { value: 'Other Income', icon: DollarSign,  color: 'bg-teal-500'    },
];
const ALL_CATS    = [...EXPENSE_CATS, ...INCOME_CATS];
const FILTER_CATS = [
  { value: 'all', label: 'All' },
  ...EXPENSE_CATS.map(c => ({ value: c.value, label: c.value })),
  { value: 'Income', label: 'Income' },
];

const BLANK_FORM = {
  title:           '',           // matches DB: title
  category:        'Food',
  transactionType: 'expense',    // maps to DB: type
  amount:          '',
  transactionDate: new Date().toISOString().split('T')[0],  // matches DB: transactionDate
  transactionTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), // matches DB: transactionTime
  status:          'completed',
  merchant:        '',
  description:     '',           // matches DB: description
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getCatInfo = (cat) =>
  ALL_CATS.find(c => c.value === cat) || { icon: DollarSign, color: 'bg-gray-400' };

const CatIcon = ({ category, size = 'w-5 h-5' }) => {
  const { icon: Icon } = getCatInfo(category);
  return <Icon className={`${size} text-white`} />;
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, val, trend, trendColor, iconBg }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center text-gray-700`}>{icon}</div>
        <span className={`text-sm font-semibold ${trendColor}`}>{trend}</span>
      </div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold mt-1">{val}</p>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExpenseTrackerDashboard() {
  const [sidebarOpen,      setSidebarOpen]      = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm,       setSearchTerm]       = useState('');
  const [transactions,     setTransactions]     = useState([]);
  const [loading,          setLoading]          = useState(true);

  // Modal state
  const [showAddModal,  setShowAddModal]  = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTx,     setEditingTx]    = useState(null);
  const [viewingTx,     setViewingTx]    = useState(null);

  // Form state
  const [form,     setForm]     = useState(BLANK_FORM);
  const [errors,   setErrors]   = useState({});
  const [saving,   setSaving]   = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  // ── Fetch all transactions ──
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllTransactions();
        setTransactions(res?.data?.data || []);
      } catch (e) {
        console.error('Fetch error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Stats — DB stores amount as positive always, type = "income"/"expense" ──
  const totalIncome   = transactions.filter(t => t.type === 'income').reduce((s, t)  => s + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const totalBalance  = totalIncome - totalExpenses;
  const budgetLeft    = totalBalance * 0.3;

  // ── Filter ──
  const filtered = transactions.filter(t => {
    const title    = (t.title    || '').toLowerCase();
    const merchant = (t.merchant || '').toLowerCase();
    const term     = searchTerm.toLowerCase();
    const catMatch = selectedCategory === 'all'
      || t.category === selectedCategory
      || (selectedCategory === 'Income' && t.type === 'income');
    return catMatch && (title.includes(term) || merchant.includes(term));
  });

  // ── Validate ──
  const validate = () => {
    const e = {};
    if (!form.title.trim())                        e.title  = 'Title is required';
    if (!form.amount || Number(form.amount) <= 0)  e.amount = 'Enter a valid amount';
    if (!form.transactionDate)                     e.date   = 'Date is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  // ── Open Add ──
  const openAdd = () => {
    setEditingTx(null);
    setForm(BLANK_FORM);
    setErrors({});
    setApiError('');
    setShowAddModal(true);
  };

  // ── Open Edit ──
  const openEdit = (t) => {
    setEditingTx(t);
    setForm({
      title:           t.title        || '',
      category:        t.category     || 'Food',
      transactionType: t.type         || 'expense',
      amount:          String(Math.abs(Number(t.amount))),
      transactionDate: t.transactionDate || '',
      transactionTime: t.transactionTime || '',
      status:          t.status       || 'completed',
      merchant:        t.merchant     || '',
      description:     t.description  || '',
    });
    setErrors({});
    setApiError('');
    setShowAddModal(true);
  };

  // ── Build payload exactly matching DB fields ──
  const buildPayload = () => {
    const cats    = form.transactionType === 'income' ? INCOME_CATS : EXPENSE_CATS;
    const catInfo = cats.find(c => c.value === form.category) || cats[0];
    return {
      title:           form.title.trim(),
      merchant:        form.merchant.trim() || form.title.trim(),
      amount:          Math.abs(Number(form.amount)),  // DB stores positive, type determines +/-
      type:            form.transactionType,            // "income" or "expense"
      category:        form.transactionType === 'income' ? null : form.category, // income has no category per your DB comment
      transactionDate: form.transactionDate,
      transactionTime: form.transactionTime || null,
      description:     form.description.trim() || null,
      status:          form.status,
      color:           catInfo.color,
    };
  };

  // ── Save (Add or Edit) ──
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setApiError('');
    const payload = buildPayload();

    console.log('🚀 Sending payload to backend:', JSON.stringify(payload, null, 2));

    try {
      if (editingTx) {
        const id = editingTx._id || editingTx.id;
        await updateTransaction(id, payload);
        setTransactions(prev =>
          prev.map(t => (t.id || t._id) === id ? { ...t, ...payload } : t)
        );
      } else {
        const res   = await saveTransaction(payload);

        // Use the record returned from DB so we have the real id
        const saved = res?.data?.data || res?.data || { ...payload, id: Date.now() };
        setTransactions(prev => [saved, ...prev]);
      }
      setShowAddModal(false);
      setForm(BLANK_FORM);
    } catch (e) {
      console.error('Save error:', e);
      const msg = e?.response?.data?.message
        || e?.response?.data?.error
        || 'Something went wrong. Please try again.';
      setApiError(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (t) => {
    if (!window.confirm('Delete this transaction?')) return;
    const id = t._id || t.id;
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(tx => (tx._id || tx.id) !== id));
      setShowViewModal(false);
    } catch (e) {
      console.error('Delete error:', e);
      alert(e?.response?.data?.message || 'Failed to delete. Please try again.');
    }
  };

  const f    = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));
  const icls = (err) =>
    `w-full p-4 bg-gray-50 rounded-xl outline-none border-2 transition-all ${
      err ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-emerald-500'
    }`;

  // ── Display amount with sign based on type ──
  const displayAmount = (t) => {
    const amt = Math.abs(Number(t.amount)).toFixed(2);
    return t.type === 'income' ? `+$${amt}` : `-$${amt}`;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>

        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <Menu />
            </button>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openAdd}
              className="bg-emerald-600 text-white flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline font-bold">Add Transaction</span>
            </button>
            <div
              onClick={() => navigate('/profile')}
              className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-emerald-600 transition-colors"
            >
              JD
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<DollarSign />}   label="Total Balance"  val={`$${totalBalance.toFixed(2)}`}  trend="+12.5%" trendColor="text-emerald-600" iconBg="bg-emerald-100" />
            <StatCard icon={<TrendingDown />} label="Total Expenses" val={`$${totalExpenses.toFixed(2)}`} trend="-8.2%"  trendColor="text-red-600"     iconBg="bg-red-100"     />
            <StatCard icon={<TrendingUp />}   label="Total Income"   val={`$${totalIncome.toFixed(2)}`}   trend="+5.8%"  trendColor="text-blue-600"    iconBg="bg-blue-100"    />
            <StatCard icon={<Wallet />}        label="Budget Left"    val={`$${budgetLeft.toFixed(2)}`}    trend="78%"    trendColor="text-purple-600"  iconBg="bg-purple-100"  />
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {FILTER_CATS.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat.value
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400 animate-pulse">Loading transactions...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <p className="text-lg font-medium">No transactions found</p>
                <p className="text-sm mt-1">Try adjusting your filters or add a new transaction</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      {['Transaction', 'Category', 'Status', 'Amount', 'Actions'].map(h => (
                        <th key={h} className={`p-6 ${h === 'Amount' ? 'text-right' : h === 'Actions' ? 'text-center' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map(t => {
                      const { color } = getCatInfo(t.category);
                      const rowColor  = t.color || color;
                      return (
                        <tr key={t.id || t._id} className="hover:bg-gray-50/50 transition-all">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 ${rowColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <CatIcon category={t.category || (t.type === 'income' ? 'Salary' : 'Food')} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{t.title}</p>
                                <p className="text-xs text-gray-400">
                                  {t.transactionDate}{t.transactionTime ? ` • ${t.transactionTime}` : ''}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${rowColor} text-white`}>
                              {t.category || t.type}
                            </span>
                          </td>
                          <td className="p-6">
                            <span className={`text-xs font-bold capitalize ${t.status === 'completed' ? 'text-green-600' : 'text-amber-500'}`}>
                              {t.status}
                            </span>
                          </td>
                          <td className={`p-6 text-right font-bold text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {displayAmount(t)}
                          </td>
                          <td className="p-6">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => { setViewingTx(t); setShowViewModal(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button onClick={() => openEdit(t)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(t)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">{editingTx ? 'Edit' : 'Add'} Transaction</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

              {/* Type toggle */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Transaction Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'expense', label: 'Expense', Icon: TrendingDown, active: 'bg-red-500'     },
                    { type: 'income',  label: 'Income',  Icon: TrendingUp,   active: 'bg-emerald-500' },
                  ].map(({ type, label, Icon, active }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm(prev => ({
                        ...prev,
                        transactionType: type,
                        category: type === 'income' ? 'Salary' : 'Food',
                      }))}
                      className={`p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        form.transactionType === type
                          ? `${active} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <Field label={form.transactionType === 'income' ? 'Income Source *' : 'Transaction Title *'} error={errors.title}>
                <input
                  type="text"
                  placeholder={form.transactionType === 'income' ? 'e.g., Monthly Salary' : 'e.g., Grocery Shopping'}
                  className={icls(errors.title)}
                  value={form.title}
                  onChange={f('title')}
                />
              </Field>

              {/* Category + Amount */}
              <div className="grid grid-cols-2 gap-4">
                {form.transactionType === 'expense' && (
                  <Field label="Category *">
                    <select className={icls(false)} value={form.category} onChange={f('category')}>
                      {EXPENSE_CATS.map(c => (
                        <option key={c.value} value={c.value}>{c.value}</option>
                      ))}
                    </select>
                  </Field>
                )}
                {form.transactionType === 'income' && (
                  <Field label="Income Type *">
                    <select className={icls(false)} value={form.category} onChange={f('category')}>
                      {INCOME_CATS.map(c => (
                        <option key={c.value} value={c.value}>{c.value}</option>
                      ))}
                    </select>
                  </Field>
                )}
                <Field label="Amount * ($)" error={errors.amount}>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className={icls(errors.amount)}
                    value={form.amount}
                    onChange={f('amount')}
                  />
                </Field>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date *" error={errors.date}>
                  <input type="date" className={icls(errors.date)} value={form.transactionDate} onChange={f('transactionDate')} />
                </Field>
                <Field label="Time">
                  <input type="time" className={icls(false)} value={form.transactionTime} onChange={f('transactionTime')} />
                </Field>
              </div>

              {/* Merchant + Status */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Merchant (Optional)">
                  <input type="text" placeholder="e.g., Whole Foods" className={icls(false)} value={form.merchant} onChange={f('merchant')} />
                </Field>
                <Field label="Status">
                  <select className={icls(false)} value={form.status} onChange={f('status')}>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </Field>
              </div>

              {/* Description */}
              <Field label="Description (Optional)">
                <textarea
                  rows="3"
                  placeholder="Add any notes..."
                  className={`${icls(false)} resize-none`}
                  value={form.description}
                  onChange={f('description')}
                />
              </Field>

              {/* API Error */}
              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 text-center font-medium">
                  ⚠️ {apiError}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : editingTx ? 'Update Transaction' : 'Save Transaction'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── View Modal ── */}
      {showViewModal && viewingTx && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                <div className={`w-16 h-16 ${viewingTx.color || getCatInfo(viewingTx.category).color} rounded-2xl flex items-center justify-center`}>
                  <CatIcon category={viewingTx.category || (viewingTx.type === 'income' ? 'Salary' : 'Food')} size="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{viewingTx.title}</h3>
                  <p className="text-sm text-gray-500">{viewingTx.merchant || '—'}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 divide-y divide-gray-50">
                <DetailRow label="Amount" value={
                  <span className={`font-bold text-xl ${viewingTx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {displayAmount(viewingTx)}
                  </span>
                } />
                <DetailRow label="Type" value={
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${viewingTx.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
                    {viewingTx.type}
                  </span>
                } />
                {viewingTx.category && (
                  <DetailRow label="Category" value={
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${viewingTx.color || getCatInfo(viewingTx.category).color} text-white`}>
                      {viewingTx.category}
                    </span>
                  } />
                )}
                <DetailRow label="Date"   value={viewingTx.transactionDate || '—'} />
                {viewingTx.transactionTime && <DetailRow label="Time" value={viewingTx.transactionTime} />}
                <DetailRow label="Status" value={
                  <span className={`text-sm font-bold capitalize ${viewingTx.status === 'completed' ? 'text-green-600' : 'text-amber-500'}`}>
                    {viewingTx.status}
                  </span>
                } />
                {viewingTx.description && <DetailRow label="Description" value={viewingTx.description} />}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowViewModal(false); openEdit(viewingTx); }}
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(viewingTx)}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 flex items-center justify-center gap-2 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}