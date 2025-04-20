import { User, Vehicle, Route, Bid, Shipment, Location } from './types';
import { format, addDays, subDays } from 'date-fns';

// Mock Locations
export const mockLocations: Location[] = [
  {
    id: 'loc1',
    name: 'Delhi Warehouse',
    address: '123 Industrial Area, Phase 1',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    lat: 28.6139,
    lng: 77.2090,
  },
  {
    id: 'loc2',
    name: 'Mumbai Port',
    address: '456 Dock Yard Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    lat: 19.0760,
    lng: 72.8777,
  },
  {
    id: 'loc3',
    name: 'Bangalore Tech Park',
    address: '789 Electronic City',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560100',
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: 'loc4',
    name: 'Chennai Manufacturing Hub',
    address: '321 Industrial Estate',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    lat: 13.0827,
    lng: 80.2707,
  },
  {
    id: 'loc5',
    name: 'Hyderabad Distribution Center',
    address: '654 Hitech City',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    lat: 17.3850,
    lng: 78.4867,
  },
  {
    id: 'loc6',
    name: 'Kolkata Depot',
    address: '987 Salt Lake',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700001',
    lat: 22.5726,
    lng: 88.3639,
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Raj Transport Services',
    email: 'raj@transport.com',
    phone: '+91 9876543210',
    userType: 'transport',
    company: 'Raj Transport Pvt Ltd',
    address: '123 Truck Terminal',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    verified: true,
    rating: 4.8,
    createdAt: '2023-01-10T10:00:00.000Z',
  },
  {
    id: 'user2',
    name: 'Singh Logistics',
    email: 'singh@logistics.com',
    phone: '+91 9876543211',
    userType: 'transport',
    company: 'Singh Logistics Solutions',
    address: '456 Transport Nagar',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
    verified: true,
    rating: 4.5,
    createdAt: '2023-02-15T11:00:00.000Z',
  },
  {
    id: 'user3',
    name: 'Star Manufacturing',
    email: 'info@starmanufacturing.com',
    phone: '+91 9876543212',
    userType: 'factory',
    company: 'Star Manufacturing Industries',
    address: '789 Industrial Area',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560100',
    profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
    verified: true,
    rating: 4.7,
    createdAt: '2023-03-20T12:00:00.000Z',
  },
  {
    id: 'user4',
    name: 'Tech Products Ltd',
    email: 'contact@techproducts.com',
    phone: '+91 9876543213',
    userType: 'factory',
    company: 'Tech Products Limited',
    address: '321 Tech Park',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    verified: true,
    rating: 4.6,
    createdAt: '2023-04-25T13:00:00.000Z',
  },
  {
    id: 'user5',
    name: 'Speedy Freight Carriers',
    email: 'info@speedyfreight.com',
    phone: '+91 9876543214',
    userType: 'transport',
    company: 'Speedy Freight Carriers Pvt Ltd',
    address: '654 Transport Hub',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    verified: true,
    rating: 4.4,
    createdAt: '2023-05-30T14:00:00.000Z',
  },
];

// Mock Vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: 'veh1',
    ownerId: 'user1',
    registrationNumber: 'DL01AB1234',
    type: 'truck',
    capacity: 20,
    dimensions: {
      length: 24,
      width: 8,
      height: 8,
    },
    make: 'Tata',
    model: 'LPT 3118',
    yearOfManufacture: 2020,
    available: true,
  },
  {
    id: 'veh2',
    ownerId: 'user1',
    registrationNumber: 'DL01CD5678',
    type: 'container',
    capacity: 30,
    dimensions: {
      length: 40,
      width: 8,
      height: 8.5,
    },
    make: 'Ashok Leyland',
    model: 'U-3518',
    yearOfManufacture: 2021,
    available: true,
  },
  {
    id: 'veh3',
    ownerId: 'user2',
    registrationNumber: 'MH02EF9012',
    type: 'trailer',
    capacity: 40,
    dimensions: {
      length: 48,
      width: 8.5,
      height: 9,
    },
    make: 'BharatBenz',
    model: 'HDT 4928',
    yearOfManufacture: 2022,
    available: true,
  },
  {
    id: 'veh4',
    ownerId: 'user2',
    registrationNumber: 'MH02GH3456',
    type: 'truck',
    capacity: 15,
    dimensions: {
      length: 20,
      width: 7.5,
      height: 7.5,
    },
    make: 'Eicher',
    model: 'Pro 5016',
    yearOfManufacture: 2019,
    available: true,
  },
  {
    id: 'veh5',
    ownerId: 'user5',
    registrationNumber: 'TG03IJ7890',
    type: 'container',
    capacity: 25,
    dimensions: {
      length: 32,
      width: 8,
      height: 8,
    },
    make: 'Mahindra',
    model: 'Blazo X 28',
    yearOfManufacture: 2020,
    available: true,
  },
];

// Get current date in ISO format
const now = new Date();
const formatDate = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

