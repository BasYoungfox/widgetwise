import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const hasBanner = ['/', '/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/dashboard');
  const isBlue = hasBanner || location.pathname.startsWith('/chatbots');

  return (
    <nav className={hasBanner
      ? 'absolute top-0 left-0 right-0 z-50'
      : isBlue
        ? 'bg-gradient-to-r from-blue-600 to-indigo-700'
        : 'bg-white border-b border-gray-200'
    }>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isBlue ? 'bg-white/20' : 'bg-blue-600'}`}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
          </div>
          <span className={`text-lg font-bold ${isBlue ? 'text-white' : 'text-blue-600'}`}>
            Widget Wise
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {['/', '/login', '/register'].includes(location.pathname) && (
            <>
              <a href="#features" className="text-sm text-blue-100 hover:text-white transition-colors hidden sm:block">Features</a>
              <a href="#pricing" className="text-sm text-blue-100 hover:text-white transition-colors hidden sm:block">Pricing</a>
            </>
          )}
          <Link
            to={user ? '/dashboard' : '/login'}
            className={`text-sm font-medium ${isBlue ? 'text-white hover:text-blue-100' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {user ? 'Dashboard' : 'Login'}
          </Link>
          {user ? (
            <button
              onClick={logout}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isBlue
                  ? 'bg-white text-blue-700 hover:bg-blue-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/register"
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isBlue
                  ? 'bg-white text-blue-700 hover:bg-blue-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
