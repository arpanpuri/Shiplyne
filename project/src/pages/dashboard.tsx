import { useState } from 'react';
import { useRouteBidContext } from '@/context/RouteBidContext';
import { Truck, Factory, BarChart3, Package, Calendar, Clock, Users, Settings, User, Star, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AvailableRoutes } from './transport/AvailableRoutes';
import { ManageRoutes } from './factory/ManageRoutes';
import { ShipmentsView } from './shipments/ShipmentsView';
import { format, parseISO } from 'date-fns';
import { Bid, Route } from '@/lib/types';

type UserRole = 'transport' | 'factory';
type TabType = 'overview' | 'routes' | 'bids' | 'shipments' | 'schedule' | 'history' | 'profile' | 'settings';

export function Dashboard() {
  const { routes, bids } = useRouteBidContext();
  const [activeRole, setActiveRole] = useState<UserRole>('transport');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Mock user IDs - in a real app, this would come from authentication
  const transportUserId = 'user1';
  const factoryUserId = 'user3';

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    setActiveTab('overview');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {/* Live stats for overview */}
        {/* Stats will be passed to OverviewTab below */}
        <div className="flex space-x-4">
          <Button 
            variant={activeRole === 'transport' ? 'default' : 'outline'} 
            onClick={() => switchRole('transport')}
            className="flex items-center gap-2"
          >
            <Truck className="h-4 w-4" />
            Transport Owner
          </Button>
          <Button 
            variant={activeRole === 'factory' ? 'default' : 'outline'} 
            onClick={() => switchRole('factory')}
            className="flex items-center gap-2"
          >
            <Factory className="h-4 w-4" />
            Factory Owner
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          <SidebarItem 
            icon={BarChart3} 
            label="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <SidebarItem 
            icon={MapIcon} 
            label={activeRole === 'transport' ? 'Available Routes' : 'Manage Routes'} 
            active={activeTab === 'routes'} 
            onClick={() => setActiveTab('routes')} 
          />
          <SidebarItem 
            icon={activeRole === 'transport' ? Clock : Package} 
            label={activeRole === 'transport' ? 'My Bids' : 'Available Transports'} 
            active={activeTab === 'bids'} 
            onClick={() => setActiveTab('bids')} 
          />
          <SidebarItem 
            icon={Package} 
            label="Shipments" 
            active={activeTab === 'shipments'} 
            onClick={() => setActiveTab('shipments')} 
          />
          <SidebarItem 
            icon={Calendar} 
            label="Schedule" 
            active={activeTab === 'schedule'} 
            onClick={() => setActiveTab('schedule')} 
          />
          <SidebarItem 
            icon={Clock} 
            label="History" 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Profile" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );

  // Function to render the content based on active tab and 
  function renderTabContent() {
    switch (activeTab) {
      case 'overview':
        // Compute live stats
        const openRoutes = routes.filter(r => r.status === 'open').length;
        const activeBids = bids.filter(b => b.status === 'pending' || b.status === 'accepted').length;
        const now = new Date();
        const completedThisMonth = routes.filter(r => r.status === 'completed' && new Date(r.createdAt).getMonth() === now.getMonth() && new Date(r.createdAt).getFullYear() === now.getFullYear()).length;
        // For demo, active shipments = assigned routes
        const activeShipments = routes.filter(r => r.status === 'assigned').length;
        return <OverviewTab 
          role={activeRole}
          openRoutes={openRoutes}
          activeBids={activeBids}
          activeShipments={activeShipments}
          completedThisMonth={completedThisMonth}
        />;
      case 'routes':
        return activeRole === 'transport' 
          ? <AvailableRoutes /> 
          : <ManageRoutes />;
      case 'bids':
        return activeRole === 'transport' 
          ? <MyBidsTab /> 
          : <AvailableTransportsTab />;
      case 'shipments':
        return <ShipmentsView 
          userType={activeRole} 
          userId={activeRole === 'transport' ? transportUserId : factoryUserId} 
        />;
      case 'schedule':
        return <ScheduleTab role={activeRole} />;
      case 'history':
        return <HistoryTab role={activeRole} />;
      case 'profile':
        return <ProfileTab role={activeRole} />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <div>Select a tab</div>;
    }
  }
}

// Helper components
function SidebarItem({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
  label: string; 
  active: boolean; 
  onClick: () => void 
}) {
  return (
    <button
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-900' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

function MapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" x2="9" y1="3" y2="18" />
      <line x1="15" x2="15" y1="6" y2="21" />
    </svg>
  );
}

// Placeholder tab contents
type OverviewStats = {
  openRoutes: number;
  activeBids: number;
  activeShipments: number;
  completedThisMonth: number;
};

function OverviewTab({ role, openRoutes, activeBids, activeShipments, completedThisMonth }: { role: UserRole } & OverviewStats) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          title={role === 'transport' ? "Active Bids" : "Open Routes"} 
          value={role === 'transport' ? String(activeBids) : String(openRoutes)} 
          icon={role === 'transport' ? Clock : MapIcon} 
        />
        <StatCard 
          title="Active Shipments" 
          value={String(activeShipments)} 
          icon={Package} 
        />
        <StatCard 
          title="Completed This Month" 
          value={String(completedThisMonth)} 
          icon={BarChart3} 
        />
      </div>
      <p className="mt-6 text-gray-600">Welcome to your dashboard! Select a tab from the sidebar to manage your {role === 'transport' ? 'transport' : 'factory'} operations.</p>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

