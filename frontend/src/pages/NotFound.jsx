import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
    <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
    <p className="text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
    <Link to="/" className="btn btn-primary">Go Home</Link>
  </div>
);

export default NotFound; 