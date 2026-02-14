import { useState, useEffect } from 'react';
import api from '../api';

export default function BotHealth() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/chatbots/usage/stats')
      .then((res) => setUsage(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="bg-white rounded-xl border shadow-sm p-12 text-center text-gray-400">Loading...</div>;
  }

  if (!usage) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
        <p className="text-lg font-semibold text-gray-800 mb-1">Unable to load usage data</p>
        <p className="text-sm text-gray-500">Please try again later.</p>
      </div>
    );
  }

  const percentage = Math.min((usage.used / usage.limit) * 100, 100);
  const resetDate = new Date(usage.resetDate);
  const now = new Date();
  const daysUntilReset = Math.ceil((resetDate - now) / (1000 * 60 * 60 * 24));

  let barColor = 'bg-blue-500';
  if (percentage >= 90) barColor = 'bg-red-500';
  else if (percentage >= 70) barColor = 'bg-amber-500';

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Usage</h2>
        <p className="text-sm text-gray-500 mt-1">Track your monthly message usage across all chatbots.</p>
      </div>

      {/* Main usage card */}
      <div className="rounded-xl border p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Messages used</span>
          <span className="text-sm font-medium text-gray-900">{usage.used.toLocaleString()} / {usage.limit.toLocaleString()}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">{percentage.toFixed(1)}%</span>
          <span className="text-sm text-gray-500">
            Resets on {resetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {' '}({daysUntilReset} day{daysUntilReset !== 1 ? 's' : ''})
          </span>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Messages Used</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{usage.used.toLocaleString()}</p>
        </div>

        <div className="rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Remaining</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-green-50 text-green-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.max(usage.limit - usage.used, 0).toLocaleString()}</p>
        </div>

        <div className="rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Days Until Reset</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{daysUntilReset}</p>
        </div>
      </div>
    </div>
  );
}
