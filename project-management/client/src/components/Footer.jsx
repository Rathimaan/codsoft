import React from 'react';
import { Instagram, Twitter, Facebook, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-6 w-full">
          <div className="flex-1 text-xs text-slate-500 max-w-sm text-center md:text-left">
            <p className="flex items-center gap-1 justify-center md:justify-start mb-1 text-slate-700 dark:text-slate-300 font-semibold">
              <Sparkles size={14} className="text-emerald-500" /> Terms & Conditions
            </p>
            By using ProjectFlow, you agree to our Terms of Service and Privacy Policy. All products and logos are properties of their respective owners.
          </div>
          
          <div className="flex-1 text-center text-sm text-slate-500 font-medium whitespace-nowrap">
            © {new Date().getFullYear()} ProjectFlow. All rights reserved.
          </div>
          
          <div className="flex-1 flex justify-center md:justify-end items-center gap-5 text-slate-500">
            <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition transform hover:scale-110">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition transform hover:scale-110">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition transform hover:scale-110">
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
