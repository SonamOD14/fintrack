import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SuperAdminDashboard() {
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('token'); // Your auth token
  const API_URL = 'http://localhost:5000/api'; // Your backend URL

  // Fetch all data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);

      // Fetch users
      const usersRes = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(usersRes.data.users);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/ban`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh user list
      fetchDashboardData();
      alert('User banned successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to ban user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAllUsers(allUsers.filter(u => u.id !== userId));
      alert('User deleted!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
  
      {/* Stats Section */}
      {stats && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Stats</h2>
          <p>Total Users: {stats.totalUsers}</p>
          <p>Active Users: {stats.activeUsers}</p>
          {/* Add more stats fields depending on your API */}
        </div>
      )}
  
      {/* Users Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map(user => (
              <tr key={user.id}>
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleBanUser(user.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Ban
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}