import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { usersApi, DemoUser } from '../../api/users.api';

export const Header: React.FC = () => {
  const { currentUser, setCurrentUser, logout } = useUserStore();
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    if (users.length > 0) { setShowSelector(true); return; }
    setIsLoadingUsers(true);
    try {
      const data = await usersApi.getDemoUsers();
      setUsers(data);
      setShowSelector(true);
    } catch { /* silent */ } finally {
      setIsLoadingUsers(false);
    }
  };

  // Close selector on outside click
  useEffect(() => {
    if (!showSelector) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('#user-selector-container')) setShowSelector(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSelector]);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="SneakerDrop home">
            <span className="text-2xl" aria-hidden="true">👟</span>
            <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-indigo-400 transition-colors">
              Sneaker<span className="text-indigo-400">Drop</span>
            </span>
          </Link>

          {/* User selector */}
          <div id="user-selector-container" className="relative">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400 hidden sm:block">Playing as</span>
                <button
                  id="btn-user-selector"
                  onClick={fetchUsers}
                  className="flex items-center gap-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-3 py-2 transition-colors"
                  aria-expanded={showSelector}
                  aria-haspopup="listbox"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-200">{currentUser.name}</span>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                id="btn-select-user"
                onClick={fetchUsers}
                disabled={isLoadingUsers}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
              >
                {isLoadingUsers ? 'Loading...' : 'Select User'}
              </button>
            )}

            {/* Dropdown */}
            {showSelector && (
              <div
                className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-slide-up"
                role="listbox"
                aria-label="Select demo user"
              >
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Demo Users</p>
                </div>
                {users.map((user) => (
                  <button
                    key={user.id}
                    role="option"
                    aria-selected={currentUser?.id === user.id}
                    onClick={() => { setCurrentUser(user); setShowSelector(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-800 transition-colors ${currentUser?.id === user.id ? 'bg-indigo-600/10' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    {currentUser?.id === user.id && (
                      <svg className="w-4 h-4 text-indigo-400 ml-auto" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
                {currentUser && (
                  <div className="border-t border-slate-800">
                    <button
                      onClick={() => { logout(); setShowSelector(false); }}
                      className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-slate-800 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
