import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { SearchParams } from '../types';

interface HeroProps {
  onSearch: (params: SearchParams) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ destination, checkIn, checkOut, guests });
  };

  return (
    <div className="relative h-[600px] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury Hotel" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Find Your Next Escape
          </h1>
          <p className="text-lg md:text-xl text-slate-200">
            Discover thousands of luxury hotels and resorts worldwide.
          </p>
        </div>

        {/* Search Bar */}
        <form 
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 items-end"
        >
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Destination</label>
            <div className="relative bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Where are you going?"
                className="w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Check-in</label>
              <div className="relative bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Check-out</label>
              <div className="relative bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-32">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Guests</label>
            <div className="relative bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <Users className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="number" 
                min="1"
                max="10"
                className="w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full md:w-auto bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
          >
            <Search className="h-5 w-5" />
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;