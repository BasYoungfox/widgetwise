import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function Analytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/analytics/${id}`)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6 text-gray-500">Loading...</div>;
  }

  if (!data) {
    return <div className="max-w-4xl mx-auto p-6 text-red-500">Failed to load analytics.</div>;
  }

  const maxCount = Math.max(...data.messagesPerDay.map((d) => d.count), 1);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-800">Back to Dashboard</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-1">Total Conversations</p>
          <p className="text-3xl font-bold">{data.totalConversations}</p>
        </div>
        <div className="bg-white border rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-1">Total Messages</p>
          <p className="text-3xl font-bold">{data.totalMessages}</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Messages per Day (Last 30 Days)</h2>
        {data.messagesPerDay.length === 0 ? (
          <p className="text-gray-500 text-sm">No messages yet.</p>
        ) : (
          <div className="flex items-end gap-1" style={{ height: '200px' }}>
            {data.messagesPerDay.map((day) => (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center justify-end group relative"
                style={{ height: '100%' }}
              >
                <div
                  className="w-full bg-blue-500 rounded-t-sm min-h-[2px] transition-all hover:bg-blue-600"
                  style={{ height: `${(day.count / maxCount) * 100}%` }}
                />
                <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {new Date(day.date).toLocaleDateString()}: {day.count} msgs
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
