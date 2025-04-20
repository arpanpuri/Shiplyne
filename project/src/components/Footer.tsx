import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-xl font-bold mb-4">Shiplyne</h2>
            <p className="text-gray-400 mb-4">
              Connecting transport and factory owners with a seamless bidding platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">Pricing</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">Transport Bidding</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">Route Management</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">Real-time Tracking</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">Fleet Management</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">Transport Analytics</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact Us</h3>
            <address className="not-italic text-gray-400">
              <p className="mb-2">123 Transport Lane</p>
              <p className="mb-2">Logistics City, IN 400001</p>
              <p className="mb-2">India</p>
              <p className="mb-2 flex items-center mt-4">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:info@logisticshub.com" className="hover:text-white">
                  info@logisticshub.com
                </a>
              </p>
              <p className="mb-2">+91 12345 67890</p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© {currentYear} Shiplyne. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="#" className="hover:text-white">Privacy Policy</Link>
            <Link to="#" className="hover:text-white">Terms of Service</Link>
            <Link to="#" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}