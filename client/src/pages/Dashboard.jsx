import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/chatbots')
      .then((res) => setChatbots(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/chatbots/${id}`);
      setChatbots((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert('Failed to delete chatbot');
    }
  };

  if (loading) {
    return <div className="bg-white rounded-xl border shadow-sm p-12 text-center text-gray-400">Loading...</div>;
  }

  if (chatbots.length === 0) {
    if (user?.plan !== 'premium') {
      return (
        <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-1">Upgrade to Premium</p>
          <p className="text-sm text-gray-500 mb-5">Upgrade to Premium to create your first chatbot.</p>
          <a
            href="/#pricing"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-600"
          >
            Upgrade Now
          </a>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-800 mb-1">No chatbots yet</p>
        <p className="text-sm text-gray-500 mb-5">Create your first chatbot to get started.</p>
        <Link
          to="/chatbots/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Chatbot
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">All Chatbots</h2>
          {user?.plan === 'premium' && (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {chatbots.length}/1 chatbots
            </span>
          )}
        </div>
        {user?.plan === 'premium' && chatbots.length < 1 && (
          <Link
            to="/chatbots/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Chatbot
          </Link>
        )}
      </div>
      <div className="grid gap-3">
        {chatbots.map((bot) => (
          <div key={bot.id} className="rounded-xl border p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-sm"
                style={{ backgroundColor: bot.primaryColor }}
              >
                {bot.name[0].toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{bot.name}</h2>
                <p className="text-sm text-gray-500">
                  {bot._count.conversations} conversation{bot._count.conversations !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/chatbots/${bot.id}/analytics`}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Analytics
              </Link>
              <Link
                to={`/chatbots/${bot.id}`}
                className="text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(bot.id, bot.name)}
                className="text-sm px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
