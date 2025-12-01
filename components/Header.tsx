import React from 'react';

export const Header: React.FC = () => {
  return (
    <nav className="w-full py-6 px-4 flex justify-between items-center bg-transparent absolute top-0 z-50">
      <div className="text-white font-serif text-2xl font-bold tracking-wider drop-shadow-md">
        Pura Vida Wedding
      </div>
      <div className="hidden md:flex gap-6 text-white font-sans text-sm tracking-widest uppercase">
        <a href="#" className="hover:text-jungle-200 transition">Details</a>
        <a href="#" className="hover:text-jungle-200 transition">Registry</a>
        <a href="#" className="hover:text-jungle-200 transition">RSVP</a>
      </div>
    </nav>
  );
};