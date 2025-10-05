
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Solutions</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="#" className="text-base text-gray-600 hover:text-gray-900">For Donors</Link></li>
              <li><Link to="#" className="text-base text-gray-600 hover:text-gray-900">For Claimers</Link></li>
              <li><Link to="#" className="text-base text-gray-600 hover:text-gray-900">For Organizations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/contact" className="text-base text-gray-600 hover:text-gray-900">Contact</Link></li>
              <li><Link to="/contact" className="text-base text-gray-600 hover:text-gray-900">Help Guides</Link></li>
              <li><Link to="#" className="text-base text-gray-600 hover:text-gray-900">Report an Issue</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/about" className="text-base text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link to="/community" className="text-base text-gray-600 hover:text-gray-900">Community</Link></li>
              <li><Link to="#" className="text-base text-gray-600 hover:text-gray-900">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="#" className="text-base text-gray-600 hover:text-gray-900">Privacy</Link></li>
              <li><Link to="#" className="text-base text-gray-600 hover:text-gray-900">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">Facebook</span><i className="fab fa-facebook"></i></a>
            <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">Instagram</span><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">Twitter</span><i className="fab fa-twitter"></i></a>
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} NourishNet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;