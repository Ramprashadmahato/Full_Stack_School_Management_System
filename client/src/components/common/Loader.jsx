import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-blue-900 border-t-yellow-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
