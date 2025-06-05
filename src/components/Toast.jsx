import { X, Check } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Toast({ show, onClose, message }) {
  if (!show) return null;

  return (
    <div
      id="toast-success"
      className="fixed bottom-6 right-6 flex items-center w-full max-w-xs p-4 mb-4 text-green-700 bg-white rounded-lg shadow-sm border border-green-400 font-[family-name:var(--font-karla)] z-50"
      role="alert"
    >
      <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-600 bg-green-100 rounded-lg">
        <Check className="w-5 h-5" />
        <span className="sr-only">Check icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        onClick={onClose}
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-green-400 hover:text-green-700 rounded-lg focus:ring-2 focus:ring-green-300 p-1.5 hover:bg-green-100 inline-flex items-center justify-center h-8 w-8"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

Toast.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};
