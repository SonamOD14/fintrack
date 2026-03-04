import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Menu, Bell, ChevronDown, Download, BarChart3,
  PieChart as PieIcon, Target, Activity, Loader2
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { getTransactionAnalyticsApi } from '../services/api';

export default function ExpenseTrackerAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    categoryData: [], // For Radar & Pie
    monthlyData: [],  // For Cash Flow Area Chart
    metrics: { avgSpend: 0, savingsRate: 0, peakDay: 'N/A' }
  });

  // Color palette for the Pie Chart
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const handleExport = () => {
    if (!analyticsData.monthlyData.length) return;

    // Convert monthly data to CSV
    const headers = ["Month", "Income", "Expenses"];
    const rows = analyticsData.monthlyData.map(m => [
      m.month,
      m.income,
      m.expenses
    ]);

    const csvContent =
      [headers, ...rows]
        .map(r => r.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "fintrack-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getTransactionAnalyticsApi();
      if (response.data.success) {
        // We assume the backend returns categoryData and monthlyData as discussed
        setAnalyticsData({
          categoryData: response.data.categoryData,
          monthlyData: response.data.monthlyData,
          metrics: calculateMetrics(response.data)
        });
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Optional: Simple frontend calculation for the top cards
  const calculateMetrics = (data) => {
    const totalExpense = data.monthlyData.reduce((sum, m) => sum + m.expenses, 0);
    const totalIncome = data.monthlyData.reduce((sum, m) => sum + m.income, 0);
    const avgSpend = data.monthlyData.length ? (totalExpense / data.monthlyData.length).toFixed(0) : 0;
    const savingsRate = totalIncome ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;

    return {
      avgSpend: `$${avgSpend}`,
      savingsRate: `${savingsRate}%`,
      peakDay: "Calculated"
    };
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700">
                Live Analytics
              </h1>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-sm"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </header>

        <main className="p-8 space-y-8">
          {/* Section 1: Dynamic Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard title="Avg Monthly Spend" value={analyticsData.metrics.avgSpend} trend="Live" icon={<Activity />} color="emerald" />
            <MetricCard title="Savings Rate" value={analyticsData.metrics.savingsRate} trend="Real-time" icon={<Target />} color="blue" />
            <MetricCard title="Status" value="Active" sub="Account Synced" icon={<BarChart3 />} color="purple" />
          </div>

          {/* Section 2: Cash Flow (Real Data) */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900">Cash Flow Overview</h2>
              <p className="text-gray-500">Income, Expenses, and Net Savings trend</p>
            </div>

            {/* We set a fixed height here to ensure Recharts can calculate the area */}
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {/* Adding a key based on data length forces the chart to 
                  re-render as soon as data arrives from the API 
                */}
                <AreaChart
                  data={analyticsData.monthlyData}
                  key={`chart-${analyticsData.monthlyData.length}`}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8' }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8' }}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#colorInc)"
                    animationDuration={1000}
                  />

                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    strokeWidth={3}
                    fill="url(#colorExp)"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* Section 3: Distribution Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Spending DNA (Radar) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
              <h3 className="text-lg font-bold mb-4 self-start">Spending DNA</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={analyticsData.categoryData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 12 }} />
                    <Radar dataKey="amount" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Allocation (Pie) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Allocation</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryData}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="amount"
                      nameKey="category"
                    >
                      {analyticsData.categoryData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Sub-components kept from your original code but updated for dynamic props
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
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
