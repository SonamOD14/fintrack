import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Camera, Save, CheckCircle, Trophy, Star, 
  DollarSign, Award, AlertCircle, LogOut, Loader2, Target 
} from 'lucide-react';
import { getProfileApi, updateProfileApi } from '../services/api';

const ACHIEVEMENTS = [
  { title: 'First Transaction', desc: 'Logged your first expense',         icon: CheckCircle, earned: true,  date: 'Jan 15, 2024' },
  { title: 'Budget Master',     desc: 'Stayed within budget for 3 months', icon: Trophy,      earned: true,  date: 'Mar 22, 2024' },
  { title: 'Savings Streak',   desc: 'Saved money for 30 days straight',  icon: Star,        earned: true,  date: 'Apr 8, 2024'  },
  { title: '100 Transactions', desc: 'Tracked 100 transactions',           icon: Star,        earned: true,  date: 'May 3, 2024'  },
  { title: 'Goal Achiever',    desc: 'Completed your first savings goal',  icon: Trophy,      earned: false, date: null           },
  { title: 'Money Saver',      desc: 'Saved over $10,000',                 icon: DollarSign,  earned: true,  date: 'May 28, 2024' },
];

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tab, setTab] = useState('Profile');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  // Matches your API: id, username, email, role, monthlyBudget
  const [form, setForm] = useState({
    username: '',
    email: '',
    monthlyBudget: '',
    role: 'user',
    profilePicture: null, // Keep this for UI, even if stored as string/base64
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfileApi();
      if (res.data.success) {
        const user = res.data.data;
        setForm({
          username: user.username || '',
          email: user.email || '',
          monthlyBudget: user.monthlyBudget || '',
          role: user.role || 'user',
          profilePicture: user.profilePicture || null,
        });
      }
    } catch (err) {
      notify('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!form.username.trim()) return notify('Username is required', 'error');
    
    setSaving(true);
    try {
      const res = await updateProfileApi({
        username: form.username,
        monthlyBudget: parseFloat(form.monthlyBudget) || 0,
        profilePicture: form.profilePicture
      });
      if (res.data.success) {
        notify('Profile updated successfully!');
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const initials = form.username.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden File Input */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" 
        onChange={(e) => {
          const reader = new FileReader();
          reader.onload = () => setForm({...form, profilePicture: reader.result});
          reader.readAsDataURL(e.target.files[0]);
        }} 
      />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-white font-semibold shadow-lg flex items-center gap-2 animate-bounce ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white shadow-sm sticky top-0 z-40 px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl font-bold transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </header>

        <main className="p-8 max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="bg-white rounded-[2.5rem] shadow-sm p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest">
                 {form.role}
               </span>
            </div>
            
            <div className="relative">
              {form.profilePicture ? (
                <img src={form.profilePicture} alt="avatar" className="w-32 h-32 rounded-[2rem] object-cover ring-8 ring-emerald-50" />
              ) : (
                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-4xl font-black">
                  {initials}
                </div>
              )}
              <button onClick={() => fileRef.current.click()} className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 text-emerald-600 hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center md:text-left space-y-1">
              <h2 className="text-3xl font-black text-gray-900">{form.username}</h2>
              <p className="text-gray-500 font-medium">{form.email}</p>
              <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">🏅</div>)}
                </div>
                <span className="text-xs text-gray-400 font-bold ml-2">3 Achievements Unlocked</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 border-b border-gray-200">
            {['Profile', 'Achievements'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`pb-4 text-sm font-bold transition-all relative ${tab === t ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>
                {t}
                {tab === t && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-full" />}
              </button>
            ))}
          </div>

          {tab === 'Profile' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 uppercase tracking-wider">Username</label>
                      <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} 
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl transition-all outline-none font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 uppercase tracking-wider">Email Address</label>
                      <input type="email" value={form.email} disabled 
                        className="w-full px-5 py-4 bg-gray-100 border-2 border-transparent rounded-2xl text-gray-400 cursor-not-allowed font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                       <Target className="w-4 h-4 text-emerald-500" /> Monthly Budget Goal ($)
                    </label>
                    <input type="number" value={form.monthlyBudget} onChange={e => setForm({...form, monthlyBudget: e.target.value})} 
                      placeholder="e.g. 2000"
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-emerald-700 text-xl" />
                  </div>

                  <button onClick={handleSave} disabled={saving} className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-3 disabled:opacity-50">
                    {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                    Update Profile Info
                  </button>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl">
                  <h4 className="font-bold text-emerald-400 mb-2">Pro Tip</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">Setting a realistic <b>Monthly Budget</b> helps us provide more accurate savings insights on your dashboard!</p>
                </div>
              </div>
            </div>
          ) : (
            /* Achievements Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map(a => (
                <div key={a.title} className={`p-6 rounded-[2rem] border-2 flex items-center gap-6 ${a.earned ? 'border-emerald-100 bg-white' : 'border-gray-100 bg-gray-50/50 opacity-60'}`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${a.earned ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-gray-200 text-gray-400'}`}>
                    <a.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h5 className="font-black text-gray-900">{a.title}</h5>
                    <p className="text-sm text-gray-500">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}