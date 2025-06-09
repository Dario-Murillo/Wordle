import PropTypes from 'prop-types';

export function Input({ type, placeholder, value, onChange, className }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border px-3 py-2 rounded text-white ${className}`}
    />
  );
}

export function Table({ children, className }) {
  return <table className={`table-auto ${className}`}>{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="text-2xl">{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }) {
  return <tr className="border-b border-gray-600">{children}</tr>;
}

export function TableCell({ children, className }) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>;
}

export function Button({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="bg-[#3a3a3c] hover:bg-[#535356] text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {children}
    </button>
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Table.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

TableBody.propTypes = {
  children: PropTypes.node.isRequired,
};

TableRow.propTypes = {
  children: PropTypes.node.isRequired,
};

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Input.defaultProps = {
  placeholder: '',
  value: '',
  className: '',
};

Table.defaultProps = {
  className: '',
};

TableCell.defaultProps = {
  className: '',
};

Button.defaultProps = {
  onClick: undefined,
  disabled: false,
};
