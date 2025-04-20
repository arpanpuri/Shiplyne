import { useState } from 'react';
import { useRouteBidContext } from '@/context/RouteBidContext';
import { MapPin, Calendar, Clock, Package, Truck as TruckIcon, Filter, DollarSign, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Route } from '@/lib/types';
import { getVehiclesByOwner } from '@/lib/mockData';
import { Button } from '@/components/ui/button';

// Add this interface to fix the TypeScript error for the dialog element
declare global {
  interface HTMLDialogElement {
    showModal(): void;
  }
}

export function AvailableRoutes() {
  const { routes, setRoutes, bids } = useRouteBidContext();
  const { setBids } = useRouteBidContext();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [bidAmount, setBidAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Filtering options
  const [filters, setFilters] = useState({
    location: '',
    loadType: '',
    weight: '',
  });

  // Mock user ID - in a real app, this would come from authentication
  const currentUserId = 'user1';

  // Get available vehicles for the current user
  const userVehicles = getVehiclesByOwner(currentUserId);

  // Only show open routes for bidding
  const filteredRoutes = routes.filter(route => {
    if (route.status !== 'open') return false;
    const matchesLocation = !filters.location || 
      route.source.city.toLowerCase().includes(filters.location.toLowerCase()) ||
      route.destination.city.toLowerCase().includes(filters.location.toLowerCase());

    const matchesLoadType = !filters.loadType || 
      route.loadType.toLowerCase().includes(filters.loadType.toLowerCase());

    const matchesWeight = !filters.weight || 
      (Number(filters.weight) <= route.weight);

    return matchesLocation && matchesLoadType && matchesWeight;
  });

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoute || !selectedVehicle) return;
    // Add bid to shared context
    setBids(prev => [
      ...prev,
      {
        id: `bid-${Date.now()}`,
        routeId: selectedRoute.id,
        transporterId: currentUserId,
        vehicleId: selectedVehicle,
        amount: Number(bidAmount),
        currency: 'INR',
        estimatedDuration: selectedRoute.estimatedDuration,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    ]);
    alert(`Bid submitted: ₹${bidAmount} for route from ${selectedRoute.source.city} to ${selectedRoute.destination.city}`);
    resetBidForm();
  };

  const resetBidForm = () => {
    setShowBidForm(false);
    setSelectedRoute(null);
    setSelectedVehicle('');
    setBidAmount('');
    setNotes('');
  };

  const formatDateString = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Delete route handler (for demo, allow delete for all routes)
  const handleDeleteRoute = (routeId: string) => {
    setRoutes(prev => prev.filter(route => route.id !== routeId));
  };

  // Helper to get assigned routes for this transport owner
  const assignedRoutes = routes.filter(route => {
    if (route.status !== 'assigned') return false;
    const acceptedBid = bids.find(bid => bid.routeId === route.id && bid.status === 'accepted');
    return acceptedBid && acceptedBid.transporterId === currentUserId;
  });

  // Helper to get completed routes for this transport owner
  const completedRoutes = routes.filter(route => {
    if (route.status !== 'completed') return false;
    const acceptedBid = bids.find(bid => bid.routeId === route.id && bid.status === 'accepted');
    return acceptedBid && acceptedBid.transporterId === currentUserId;
  });

  return (
    <div>
      {/* Assigned Routes Section */}
      {assignedRoutes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-700 mb-4">Assigned Routes</h2>
          <div className="grid grid-cols-1 gap-4">
            {assignedRoutes.map(route => {
              const acceptedBid = bids.find(bid => bid.routeId === route.id && bid.status === 'accepted');
              return (
                <div key={route.id} className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-4">
                    <MapPin className="h-5 w-5 text-red-500" />
                    <span className="font-semibold">{route.source.city} → {route.destination.city}</span>
                    <span className="ml-auto font-medium text-green-900">Bid: ₹{acceptedBid?.amount}</span>
                  </div>
                  <div className="text-sm text-green-900 mt-2">
                    <div>Vehicle ID: {acceptedBid?.vehicleId}</div>
                    <div>Departure: {formatDateString(route.departureDate)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Completed Routes Section */}
      {completedRoutes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Completed Routes</h2>
          <div className="grid grid-cols-1 gap-4">
            {completedRoutes.map(route => {
              const acceptedBid = bids.find(bid => bid.routeId === route.id && bid.status === 'accepted');
              return (
                <div key={route.id} className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                  <div className="flex items-center gap-4">
                    <MapPin className="h-5 w-5 text-red-500" />
                    <span className="font-semibold">{route.source.city} → {route.destination.city}</span>
                    <span className="ml-auto font-medium text-gray-900">Bid: ₹{acceptedBid?.amount}</span>
                  </div>
                  <div className="text-sm text-gray-800 mt-2">
                    <div>Vehicle ID: {acceptedBid?.vehicleId}</div>
                    <div>Departure: {formatDateString(route.departureDate)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Available Routes</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
            onClick={() => (document.getElementById('filter-modal') as HTMLDialogElement | null)?.showModal()}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Filter Modal */}
      <dialog id="filter-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Filter Routes</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter city name"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Load Type</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="E.g. Electronics, Machinery"
                value={filters.loadType}
                onChange={(e) => setFilters({...filters, loadType: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Capacity (tons)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter weight capacity"
                value={filters.weight}
                onChange={(e) => setFilters({...filters, weight: e.target.value})}
              />
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-2">
                <Button onClick={() => setFilters({ location: '', loadType: '', weight: '' })}>
                  Reset
                </Button>
                <Button variant="outline" type="submit">
                  Apply
                </Button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* Routes List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRoutes.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Package className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No routes available</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later or adjust your filters.</p>
          </div>
        ) : (
          filteredRoutes.map((route) => (
            <div 
              key={route.id} 
              className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                        <div className="ml-2">
                          <p className="text-sm text-gray-500">From</p>
                          <p className="font-semibold">{route.source.city}, {route.source.state}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <div className="ml-2">
                          <p className="text-sm text-gray-500">To</p>
                          <p className="font-semibold">{route.destination.city}, {route.destination.state}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="ml-2 text-sm text-gray-600">{formatDateString(route.departureDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="ml-2 text-sm text-gray-600">{route.estimatedDuration} hours</span>
                    </div>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="ml-2 text-sm text-gray-600">{route.loadType}</span>
                    </div>
                    <div className="flex items-center">
                      <TruckIcon className="h-4 w-4 text-gray-500" />
                      <span className="ml-2 text-sm text-gray-600">{route.weight} tons</span>
                    </div>
                  </div>
                  
                  {route.specialRequirements && route.specialRequirements.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Special Requirements:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {route.specialRequirements.map((req, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 md:mt-0 md:ml-6 flex md:flex-col justify-between items-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="font-semibold">{route.distance} km</p>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <Button
                      onClick={() => {
                        setSelectedRoute(route);
                        setShowBidForm(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Place Bid
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-red-600"
                      onClick={() => handleDeleteRoute(route.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bid Form Modal */}
      {showBidForm && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold mb-4">Place a Bid</h3>
              <button 
                onClick={resetBidForm}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-red-500" />
                  <span className="ml-2 font-medium">{selectedRoute.source.city}</span>
                </div>
                <span className="text-gray-500">→</span>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-500" />
                  <span className="ml-2 font-medium">{selectedRoute.destination.city}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Departure Date</p>
                  <p className="font-medium">{formatDateString(selectedRoute.departureDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Load Type</p>
                  <p className="font-medium">{selectedRoute.loadType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium">{selectedRoute.weight} tons</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Distance</p>
                  <p className="font-medium">{selectedRoute.distance} km</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleBidSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Vehicle</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    required
                  >
                    <option value="">Select a vehicle</option>
                    {userVehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} - {vehicle.type} ({vehicle.capacity} tons)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bid Amount (₹)</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      className="w-full py-2 px-8 border border-gray-300 rounded-md"
                      placeholder="Enter your bid amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Add any additional information about your bid"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={resetBidForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Bid
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 