import React from 'react';
import PropTypes from 'prop-types';

export default function ToastMessage({ message, bgColor, textColor }) {
  if (!message) return null;
  const style = {
    backgroundColor: bgColor || '#787C7E',
    color: textColor || '#FFFFFF',
  };

  return (
    <div
      data-testid="toast"
      className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-[10px] text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm whitespace-nowrap z-50 bg-[#787C7E] fade"
      style={style}
    >
      {message}
    </div>
  );
}

ToastMessage.propTypes = {
  message: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
};

ToastMessage.defaultProps = {
  bgColor: '#787C7E',
  textColor: '#FFFFFF',
};
