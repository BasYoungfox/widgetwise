import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Now in public beta
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              AI chatbots for your website,{' '}
              <span className="text-blue-200">in minutes</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-10 max-w-lg">
              Create custom AI-powered chatbots, train them with your own instructions, and embed them anywhere with a single line of code.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-white text-blue-700 px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
              >
                Get started free
              </Link>
              <a
                href="#features"
                className="border border-white/30 text-white px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-white/10 transition-colors"
              >
                See how it works
              </a>
            </div>
          </div>
          {/* Floating widget mockup */}
          <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
            <div className="w-72 bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-blue-600 px-5 py-4 text-white font-semibold text-sm">Support Bot</div>
              <div className="p-4 space-y-3">
                <div className="bg-gray-100 rounded-xl rounded-bl px-3 py-2 text-sm text-gray-700 max-w-[85%]">
                  Hi there! How can I help you today?
                </div>
                <div className="bg-blue-600 text-white rounded-xl rounded-br px-3 py-2 text-sm ml-auto max-w-[85%]">
                  How does pricing work?
                </div>
                <div className="bg-gray-100 rounded-xl rounded-bl px-3 py-2 text-sm text-gray-700 max-w-[85%]">
                  We offer a simple plan at $24.99/mo with 1 website and 1,000 messages included!
                </div>
              </div>
              <div className="px-4 py-3 border-t flex gap-2">
                <div className="flex-1 border rounded-lg px-3 py-2 text-sm text-gray-400">Type a message...</div>
                <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium">Send</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              From creation to deployment in minutes. No coding required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                ),
                title: 'Custom AI Chatbots',
                desc: 'Define a system prompt and personality. Your chatbot responds exactly the way you want it to — tailored to your brand.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
                title: 'One-Line Embed',
                desc: 'Copy a single script tag and paste it into your site. The chat widget appears instantly — no frameworks needed.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                title: 'Fully Customizable',
                desc: 'Match your brand with custom colors, welcome messages, and chatbot names. Make it look like it was built in-house.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Analytics Dashboard',
                desc: 'Track conversations, messages, and usage over time. Understand how visitors interact with your chatbot.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Powered by GPT',
                desc: 'Built on OpenAI\'s GPT models for fast, natural conversations. Your visitors get instant, intelligent answers.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Secure & Private',
                desc: 'JWT authentication, encrypted passwords, and session isolation. Your data and your customers\' data stays safe.',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-7 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              One plan. Everything included. Scale as you grow.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-xl overflow-hidden">
              <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold tracking-wide uppercase">
                Most Popular
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Premium Plan</h3>
                <p className="text-sm text-gray-500 mb-6">Everything you need to get started</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-extrabold text-gray-900">$24.99</span>
                  <span className="text-gray-500 text-lg">/month</span>
                </div>
                <ul className="space-y-3.5 mb-8">
                  {[
                    '1 website included',
                    '1,000 messages included',
                    'Custom branding & colors',
                    'Analytics dashboard',
                    'One-line embed widget',
                    'GPT-powered responses',
                    'Email support',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="block w-full text-center bg-blue-600 text-white py-3.5 rounded-lg font-semibold text-base hover:bg-blue-700 transition-colors"
                >
                  Start free trial
                </Link>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Need more? Extra 1,000 messages for just $10.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
