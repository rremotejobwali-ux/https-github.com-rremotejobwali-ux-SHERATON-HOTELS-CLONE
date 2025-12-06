import React from 'react';
import { Hotel, Menu, User, Briefcase } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  setView: (view: ViewState) => void;
  bookingCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ setView, bookingCount }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => setView('HOME')}
          >
            <div className="p-2 bg-blue-900 rounded-lg group-hover:bg-blue-800 transition-colors">
              <Hotel className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">LuxeStay</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setView('HOME')} 
              className="text-slate-600 hover:text-blue-900 font-medium transition-colors"
            >
              Explore
            </button>
            <button 
              onClick={() => setView('MY_BOOKINGS')}
              className="relative text-slate-600 hover:text-blue-900 font-medium transition-colors flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              My Bookings
              {bookingCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {bookingCount}
                </span>
              )}
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Sign In</span>
            </button>
          </div>

          <div className="md:hidden flex items-center">
             <button onClick={() => setView('MY_BOOKINGS')} className="mr-4 relative">
                <Briefcase className="w-6 h-6 text-slate-600" />
                {bookingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {bookingCount}
                  </span>
                )}
             </button>
            <button className="text-slate-600">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;