// Mock Routes
export const mockRoutes: Route[] = [
  {
    id: 'route1',
    createdBy: 'user3',
    source: mockLocations[0], // Delhi
    destination: mockLocations[1], // Mumbai
    distance: 1400,
    estimatedDuration: 24,
    status: 'open',
    loadType: 'Electronics',
    weight: 15,
    specialRequirements: ['Fragile', 'Temperature Controlled'],
    createdAt: formatDate(subDays(now, 5)),
    departureDate: formatDate(addDays(now, 7)),
  },
  {
    id: 'route2',
    createdBy: 'user3',
    source: mockLocations[2], // Bangalore
    destination: mockLocations[3], // Chennai
    distance: 350,
    estimatedDuration: 6,
    status: 'open',
    loadType: 'Machinery',
    weight: 25,
    specialRequirements: ['Heavy Equipment'],
    createdAt: formatDate(subDays(now, 3)),
    departureDate: formatDate(addDays(now, 5)),
  },
  {
    id: 'route3',
    createdBy: 'user4',
    source: mockLocations[1], // Mumbai
    destination: mockLocations[4], // Hyderabad
    distance: 700,
    estimatedDuration: 12,
    status: 'assigned',
    loadType: 'Pharmaceuticals',
    weight: 10,
    specialRequirements: ['Temperature Controlled', 'Security'],
    createdAt: formatDate(subDays(now, 10)),
    departureDate: formatDate(addDays(now, 2)),
  },
  {
    id: 'route4',
    createdBy: 'user4',
    source: mockLocations[3], // Chennai
    destination: mockLocations[5], // Kolkata
    distance: 1700,
    estimatedDuration: 30,
    status: 'open',
    loadType: 'Textiles',
    weight: 18,
    createdAt: formatDate(subDays(now, 2)),
    departureDate: formatDate(addDays(now, 10)),
  },
  {
    id: 'route5',
    createdBy: 'user3',
    source: mockLocations[4], // Hyderabad
    destination: mockLocations[0], // Delhi
    distance: 1500,
    estimatedDuration: 26,
    status: 'open',
    loadType: 'Automotive Parts',
    weight: 22,
    createdAt: formatDate(subDays(now, 1)),
    departureDate: formatDate(addDays(now, 8)),
  },
];

// Mock Bids
export const mockBids: Bid[] = [
  {
    id: 'bid1',
    routeId: 'route1',
    transporterId: 'user1',
    vehicleId: 'veh1',
    amount: 75000,
    currency: 'INR',
    estimatedDuration: 24,
    status: 'pending',
    notes: 'Can provide real-time tracking',
    createdAt: formatDate(subDays(now, 4)),
  },
  {
    id: 'bid2',
    routeId: 'route1',
    transporterId: 'user2',
    vehicleId: 'veh3',
    amount: 82000,
    currency: 'INR',
    estimatedDuration: 22,
    status: 'pending',
    notes: 'Premium service with expedited delivery',
    createdAt: formatDate(subDays(now, 3)),
  },
  {
    id: 'bid3',
    routeId: 'route2',
    transporterId: 'user5',
    vehicleId: 'veh5',
    amount: 25000,
    currency: 'INR',
    estimatedDuration: 6,
    status: 'pending',
    createdAt: formatDate(subDays(now, 2)),
  },
  {
    id: 'bid4',
    routeId: 'route3',
    transporterId: 'user1',
    vehicleId: 'veh2',
    amount: 45000,
    currency: 'INR',
    estimatedDuration: 12,
    status: 'accepted',
    notes: 'Temperature-controlled container available',
    createdAt: formatDate(subDays(now, 8)),
  },
  {
    id: 'bid5',
    routeId: 'route3',
    transporterId: 'user2',
    vehicleId: 'veh4',
    amount: 50000,
    currency: 'INR',
    estimatedDuration: 11,
    status: 'rejected',
    createdAt: formatDate(subDays(now, 7)),
  },
  {
    id: 'bid6',
    routeId: 'route4',
    transporterId: 'user5',
    vehicleId: 'veh5',
    amount: 95000,
    currency: 'INR',
    estimatedDuration: 28,
    status: 'pending',
    notes: 'Long-haul specialist with experienced drivers',
    createdAt: formatDate(subDays(now, 1)),
  },
];

// Mock Shipments
export const mockShipments: Shipment[] = [
  {
    id: 'ship1',
    routeId: 'route3',
    bidId: 'bid4',
    transporterId: 'user1',
    factoryOwnerId: 'user4',
    vehicleId: 'veh2',
    status: 'in_transit',
    departureTime: formatDate(subDays(now, 1)),
    currentLocation: {
      id: 'current1',
      name: 'Highway NH8',
      address: 'Halfway between Mumbai and Hyderabad',
      city: 'Solapur',
      state: 'Maharashtra',
      pincode: '413001',
      lat: 17.6599,
      lng: 75.9064,
    },
    tracking: {
      lastUpdated: formatDate(new Date()),
      lat: 17.6599,
      lng: 75.9064,
    },
    paymentStatus: 'partial',
    documents: {
      invoice: 'invoice_ship1.pdf',
      lading: 'lading_ship1.pdf',
    },
    createdAt: formatDate(subDays(now, 5)),
  },
];

// Helper function to get users by type
export const getUsersByType = (type: 'transport' | 'factory') => {
  return mockUsers.filter(user => user.userType === type);
};

// Helper function to get vehicles by owner ID
export const getVehiclesByOwner = (ownerId: string) => {
  return mockVehicles.filter(vehicle => vehicle.ownerId === ownerId);
};

// Helper function to get routes by status
export const getRoutesByStatus = (status: Route['status']) => {
  return mockRoutes.filter(route => route.status === status);
};

// Helper function to get bids by transport owner ID
export const getBidsByTransporter = (transporterId: string) => {
  return mockBids.filter(bid => bid.transporterId === transporterId);
};

// Helper function to get bids by route ID
export const getBidsByRoute = (routeId: string) => {
  return mockBids.filter(bid => bid.routeId === routeId);
};

// Helper function to get shipments by transport owner ID
export const getShipmentsByTransporter = (transporterId: string) => {
  return mockShipments.filter(shipment => shipment.transporterId === transporterId);
};

// Helper function to get shipments by factory owner ID
export const getShipmentsByFactory = (factoryOwnerId: string) => {
  return mockShipments.filter(shipment => shipment.factoryOwnerId === factoryOwnerId);
}; 