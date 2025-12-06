import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HotelCard from './components/HotelCard';
import BookingModal from './components/BookingModal';
import { Hotel, SearchParams, ViewState, Booking } from './types';
import { HOTELS } from './services/mockData';
import { getDestinationInsight } from './services/geminiService';
import { SlidersHorizontal, Sparkles, MapPin, Calendar, User, SearchX } from 'lucide-react';

function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [hotels, setHotels] = useState<Hotel[]>(HOTELS);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(HOTELS);
  
  // Search State
  const [searchParams, setSearchParams] = useState<SearchParams>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  // UI State
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Filters & Sort
  const [sortBy, setSortBy] = useState<'recommended' | 'priceLow' | 'priceHigh' | 'rating'>('recommended');
  const [minRating, setMinRating] = useState<number>(0);

  // Load bookings from localStorage
  useEffect(() => {
    const savedBookings = localStorage.getItem('luxeStay_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  // Save bookings to localStorage
  useEffect(() => {
    localStorage.setItem('luxeStay_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...hotels];

    // Filter by destination if in search mode
    if (view === 'SEARCH_RESULTS' && searchParams.destination) {
      const term = searchParams.destination.toLowerCase();
      result = result.filter(h => 
        h.location.toLowerCase().includes(term) || 
        h.name.toLowerCase().includes(term)
      );
    }

    // Filter by Rating
    if (minRating > 0) {
      result = result.filter(h => h.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case 'priceLow':
        result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'priceHigh':
        result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // default is usually by id or existing order
        break;
    }

    setFilteredHotels(result);
  }, [hotels, view, searchParams, sortBy, minRating]);

  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    setView('SEARCH_RESULTS');
    
    // Fetch AI Insight
    setLoadingInsight(true);
    setAiInsight('');
    const insight = await getDestinationInsight(params.destination);
    setAiInsight(insight);
    setLoadingInsight(false);
  };

  const handleBookingConfirm = (customerName: string) => {
    if (!selectedHotel) return;

    const newBooking: Booking = {
      id: Date.now().toString(),
      hotelId: selectedHotel.id,
      hotelName: selectedHotel.name,
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      guests: searchParams.guests,
      totalPrice: selectedHotel.pricePerNight, // simplified for demo logic (actual calc in modal)
      customerName,
      bookedAt: new Date().toISOString()
    };

    setBookings([newBooking, ...bookings]);
    setSelectedHotel(null);
    setView('MY_BOOKINGS');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar setView={setView} bookingCount={bookings.length} />

      {view === 'HOME' && (
        <>
          <Hero onSearch={handleSearch} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Featured Stays</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {HOTELS.filter(h => h.rating >= 4.8).slice(0, 4).map(hotel => (
                <div key={hotel.id} className="h-[450px]">
                  <HotelCard hotel={hotel} onBook={() => {
                    // Pre-fill dummy dates if booking from home without search
                    if (!searchParams.checkIn) {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      const dayAfter = new Date();
                      dayAfter.setDate(dayAfter.getDate() + 3);
                      setSearchParams({
                        destination: hotel.location,
                        checkIn: tomorrow.toISOString().split('T')[0],
                        checkOut: dayAfter.toISOString().split('T')[0],
                        guests: 2
                      });
                    }
                    setSelectedHotel(hotel);
                  }} />
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-8 mt-16">All Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {HOTELS.map(hotel => (
                <div key={hotel.id} className="h-[450px]">
                  <HotelCard hotel={hotel} onBook={() => {
                     if (!searchParams.checkIn) {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      const dayAfter = new Date();
                      dayAfter.setDate(dayAfter.getDate() + 3);
                      setSearchParams({
                        destination: hotel.location,
                        checkIn: tomorrow.toISOString().split('T')[0],
                        checkOut: dayAfter.toISOString().split('T')[0],
                        guests: 2
                      });
                    }
                    setSelectedHotel(hotel);
                  }} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {view === 'SEARCH_RESULTS' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Summary & AI Insight */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Stays in <span className="text-blue-900 capitalize">{searchParams.destination}</span>
                </h2>
                <div className="flex items-center gap-4 text-slate-500 mt-2 text-sm">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {searchParams.checkIn} - {searchParams.checkOut}</span>
                  <span className="flex items-center gap-1"><User className="w-4 h-4" /> {searchParams.guests} Guests</span>
                </div>
              </div>
              <button 
                onClick={() => setView('HOME')}
                className="text-blue-900 font-medium hover:underline text-sm"
              >
                Change Search
              </button>
            </div>

            {/* AI Insight Card */}
            {(loadingInsight || aiInsight) && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl flex items-start gap-4 mb-8 shadow-sm">
                <div className="bg-white p-2 rounded-full shadow-sm mt-1">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Travel Insight</h3>
                  {loadingInsight ? (
                    <div className="h-4 bg-blue-200 rounded w-64 animate-pulse"></div>
                  ) : (
                    <p className="text-slate-700 leading-relaxed italic">"{aiInsight}"</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Filters Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filters:</span>
                </div>
                <select 
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.8">4.8+ Stars</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <select 
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredHotels.map(hotel => (
                <div key={hotel.id} className="h-[450px]">
                  <HotelCard hotel={hotel} onBook={setSelectedHotel} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchX className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No hotels found</h3>
              <p className="text-slate-500">Try changing your destination or removing some filters.</p>
              <button 
                onClick={() => {
                  setSearchParams(prev => ({ ...prev, destination: '' }));
                  setMinRating(0);
                }}
                className="mt-4 text-blue-900 font-medium hover:underline"
              >
                View all hotels
              </button>
            </div>
          )}
        </div>
      )}

      {view === 'MY_BOOKINGS' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <span className="p-2 bg-blue-100 rounded-lg"><User className="w-6 h-6 text-blue-900" /></span>
            My Bookings
          </h2>
          
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No bookings yet</h3>
              <p className="text-slate-500 mb-8">You haven't made any reservations. Time to plan your next trip!</p>
              <button 
                onClick={() => setView('HOME')}
                className="bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                Find a Hotel
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{booking.hotelName}</h3>
                        <p className="text-sm text-slate-500">Booking ID: #{booking.id.slice(-6)}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full">Confirmed</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Check-in</p>
                          <p className="font-medium text-slate-900">{booking.checkIn}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Check-out</p>
                          <p className="font-medium text-slate-900">{booking.checkOut}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-slate-600">Guest: <span className="font-medium text-slate-900">{booking.customerName}</span></span>
                      <button className="text-blue-900 text-sm font-bold hover:underline">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedHotel && (
        <BookingModal 
          hotel={selectedHotel} 
          searchParams={searchParams} 
          onClose={() => setSelectedHotel(null)} 
          onConfirm={handleBookingConfirm} 
        />
      )}
    </div>
  );
}

export default App;