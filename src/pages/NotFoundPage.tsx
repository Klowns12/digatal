import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-9xl font-bold text-blue-600">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mt-4 mb-8">Page Not Found</p>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link 
        to="/"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 transition-colors"
      >
        Return to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;