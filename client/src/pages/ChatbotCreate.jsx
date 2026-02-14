import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const templates = [
  {
    id: 'blank',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    label: 'Blank',
    desc: 'Start from scratch',
    values: {
      name: '',
      systemPrompt: '',
      welcomeMessage: 'Hello! How can I help you?',
      primaryColor: '#2563eb',
      businessInfo: '',
    },
  },
  {
    id: 'support',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    label: 'Support Bot',
    desc: 'Customer service & help desk',
    values: {
      name: 'Support Bot',
      systemPrompt: 'You are a friendly and helpful customer support agent. Help users solve their problems step by step. Be empathetic, patient, and clear in your responses. If you don\'t know the answer, let the user know you\'ll escalate their issue to a human agent. Keep responses concise but thorough.',
      welcomeMessage: 'Hi there! I\'m here to help. What can I assist you with today?',
      primaryColor: '#2563eb',
      businessInfo: '',
    },
  },
  {
    id: 'sales',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Sales Bot',
    desc: 'Lead generation & product info',
    values: {
      name: 'Sales Bot',
      systemPrompt: 'You are a persuasive but honest sales assistant. Help potential customers understand the value of our products and services. Answer questions about features, pricing, and benefits. Gently guide conversations toward a purchase decision. Collect the visitor\'s name and email when they show interest. Be enthusiastic but never pushy.',
      welcomeMessage: 'Welcome! Looking for the right solution? I\'d love to help you find the perfect fit.',
      primaryColor: '#059669',
      businessInfo: '',
    },
  },
  {
    id: 'onboarding',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    label: 'Onboarding Bot',
    desc: 'Guide new users through setup',
    values: {
      name: 'Onboarding Bot',
      systemPrompt: 'You are a friendly onboarding assistant that helps new users get started with our platform. Walk them through key features step by step, answer setup questions, and share tips to help them get the most value. Be encouraging and celebrate their progress. Use simple language and avoid jargon.',
      welcomeMessage: 'Welcome aboard! I\'ll help you get set up. Ready to get started?',
      primaryColor: '#7c3aed',
      businessInfo: '',
    },
  },
  {
    id: 'faq',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
    label: 'FAQ Bot',
    desc: 'Answer common questions',
    values: {
      name: 'FAQ Bot',
      systemPrompt: 'You are a knowledgeable FAQ assistant. Answer frequently asked questions clearly and concisely. If a question is outside your knowledge, say so honestly and suggest the user contact support. Structure your answers with short paragraphs. Provide links or references when helpful.',
      welcomeMessage: 'Got a question? I\'m here to help! Ask me anything.',
      primaryColor: '#0891b2',
      businessInfo: '',
    },
  },
  {
    id: 'booking',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    label: 'Booking Bot',
    desc: 'Schedule appointments & demos',
    values: {
      name: 'Booking Bot',
      systemPrompt: 'You are a scheduling assistant that helps visitors book appointments, demos, or consultations. Ask for their name, preferred date and time, and the purpose of their meeting. Be polite and confirm all details before finalizing. Suggest alternative times if the requested slot seems busy. Keep the conversation focused and efficient.',
      welcomeMessage: 'Hi! Would you like to schedule a meeting or demo? I can help you find the perfect time.',
      primaryColor: '#dc2626',
      businessInfo: '',
    },
  },
];

export default function ChatbotCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(true);

  useEffect(() => {
    if (user?.plan === 'premium') {
      api.get('/chatbots')
        .then((res) => {
          if (res.data.length >= 1) setLimitReached(true);
        })
        .catch(console.error)
        .finally(() => setCheckingLimit(false));
    } else {
      setCheckingLimit(false);
    }
  }, [user]);

  const selectTemplate = (template) => {
    setSelectedTemplate(template.id);
    setForm({ ...template.values });
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/chatbots', form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create chatbot');
    }
  };

  if (user?.plan !== 'premium') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-1">Premium Required</p>
          <p className="text-sm text-gray-500 mb-5">Upgrade to Premium to create chatbots.</p>
          <a
            href="/#pricing"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-600"
          >
            Upgrade Now
          </a>
        </div>
      </div>
    );
  }

  if (checkingLimit) {
    return <div className="max-w-3xl mx-auto p-6 text-center text-gray-400">Loading...</div>;
  }

  if (limitReached) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-1">Chatbot Limit Reached</p>
          <p className="text-sm text-gray-500 mb-5">Your Premium plan is limited to 1 chatbot.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Create Chatbot</h1>
      <p className="text-gray-500 text-sm mb-6">Pick a template to get started, then customize everything to your needs.</p>

      {/* Template grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => selectTemplate(t)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              selectedTemplate === t.id
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              selectedTemplate === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {t.icon}
            </div>
            <p className="font-semibold text-sm text-gray-900">{t.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Form — shown after template selection */}
      {form && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={update('name')}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Support Bot"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
            <textarea
              value={form.systemPrompt}
              onChange={update('systemPrompt')}
              required
              rows={5}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="You are a helpful customer support agent for..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
            <input
              type="text"
              value={form.welcomeMessage}
              onChange={update('welcomeMessage')}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Information</label>
            <textarea
              value={form.businessInfo}
              onChange={update('businessInfo')}
              rows={4}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Opening hours, services, location, pricing..."
            />
            <p className="text-xs text-gray-400 mt-1">This info will be available to your chatbot when answering questions.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={update('primaryColor')}
                className="h-10 w-14 rounded border cursor-pointer"
              />
              <span className="text-sm text-gray-500">{form.primaryColor}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Create Chatbot
            </button>
            <button
              type="button"
              onClick={() => { setForm(null); setSelectedTemplate(null); }}
              className="border px-5 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Back to Templates
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="border px-5 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
