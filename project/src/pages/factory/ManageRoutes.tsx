import { useState } from 'react';
import { useRouteBidContext } from '@/context/RouteBidContext';
import { MapPin, Calendar, Clock, Package, Truck as TruckIcon, Plus, Pencil, Trash2, User, Star } from 'lucide-react';
import { format, parseISO, addDays } from 'date-fns';
import { Route, Bid } from '@/lib/types';
import { mockLocations } from '@/lib/mockData';
import { Button } from '@/components/ui/button';

export function ManageRoutes() {
  // ...existing code...
  // Handler to mark a route as completed
  const handleMarkCompleted = (routeId: string) => {
    setRoutes((prevRoutes: Route[]) => prevRoutes.map((route: Route) =>
      route.id === routeId ? { ...route, status: 'completed' } : route
    ));
  };
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [showBidsModal, setShowBidsModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    sourceId: '',
    destinationId: '',
    departureDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    loadType: '',
    weight: '',
    specialRequirements: '',
  });
  
  // Mock user ID - in a real app, this would come from authentication
  const currentUserId = 'user3';
  
  // Shared routes and bids context
  const { routes, setRoutes, bids, setBids } = useRouteBidContext();
  // Filter routes created by this factory owner
  const userRoutes = routes.filter(route => route.createdBy === currentUserId);
  // Helper to get bids for a route from context
  const getBidsByRoute = (routeId: string) => bids.filter(bid => bid.routeId === routeId);
  // Helper to get assigned bid for a route
  const getAssignedBid = (routeId: string) => bids.find((bid: Bid) => bid.routeId === routeId && bid.status === 'accepted');
  
  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    // Create a new route object
    const source = mockLocations.find(loc => loc.id === formData.sourceId);
    const destination = mockLocations.find(loc => loc.id === formData.destinationId);
    if (!source || !destination) {
      alert('Invalid source or destination');
      return;
    }
    const newRoute: Route = {
      id: `route-${Date.now()}`,
      source,
      destination,
      departureDate: formData.departureDate,
      estimatedDuration: 24, // Placeholder, could be calculated
      loadType: formData.loadType,
      weight: Number(formData.weight),
      specialRequirements: formData.specialRequirements
        ? formData.specialRequirements.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      createdBy: currentUserId,
      status: 'open',
      distance: 500, // Placeholder value
      createdAt: new Date().toISOString(),
    };
    setRoutes(prev => [...prev, newRoute]);
    alert(`Route created from ${getLocationName(formData.sourceId)} to ${getLocationName(formData.destinationId)}`);
    resetRouteForm();
  };

  const resetRouteForm = () => {
    setShowRouteForm(false);
    setFormData({
      sourceId: '',
      destinationId: '',
      departureDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      loadType: '',
      weight: '',
      specialRequirements: '',
    });
  };

  const getLocationName = (locationId: string) => {
    const location = mockLocations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown';
  };

  const formatDateString = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleViewBids = (route: Route) => {
    setSelectedRoute(route);
    setShowBidsModal(true);
  };

  const handleAcceptBid = (bid: Bid) => {
    // Accept selected bid, reject others, and assign route
    setRoutes((prevRoutes: Route[]) => prevRoutes.map((route: Route) => {
      if (route.id === bid.routeId) {
        return { ...route, status: 'assigned', assignedBidId: bid.id };
      }
      return route;
    }));
    setBids((prevBids: Bid[]) => prevBids.map((b: Bid) =>
      b.routeId === bid.routeId
        ? { ...b, status: b.id === bid.id ? 'accepted' : 'rejected' }
        : b
    ));

    // --- Add shipment to mockShipments (demo only, not persistent) ---
    try {
      // @ts-ignore
      const { mockShipments, mockRoutes } = require('@/lib/mockData');
      const assignedRoute = mockRoutes.find((route: any) => route.id === bid.routeId);
      if (assignedRoute) {
        mockShipments.push({
          id: `ship-${Date.now()}`,
          routeId: bid.routeId,
          bidId: bid.id,
          transporterId: bid.transporterId,
          factoryOwnerId: assignedRoute.createdBy,
          vehicleId: bid.vehicleId,
          status: 'scheduled',
          departureTime: assignedRoute.departureDate,
          paymentStatus: 'pending',
          documents: {},
          createdAt: new Date().toISOString()
        });
      }
    } catch (e) {
      // Fails silently in prod build, but works for mock/demo
    }
    // --- End shipment addition ---

    alert(`Bid accepted: ₹${bid.amount} from Transport ID: ${bid.transporterId}`);
    setShowBidsModal(false);
  };

  // Delete route handler
  const handleDeleteRoute = (routeId: string) => {
    setRoutes(prev => prev.filter(route => route.id !== routeId));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Manage Routes</h2>
        <Button 
          onClick={() => setShowRouteForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Route
        </Button>
      </div>

      {/* Routes List */}
      <div className="grid grid-cols-1 gap-6">
        {userRoutes.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Package className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No routes created</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first route to get transport bids.</p>
          </div>
        ) : (
          userRoutes.map((route) => {
            const bidsCount = getBidsByRoute(route.id).length;
            return (
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
                  
                  <div className="mt-6 md:mt-0 md:ml-6 flex flex-col items-end">
                    <div className="text-right mb-4">
                      <p className="text-sm text-gray-500">Status</p>
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          route.status === 'open' ? 'bg-green-100 text-green-800' :
                          route.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                          route.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {route.status === 'open' && (
                        <>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 text-sm"
                            onClick={() => handleViewBids(route)}
                          >
                            <User className="h-4 w-4" />
                            {bidsCount} {bidsCount === 1 ? 'Bid' : 'Bids'}
                          </Button>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-blue-600"
                              onClick={() => {/* Edit functionality */}}
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
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
                        </>
                      )}
                      
                      {route.status === 'assigned' && (
                        <div className="bg-blue-50 p-4 rounded-lg mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TruckIcon className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-blue-800">Assigned Transport</span>
                          </div>
                          {(() => {
                            const assignedBid = getAssignedBid(route.id);
                            if (!assignedBid) return <span className="text-gray-500">No transport assigned yet.</span>;
                            return (
                              <div className="text-sm text-blue-900">
                                <div><span className="font-medium">Transporter ID:</span> {assignedBid.transporterId}</div>
                                <div><span className="font-medium">Vehicle ID:</span> {assignedBid.vehicleId}</div>
                                <div><span className="font-medium">Bid Amount:</span> ₹{assignedBid.amount}</div>
                                <button
                                  className="mt-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                  onClick={() => handleMarkCompleted(route.id)}
                                >
                                  Mark as Completed
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                      
                      {route.status === 'completed' && (
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 text-sm"
                          onClick={() => {/* Rate transport */}}
                        >
                          <Star className="h-4 w-4" />
                          Rate Transport
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Route Modal */}
      {showRouteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold mb-4">Create New Route</h3>
              <button 
                onClick={resetRouteForm}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreateRoute}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Location</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.sourceId}
                    onChange={(e) => setFormData({...formData, sourceId: e.target.value})}
                    required
                  >
                    <option value="">Select a location</option>
                    {mockLocations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.city}, {location.state}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination Location</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.destinationId}
                    onChange={(e) => setFormData({...formData, destinationId: e.target.value})}
                    required
                  >
                    <option value="">Select a location</option>
                    {mockLocations.map((location) => (
                      <option 
                        key={location.id} 
                        value={location.id}
                        disabled={location.id === formData.sourceId}
                      >
                        {location.name} - {location.city}, {location.state}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.departureDate}
                    onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Load Type</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="E.g. Electronics, Machinery, etc."
                    value={formData.loadType}
                    onChange={(e) => setFormData({...formData, loadType: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (tons)</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter weight in tons"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="E.g. Temperature controlled, Fragile items, etc."
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                  />
                  <p className="mt-1 text-sm text-gray-500">Separate requirements with commas</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={resetRouteForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Route
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Bids Modal */}
      {showBidsModal && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold mb-4">Bids for Route</h3>
              <button 
                onClick={() => setShowBidsModal(false)}
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
            
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900">Bids Received</h4>
            </div>
            
            {/* Bids List */}
            <div className="space-y-4">
              {getBidsByRoute(selectedRoute.id).length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No bids received yet.</p>
                </div>
              ) : (
                getBidsByRoute(selectedRoute.id).map((bid) => (
                  <div 
                    key={bid.id} 
                    className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <User className="h-5 w-5 text-gray-500" />
                          <span className="ml-2 font-medium">Transport ID: {bid.transporterId}</span>
                          <div className="ml-2 flex items-center">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-600 ml-1">4.8</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                          <div>
                            <p className="text-sm text-gray-500">Vehicle</p>
                            <p className="text-sm">ID: {bid.vehicleId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Est. Duration</p>
                            <p className="text-sm">{bid.estimatedDuration} hours</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Bid Date</p>
                            <p className="text-sm">{formatDateString(bid.createdAt)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span 
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        {bid.notes && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Notes</p>
                            <p className="text-sm">{bid.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end justify-between">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Bid Amount</p>
                          <p className="text-xl font-bold text-gray-900">₹{bid.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">
                            {(bid.amount / selectedRoute.distance).toFixed(2)} per km
                          </p>
                        </div>
                        
                        {bid.status === 'pending' && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => {/* Reject bid functionality */}}
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptBid(bid)}
                            >
                              Accept
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 