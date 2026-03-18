import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, CheckCircle2, Users, ArrowDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user, loading } = useAuth();
  
  if (loading) return null;

  return (
    <div className="flex-grow flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="container mx-auto px-4 pt-24 pb-16 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors duration-200">
            Manage your projects with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
              effortless clarity
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed transition-colors duration-200">
            ProjectFlow helps teams plan, track, and collaborate on software projects. 
            Keep your tasks organized and ship faster without the chaos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-1">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-1">
                  Start for free
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white rounded-xl font-bold border border-slate-200 dark:border-slate-700 transition shadow-sm">
                  Sign In
                </Link>
              </>
            )}
          </div>
          
          {/* Spacer to give breathing room before features */}
          <div className="pb-32"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20 relative z-10 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800/40 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition shadow-sm">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
              <LayoutDashboard size={28} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Intuitive Boards</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">Visualize your workflow with customizable Kanban boards. Move tasks effortlessly and keep everyone on the same page.</p>
          </div>
          <div className="bg-white dark:bg-slate-800/40 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition shadow-sm">
            <div className="w-14 h-14 bg-teal-100 dark:bg-teal-500/20 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 size={28} className="text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Track Progress</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">Set priorities and deadlines. Always know what's coming up and what needs your attention right now.</p>
          </div>
          <div className="bg-white dark:bg-slate-800/40 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition shadow-sm">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Users size={28} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Built for Teams</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">Collaborate seamlessly. Assign tasks, track progress, and celebrate your successful project completions together.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
