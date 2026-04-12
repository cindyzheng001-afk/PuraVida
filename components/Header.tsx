import React from 'react';
import logo from './logo.png';

export const Header: React.FC = () => {
  return (
    <nav className="w-full py-6 px-4 flex justify-between items-center bg-transparent absolute top-0 z-50">
      <div className="flex items-center gap-3">
        <img 
          src={logo} 
          alt="AC Logo" 
          className="h-40 md:h-56 w-auto drop-shadow-sm"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="hidden md:flex gap-6 text-jungle-900 font-sans text-sm tracking-widest uppercase">
        <a 
          href="https://www.InFrickinLove.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-jungle-600 transition flex items-center gap-2"
        >
          Wedding Website
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
    </nav>
  );
};