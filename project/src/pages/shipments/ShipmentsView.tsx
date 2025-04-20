import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { MapPin, Calendar, Clock, Package, Truck as TruckIcon, User, Phone, Clipboard, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Shipment, UserType } from '@/lib/types';
import { mockShipments, getShipmentsByTransporter, getShipmentsByFactory } from '@/lib/mockData';
import { Button } from '@/components/ui/button';

type ShipmentStatus = 'all' | 'scheduled' | 'in_transit' | 'delivered' | 'cancelled';


export function ShipmentsView({ userType, userId }: { userType: UserType; userId: string }) {
  // Payment/rating state (for demo, local only)
  const [shipmentPayment, setShipmentPayment] = useState<{ [id: string]: 'pending' | 'partial' | 'completed' }>({});
  const [shipmentRating, setShipmentRating] = useState<{ [id: string]: number }>({});
  const [activeStatus, setActiveStatus] = useState<ShipmentStatus>('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [userShipments, setUserShipments] = useState<Shipment[]>(() => userType === 'transport' ? getShipmentsByTransporter(userId) : getShipmentsByFactory(userId));

  // Real-time update for transport owner
  useEffect(() => {
    if (userType === 'transport') {
      const interval = setInterval(() => {
        setUserShipments(getShipmentsByTransporter(userId));
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setUserShipments(getShipmentsByFactory(userId));
    }
  }, [userType, userId]);

  // Filter shipments by status
  const filteredShipments = activeStatus === 'all'
    ? userShipments
    : userShipments.filter(shipment => shipment.status === activeStatus);

  const formatDateString = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy - h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatus = (shipment: Shipment) => shipmentPayment[shipment.id] || shipment.paymentStatus;
  const getRating = (shipment: Shipment) => shipmentRating[shipment.id] || shipment.rating?.transport || 0;

  const handleMarkPaid = (shipmentId: string) => {
    setShipmentPayment(prev => ({ ...prev, [shipmentId]: 'completed' }));
  };

  const handleSetRating = (shipmentId: string, rating: number) => {
    setShipmentRating(prev => ({ ...prev, [shipmentId]: rating }));
  };

  const handleViewTracking = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowTrackingModal(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Shipments</h2>
        <div className="flex gap-2">
          <Button 
            variant={activeStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatus('all')}
          >
            All
          </Button>
          <Button 
            variant={activeStatus === 'scheduled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatus('scheduled')}
          >
            Scheduled
          </Button>
          <Button 
            variant={activeStatus === 'in_transit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatus('in_transit')}
          >
            In Transit
          </Button>
          <Button 
            variant={activeStatus === 'delivered' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatus('delivered')}
          >
            Delivered
          </Button>
          <Button 
            variant={activeStatus === 'cancelled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatus('cancelled')}
          >
            Cancelled
          </Button>
        </div>
      </div>

      {/* Shipments List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredShipments.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Package className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No shipments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeStatus === 'all' 
                ? "You don't have any shipments yet." 
                : `No ${activeStatus.replace('_', ' ')} shipments found.`}
            </p>
          </div>
        ) : (
          filteredShipments.map((shipment) => {
            const paymentStatus = getPaymentStatus(shipment);
            const currentRating = getRating(shipment);
            return (
              <div key={shipment.id} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}
                      >
                        {shipment.status === 'in_transit' ? 'In Transit' : 
                          shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Shipment ID: {shipment.id}
                      </span>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex-1">
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                            <div className="ml-2">
                              <p className="text-sm text-gray-500">From</p>
                              <p className="font-semibold">
                                {shipment.currentLocation?.city || 'Loading...'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                            <div className="ml-2">
                              <p className="text-sm text-gray-500">To</p>
                              <p className="font-semibold">
                                {shipment.currentLocation?.city || 'Loading...'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="ml-2 text-sm text-gray-600">
                            Departure: {formatDateString(shipment.departureTime)}
                          </span>
                        </div>
                        {shipment.arrivalTime && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="ml-2 text-sm text-gray-600">
                              Arrival: {formatDateString(shipment.arrivalTime)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <TruckIcon className="h-4 w-4 text-gray-500" />
                          <span className="ml-2 text-sm text-gray-600">
                            Vehicle: {shipment.vehicleId}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clipboard className="h-4 w-4 text-gray-500" />
                          <span className="ml-2 text-sm text-gray-600">
                            Payment: {getPaymentStatus(shipment).charAt(0).toUpperCase() + getPaymentStatus(shipment).slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-1">Documents:</p>
                        <div className="flex flex-wrap gap-2">
                          {shipment.documents.invoice && (
                            <Button variant="outline" size="sm" className="text-sm">
                              <FileText className="h-3 w-3 mr-1" />
                              Invoice
                            </Button>
                          )}
                          {shipment.documents.lading && (
                            <Button variant="outline" size="sm" className="text-sm">
                              <FileText className="h-3 w-3 mr-1" />
                              Bill of Lading
                            </Button>
                          )}
                          {shipment.documents.receipt && (
                            <Button variant="outline" size="sm" className="text-sm">
                              <FileText className="h-3 w-3 mr-1" />
                              Receipt
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                
                <div className="mt-6 md:mt-0 md:ml-6 md:min-w-[180px] flex flex-col items-end gap-3">
                  {shipment.status === 'in_transit' && (
                    <Button
                      onClick={() => handleViewTracking(shipment)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {/* Map icon removed */}
                      Live Tracking
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {/* View details functionality */}}
                  >
                    <Clipboard className="h-4 w-4" />
                    Details
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {/* Contact functionality */}}
                  >
                    <Phone className="h-4 w-4" />
                    Contact
                  </Button>
                </div>
                {/* Payment and Rating Actions (only for delivered) */}
                {shipment.status === 'delivered' && (
                  <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    {/* Payment */}
                    {paymentStatus !== 'completed' && userType === 'factory' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleMarkPaid(shipment.id)}
                        className="flex items-center gap-2"
                      >
                        Mark as Paid
                      </Button>
                    )}
                    {/* Paid badge */}
                    {paymentStatus === 'completed' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    )}
                    {/* Rating */}
                    {userType === 'factory' && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 mr-2">Your Rating:</span>
                        {[1,2,3,4,5].map(star => (
                          <button
                            key={star}
                            onClick={() => handleSetRating(shipment.id, star)}
                            className="focus:outline-none"
                          >
                            <Star className={`h-4 w-4 ${currentRating >= star ? 'text-yellow-400' : 'text-gray-300'}`} fill={currentRating >= star ? '#FBBF24' : 'none'} />
                          </button>
                        ))}
                        {currentRating > 0 && <span className="ml-2 text-xs text-yellow-600 font-semibold">{currentRating}/5</span>}
                      </div>
                    )}
                    {/* Show average rating for transporter (transport side) */}
                    {userType === 'transport' && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                        <span className="text-xs text-yellow-700 font-semibold">{currentRating > 0 ? `${currentRating}/5` : 'Not rated yet'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Tracking Modal */}
      {showTrackingModal && selectedShipment && selectedShipment.tracking && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Live Tracking</h3>
              <button 
                onClick={() => setShowTrackingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">{formatDateString(selectedShipment.tracking.lastUpdated)}</p>
            </div>
            
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-6">
              {/* In a real app, this would be a map component */}
              <div className="text-center">
                {/* Map icon removed */}
                <p className="font-medium">Interactive Map</p>
                <p className="text-sm text-gray-500">
                  Current Location: {selectedShipment.currentLocation?.name}, {selectedShipment.currentLocation?.city}
                </p>
                <p className="text-xs text-gray-400">
                  Lat: {selectedShipment.tracking.lat}, Lng: {selectedShipment.tracking.lng}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-red-500" />
                  <span className="ml-2">Origin</span>
                </div>
                <span className="text-gray-500">
                  {/* This would come from the route data */}
                  Mumbai, Maharashtra
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span className="ml-2">Current Location</span>
                </div>
                <span className="font-medium">
                  {selectedShipment.currentLocation?.city}, {selectedShipment.currentLocation?.state}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-500" />
                  <span className="ml-2">Destination</span>
                </div>
                <span className="text-gray-500">
                  {/* This would come from the route data */}
                  Hyderabad, Telangana
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Estimated Arrival</span>
                </div>
                <span className="text-gray-500">
                  {/* This would be calculated based on current position and speed */}
                  April 15, 2023 - 4:30 PM
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Driver Contact</span>
                </div>
                <span className="text-gray-500">
                  +91 98765 43210
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowTrackingModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}