// Placeholder components for tabs not yet implemented
function MyBidsTab() {
  const { bids, routes } = useRouteBidContext();
  // Mock user ID for transport owner (should match Dashboard)
  const transportUserId = 'user1';
  const myBids = bids.filter(bid => bid.transporterId === transportUserId);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Bids</h2>
      {myBids.length === 0 ? (
        <p>No bids placed yet.</p>
      ) : (
        <div className="space-y-4">
          {myBids.map(bid => {
            const route = routes.find(r => r.id === bid.routeId);
            return (
              <div key={bid.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold">Route:</span> {route ? `${route.source.city} → ${route.destination.city}` : bid.routeId}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${bid.status === 'accepted' ? 'bg-green-100 text-green-800' : bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}</span>
                </div>
                <div className="text-gray-700 text-sm">
                  <div><span className="font-medium">Amount:</span> ₹{bid.amount}</div>
                  <div><span className="font-medium">Vehicle ID:</span> {bid.vehicleId}</div>
                  <div><span className="font-medium">Bid Placed:</span> {format(parseISO(bid.createdAt), 'MMM dd, yyyy')}</div>
                  {bid.notes && <div><span className="font-medium">Notes:</span> {bid.notes}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



function AvailableTransportsTab() {
  const { routes, bids, setBids, setRoutes } = useRouteBidContext();
  const factoryOwnerId = 'user3'; // Should match factoryUserId in Dashboard
  const userRoutes = routes.filter(route => route.createdBy === factoryOwnerId);
  const [acceptingBidId, setAcceptingBidId] = useState<string | null>(null);

  // Accept bid handler (mirrors ManageRoutes logic)
  const handleAcceptBid = (bid: Bid) => {
    setAcceptingBidId(bid.id);
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
    setTimeout(() => setAcceptingBidId(null), 1000);
  };

  const formatDateString = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Available Transports</h2>
      {userRoutes.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Truck className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No routes created</h3>
          <p className="mt-1 text-sm text-gray-500">Create a route to receive transport bids.</p>
        </div>
      ) : (
        userRoutes.map(route => {
          const routeBids = bids.filter(bid => bid.routeId === route.id);
          return (
            <div key={route.id} className="mb-8 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="mb-2">
                <span className="font-semibold">Route:</span> {route.source.city} → {route.destination.city} | <span className="text-sm text-gray-500">Departure: {formatDateString(route.departureDate)}</span>
              </div>
              {routeBids.length === 0 ? (
                <div className="text-gray-500 text-sm">No bids received yet.</div>
              ) : (
                <div className="space-y-4">
                  {routeBids.map(bid => (
                    <div key={bid.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <User className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">Transporter ID: {bid.transporterId}</span>
                        <span className="ml-2 text-sm text-gray-600">Vehicle ID: {bid.vehicleId}</span>
                        <span className="ml-2 text-sm text-gray-600">Bid: ₹{bid.amount}</span>
                        <span className="ml-2 text-sm text-gray-600">Status: {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}</span>
                        <span className="ml-2 flex items-center"><Star className="h-4 w-4 text-yellow-400" /><span className="text-xs text-gray-600 ml-1">4.8</span></span>
                      </div>
                      {route.status === 'open' && bid.status === 'pending' && (
                        <Button
                          size="sm"
                          className="mt-2 md:mt-0"
                          onClick={() => handleAcceptBid(bid)}
                          disabled={acceptingBidId === bid.id}
                        >
                          {acceptingBidId === bid.id ? (
                            <span className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-1 animate-spin" />Accepting...</span>
                          ) : 'Accept Bid'}
                        </Button>
                      )}
                      {route.status === 'assigned' && bid.status === 'accepted' && (
                        <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center"><CheckCircle2 className="h-4 w-4 mr-1" />Accepted</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}


function ScheduleTab({ role }: { role: UserRole }) {
  return <div><h2 className="text-2xl font-bold mb-6">Schedule</h2><p>View your upcoming transport schedule.</p></div>;
}

function HistoryTab({ role }: { role: UserRole }) {
  const { routes, bids } = useRouteBidContext();
  const factoryUserId = 'user3';
  // Only for factory owner: show completed transports
  if (role === 'factory') {
    const completedRoutes = routes.filter(route => route.createdBy === factoryUserId && route.status === 'completed');
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Shipment History</h2>
        {completedRoutes.length === 0 ? (
          <p>No completed shipments yet.</p>
        ) : (
          <div className="space-y-4">
            {completedRoutes.map(route => {
              const assignedBid = bids.find(bid => bid.id === (route as any).assignedBidId && bid.status === 'accepted');
              return (
                <div key={route.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold">Route:</span> {route.source.city} → {route.destination.city}
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-800">Completed</span>
                  </div>
                  <div className="text-gray-700 text-sm">
                    <div><span className="font-medium">Departure:</span> {format(parseISO(route.departureDate), 'MMM dd, yyyy')}</div>
                    <div><span className="font-medium">Distance:</span> {route.distance} km</div>
                    {assignedBid && (
                      <div><span className="font-medium">Transporter ID:</span> {assignedBid.transporterId} | <span className="font-medium">Bid Amount:</span> ₹{assignedBid.amount}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
  // Default for transport owner
  return <div><h2 className="text-2xl font-bold mb-6">History</h2><p>Review past transport activities and analytics.</p></div>;
}


function ProfileTab({ role }: { role: UserRole }) {
  return <div><h2 className="text-2xl font-bold mb-6">Profile</h2><p>Manage your {role === 'transport' ? 'transport company' : 'factory'} profile and details.</p></div>;
}

function SettingsTab() {
  return <div><h2 className="text-2xl font-bold mb-6">Settings</h2><p>Configure your account settings and preferences.</p></div>;
}