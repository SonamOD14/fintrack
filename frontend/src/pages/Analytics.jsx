import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Menu, Bell, ChevronDown, Download, BarChart3, 
  PieChart as PieIcon, Target, Activity 
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, 
  Cell, AreaChart, Area, Legend 
} from 'recharts';

export default function ExpenseTrackerAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState("6months");
  
  // Combine all data into a cohesive state
  const [data] = useState({
    // From Dashboard
    radarData: [
      { category: 'Food', amount: 850 },
      { category: 'Transport', amount: 420 },
      { category: 'Shopping', amount: 680 },
      { category: 'Entertainment', amount: 320 },
      { category: 'Healthcare', amount: 280 },
      { category: 'Bills', amount: 750 }
    ],
    pieData: [
      { name: 'Food', value: 850, color: '#10b981' },
      { name: 'Transport', value: 420, color: '#3b82f6' },
      { name: 'Shopping', value: 680, color: '#f59e0b' },
      { name: 'Entertainment', value: 320, color: '#ef4444' },
      { name: 'Healthcare', value: 280, color: '#8b5cf6' },
      { name: 'Bills', value: 750, color: '#06b6d4' }
    ],
    // From Analytics
    comparisonData: [
      { month: 'Jan', income: 8500, expenses: 3200, savings: 5300 },
      { month: 'Feb', income: 8800, expenses: 2800, savings: 6000 },
      { month: 'Mar', income: 9200, expenses: 3500, savings: 5700 },
      { month: 'Apr', income: 8700, expenses: 3200, savings: 5500 },
      { month: 'May', income: 9500, expenses: 2900, savings: 6600 },
      { month: 'Jun', income: 9000, expenses: 3300, savings: 5700 }
    ],
    budgetData: [
      { category: 'Food', budget: 1000, actual: 850 },
      { category: 'Transport', budget: 500, actual: 420 },
      { category: 'Shopping', budget: 800, actual: 680 },
      { category: 'Bills', budget: 800, actual: 750 }
    ]
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Modern Glass Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700">
                Analytics
              </h1>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl hover:from-emerald-700 hover:to-teal-800 transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </header>

        <main className="p-8 space-y-8">
          {/* Section 1: Top Level Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard title="Avg Monthly Spend" value="$3,150" trend="-5.2%" icon={<Activity />} color="emerald" />
            <MetricCard title="Savings Rate" value="63%" trend="+2.1%" icon={<Target />} color="blue" />
            <MetricCard title="Peak Spending" value="Saturday" sub="Avg $275" icon={<BarChart3 />} color="purple" />
          </div>

          {/* Section 2: The Big Picture (Income vs Expense) */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900">Cash Flow Overview</h2>
              <p className="text-gray-500">Income, Expenses, and Net Savings trend</p>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.comparisonData}>
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fill="url(#colorInc)" />
                  <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} fill="transparent" />
                  <Area type="monotone" dataKey="savings" stroke="#3B82F6" strokeWidth={3} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section 3: Bento Grid for Analysis Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Radar Chart (From Dashboard) - Takes 1 column */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
              <h3 className="text-lg font-bold mb-4 self-start">Spending DNA</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={data.radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 10 }} />
                    <Radar dataKey="amount" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart (From Dashboard) - Takes 1 column */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Allocation</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {data.pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Budget vs Actual (Original) - Takes 1 column */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Budget Precision</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.budgetData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} width={80} />
                    <Tooltip />
                    <Bar dataKey="budget" fill="#E2E8F0" radius={[0, 4, 4, 0]} barSize={10} />
                    <Bar dataKey="actual" fill="#10b981" radius={[0, 4, 4, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Sub-components for cleaner code
function MetricCard({ title, value, trend, icon, color }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600"
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</div>
        <span className="text-xs font-bold px-2 py-1 bg-gray-50 rounded-lg text-gray-500">{trend}</span>
      </div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-xl border border-gray-50 rounded-2xl">
        <p className="font-bold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};