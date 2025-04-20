import { Truck, Factory, Shield, Clock, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { HowItWorks } from '@/components/HowItWorks';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-32"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Connect. Transport. Deliver.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200">
            The ultimate marketplace connecting transport owners with factory owners for efficient logistics solutions.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Transport Owner
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="flex items-center gap-2 bg-white/10 text-white border-white">
                <Factory className="h-5 w-5" />
                Factory Owner
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose LogisticsHub?</h2>
            <p className="mt-4 text-xl text-gray-600">
              We provide a comprehensive platform that streamlines logistics operations.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Shield}
              title="Secure & Verified"
              description="All transport owners are thoroughly verified with business credentials and licensing information."
            />
            <FeatureCard
              icon={Clock}
              title="Real-time Updates"
              description="Track shipments, bids, and delivery status with our real-time monitoring system."
            />
            <FeatureCard
              icon={MapPin}
              title="Route Optimization"
              description="Advanced route mapping with distance and time calculations for efficient delivery."
            />
            <FeatureCard
              icon={Star}
              title="Rating System"
              description="Make informed decisions with our comprehensive rating and review system."
            />
            <FeatureCard
              icon={Truck}
              title="Fleet Management"
              description="Easily manage and track your entire fleet of vehicles in one place."
            />
            <FeatureCard
              icon={Factory}
              title="Factory Integration"
              description="Seamlessly integrate with your factory operations and manage shipments."
            />
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Streamline Your Logistics?</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of businesses already saving time and money on their transport operations.
          </p>
          <div className="mt-8">
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="bg-white text-blue-700 hover:bg-blue-50">
                Get Started Now
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-200">
            No credit card required. Start with a free trial.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="relative p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}