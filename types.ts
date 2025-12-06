export interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerNight: number;
  rating: number;
  image: string;
  amenities: string[];
  reviews: number;
}

export interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  customerName: string;
  bookedAt: string;
}

export type ViewState = 'HOME' | 'SEARCH_RESULTS' | 'MY_BOOKINGS';
