import React, { useState } from 'react';

const Button = ({ type, children, className }) => {
  return (
    <button
      type={type}
      className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;