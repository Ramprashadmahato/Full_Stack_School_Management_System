import React from 'react';

const Button = ({ text, onClick, className = '', type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
