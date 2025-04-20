// User related types
export type UserType = 'transport' | 'factory';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  company: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  profileImage?: string;
  verified: boolean;
  rating: number;
  createdAt: string;
}

// Transport related types
export interface Vehicle {
  id: string;
  ownerId: string;
  registrationNumber: string;
  type: 'truck' | 'trailer' | 'container';
  capacity: number; // in tons
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  make: string;
  model: string;
  yearOfManufacture: number;
  available: boolean;
}

// Route related types
export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
}

export interface Route {
  id: string;
  createdBy: string; // factory owner ID
  source: Location;
  destination: Location;
  distance: number; // in km
  estimatedDuration: number; // in hours
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  loadType: string;
  weight: number;
  specialRequirements?: string[];
  createdAt: string;
  departureDate: string;
}

// Bidding related types
export interface Bid {
  id: string;
  routeId: string;
  transporterId: string;
  vehicleId: string;
  amount: number;
  currency: 'INR' | 'USD';
  estimatedDuration: number; // in hours
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  notes?: string;
  createdAt: string;
}

// Shipment related types
export interface Shipment {
  id: string;
  routeId: string;
  bidId: string;
  transporterId: string;
  factoryOwnerId: string;
  vehicleId: string;
  status: 'scheduled' | 'in_transit' | 'delivered' | 'cancelled';
  departureTime?: string;
  arrivalTime?: string;
  currentLocation?: Location;
  tracking?: {
    lastUpdated: string;
    lat: number;
    lng: number;
  };
  paymentStatus: 'pending' | 'partial' | 'completed';
  documents: {
    invoice?: string;
    lading?: string;
    receipt?: string;
  };
  rating?: {
    transport?: number;
    factory?: number;
  };
  createdAt: string;
} 