import { Link } from 'react-router-dom';
import { Truck, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Shiplyne</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link to="/transport" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              Transport Owners
            </Link>
            <Link to="/factory" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              Factory Owners
            </Link>
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/transport"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                Transport Owners
              </Link>
              <Link
                to="/factory"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                Factory Owners
              </Link>
              <Button variant="primary" size="sm" className="w-full mt-2">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}