import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const togglePlan = async (id, currentPlan) => {
    const newPlan = currentPlan === 'free' ? 'premium' : 'free';
    try {
      await api.patch(`/admin/users/${id}/plan`, { plan: newPlan });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, plan: newPlan } : u)));
    } catch {
      alert('Failed to update plan');
    }
  };

  const deleteUser = async (id, email) => {
    if (!confirm(`Delete user "${email}"? This will also delete all their chatbots.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return <div className="bg-white rounded-xl border shadow-sm p-12 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {users.length} user{users.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Plan</th>
              <th className="pb-3 font-medium">Chatbots</th>
              <th className="pb-3 font-medium">Created</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-900">{u.name}</td>
                <td className="py-3 text-gray-600">{u.email}</td>
                <td className="py-3">
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                    u.plan === 'premium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {u.plan}
                  </span>
                </td>
                <td className="py-3 text-gray-600">{u._count.chatbots}</td>
                <td className="py-3 text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => togglePlan(u.id, u.plan)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      {u.plan === 'free' ? 'Make Premium' : 'Make Free'}
                    </button>
                    <button
                      onClick={() => deleteUser(u.id, u.email)}
                      disabled={u.email === currentUser?.email}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
