import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4 transition-colors duration-200">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-wide">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          ProjectFlow
        </Link>
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {user ? (
            <>
              <span className="text-slate-700 dark:text-slate-300 hidden sm:inline-block">Hello, {user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition font-medium"
              >
                <LogOut size={18} /> <span className="hidden sm:inline-block">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition font-medium">Login</Link>
              <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition font-medium shadow-md shadow-emerald-500/10">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
