import { useState } from "react";
import { Wallet, TrendingUp, Home, User, LogOut, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/register");
  };

  const menuItems = [
    { icon: Home, redirect: "/dashboard", label: 'Dashboard' },
    { icon: TrendingUp, redirect: '/analytics', label: 'Analytics' },
    { icon: Wallet, redirect: "/budget", label: 'Budget' },
    { icon: User, redirect: "/profile", label: 'Profile' }
  ];

  return (
    <>
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-emerald-600 to-teal-700 text-white transition-all duration-300 z-50 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        
        {/* Brand */}
        <div className="p-6">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
            {sidebarOpen && <span className="font-extrabold text-xl tracking-tight">ExpenseTracker</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.redirect;
            return (
              <Link 
                key={index} 
                to={item.redirect}
                className={`flex items-center gap-4 px-6 py-4 transition-all relative group ${
                  isActive ? 'bg-white/20 border-r-4 border-white' : 'hover:bg-white/10'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-100 group-hover:text-white'}`} />
                {sidebarOpen && <span className={`font-medium ${isActive ? 'text-white' : 'text-emerald-50'}`}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* --- ENHANCED LOGOUT SECTION --- */}
        <div className="p-4 mt-auto">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className={`
              group relative flex items-center gap-4 w-full p-3 rounded-2xl transition-all duration-300
              bg-white/10 backdrop-blur-md border border-white/10
              hover:bg-red-500 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
              ${!sidebarOpen && 'justify-center'}
            `}
          >
            <div className="relative">
               <LogOut className="w-5 h-5 text-emerald-100 group-hover:text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            {sidebarOpen && (
              <div className="flex flex-col items-start">
                <span className="font-bold text-sm text-white">Logout</span>
                <span className="text-[10px] text-emerald-200 group-hover:text-red-100 transition-colors">End Session</span>
              </div>
            )}

            {/* Subtle Reflection Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </aside>

      {/* --- MODAL --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-10 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                 <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
                 <div className="relative w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                 </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Wait a moment!</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">Are you sure you want to sign out of your account?</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all hover:shadow-lg hover:shadow-red-200 active:scale-95"
                >
                  Yes, Log out
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                >
                  Stay logged in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;