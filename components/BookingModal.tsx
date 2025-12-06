import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Calendar } from 'lucide-react';
import { Hotel, SearchParams } from '../types';

interface BookingModalProps {
  hotel: Hotel;
  searchParams: SearchParams;
  onClose: () => void;
  onConfirm: (customerName: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ hotel, searchParams, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate nights
  const start = new Date(searchParams.checkIn);
  const end = new Date(searchParams.checkOut);
  const timeDiff = Math.abs(end.getTime() - start.getTime());
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;
  const total = hotel.pricePerNight * nights;
  const tax = total * 0.12;
  const grandTotal = total + tax;

  const handleConfirm = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      // Wait a moment so user sees success message, then close/redirect via callback
      setTimeout(() => {
        onConfirm(name);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        {step === 1 ? (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Confirm Booking</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex gap-4 mb-6">
                <img src={hotel.image} alt={hotel.name} className="w-24 h-24 object-cover rounded-lg" />
                <div>
                  <h3 className="font-bold text-slate-900">{hotel.name}</h3>
                  <p className="text-sm text-slate-500">{hotel.location}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{searchParams.checkIn} — {searchParams.checkOut}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg mb-6 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>${hotel.pricePerNight} x {nights} nights</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes & Fees (12%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-lg">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter guest name"
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                   <div className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500">
                      <CreditCard className="w-5 h-5" />
                      <span>**** **** **** 4242</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button 
                onClick={handleConfirm}
                disabled={!name || isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-bold flex justify-center items-center gap-2 ${
                  !name || isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 shadow-lg'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Complete Reservation</>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
            <p className="text-slate-500">
              You are all set, {name}. A confirmation email has been sent to you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;