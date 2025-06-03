import React from 'react';
import PropTypes from 'prop-types';

export default function ToastMessage({ message }) {
  if (!message) return null;

  return (
    <div
      data-testid="toast"
      className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 bg-[#538D4E] text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm whitespace-nowrap z-50 animate-fade"
    >
      {message}
    </div>
  );
}

ToastMessage.propTypes = {
  message: PropTypes.string.isRequired,
};
