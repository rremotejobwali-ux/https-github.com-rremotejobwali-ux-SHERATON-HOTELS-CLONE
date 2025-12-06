import React from 'react';
import { Star, MapPin, Wifi, Coffee, Utensils, Droplets } from 'lucide-react';
import { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
  onBook: (hotel: Hotel) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onBook }) => {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wi-fi': return <Wifi className="w-3 h-3" />;
      case 'breakfast included': return <Coffee className="w-3 h-3" />;
      case 'restaurant': return <Utensils className="w-3 h-3" />;
      case 'pool': return <Droplets className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group">
      <div className="relative overflow-hidden h-48">
        <img 
          src={hotel.image} 
          alt={hotel.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-bold text-sm text-slate-900">{hotel.rating}</span>
          <span className="text-xs text-slate-500">({hotel.reviews})</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{hotel.name}</h3>
            <div className="flex items-center text-slate-500 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="line-clamp-1">{hotel.location}</span>
            </div>
          </div>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
          {hotel.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md border border-slate-200">
              {getAmenityIcon(amenity)}
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded-md border border-slate-200">
              +{hotel.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-2xl font-bold text-blue-900">${hotel.pricePerNight}</span>
            <span className="text-slate-400 text-sm">/night</span>
          </div>
          <button 
            onClick={() => onBook(hotel)}
            className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors shadow-md"
          >
            Select Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;