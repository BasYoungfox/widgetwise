import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ChatbotEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [embedCode, setEmbedCode] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMessages, setPreviewMessages] = useState([]);
  const [previewInput, setPreviewInput] = useState('');
  const [previewSending, setPreviewSending] = useState(false);
  const [previewSessionId] = useState(() => 'preview_' + Math.random().toString(36).slice(2));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    api.get(`/chatbots/${id}`)
      .then((res) => {
        const { name, systemPrompt, welcomeMessage, primaryColor, businessInfo } = res.data;
        setForm({ name, systemPrompt, welcomeMessage, primaryColor, businessInfo: businessInfo || '' });
      })
      .catch(() => navigate('/'));

    api.get(`/chatbots/${id}/embed`)
      .then((res) => setEmbedCode(res.data.embed))
      .catch(() => {});
  }, [id, navigate]);

  if (!form) {
    return <div className="max-w-2xl mx-auto p-6 text-gray-500">Loading...</div>;
  }

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/chatbots/${id}`, form);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update');
    }
  };

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied!');
  };

  const scrollPreview = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const sendPreviewMessage = async () => {
    const text = previewInput.trim();
    if (!text || previewSending) return;
    setPreviewInput('');
    setPreviewMessages((prev) => [...prev, { role: 'user', content: text }]);
    setPreviewSending(true);
    scrollPreview();

    try {
      const res = await api.post(`/chat/${id}`, { message: text, sessionId: previewSessionId });
      setPreviewMessages((prev) => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch {
      setPreviewMessages((prev) => [...prev, { role: 'assistant', content: 'Failed to get a response.' }]);
    }
    setPreviewSending(false);
    scrollPreview();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Chatbot</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {saved && <p className="text-green-600 text-sm">Saved!</p>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={update('name')}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
          <textarea
            value={form.systemPrompt}
            onChange={update('systemPrompt')}
            required
            rows={4}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="border px-5 py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </form>

      {/* Widget Preview */}
      <div className="mt-8 bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">Widget Preview</h2>
        <p className="text-sm text-gray-500 mb-4">Click the circle to expand. You can send real messages to test your chatbot.</p>
        <div className="relative bg-gray-100 rounded-lg border" style={{ height: '420px' }}>
          {/* Chat window */}
          <div
            className="absolute bottom-20 right-4 w-72 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden transition-all duration-300"
            style={{
              transform: previewOpen ? 'scale(1) translateY(0)' : 'scale(0) translateY(10px)',
              transformOrigin: 'bottom right',
              opacity: previewOpen ? 1 : 0,
              height: '300px',
              pointerEvents: previewOpen ? 'auto' : 'none',
            }}
          >
            <div className="px-4 py-3 text-white text-sm font-semibold shrink-0" style={{ backgroundColor: form.primaryColor }}>
              {form.name}
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
              <div className="bg-gray-100 rounded-xl rounded-bl px-3 py-2 text-sm text-gray-700 inline-block self-start max-w-[85%]">
                {form.welcomeMessage}
              </div>
              {previewMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-xl text-sm max-w-[85%] break-words ${
                    msg.role === 'user'
                      ? 'self-end text-white rounded-br'
                      : 'self-start bg-gray-100 text-gray-700 rounded-bl'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: form.primaryColor } : undefined}
                >
                  {msg.content}
                </div>
              ))}
              {previewSending && (
                <div className="self-start bg-gray-100 text-gray-400 italic rounded-xl rounded-bl px-3 py-2 text-sm">
                  Typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="px-3 py-3 border-t flex gap-2 shrink-0">
              <input
                type="text"
                value={previewInput}
                onChange={(e) => setPreviewInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendPreviewMessage()}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <button
                onClick={sendPreviewMessage}
                disabled={previewSending || !previewInput.trim()}
                className="px-3 py-2 rounded-lg text-white text-sm disabled:opacity-50"
                style={{ backgroundColor: form.primaryColor }}
              >
                Send
              </button>
            </div>
          </div>
          {/* Circle toggle button */}
          <button
            onClick={() => setPreviewOpen(!previewOpen)}
            className="absolute bottom-4 right-4 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110"
            style={{ backgroundColor: form.primaryColor }}
          >
            {previewOpen ? (
              <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Embed Code */}
      {embedCode && (
        <div className="mt-8 bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3">Embed Code</h2>
          <p className="text-sm text-gray-500 mb-3">
            Paste this snippet into your website's HTML to add the chat widget.
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
            {embedCode}
          </pre>
          <button
            onClick={copyEmbed}
            className="mt-3 border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
