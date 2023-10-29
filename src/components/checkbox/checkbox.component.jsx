import React from 'react';

function Checkbox({ checked, onChange, name }) {
  return (
    <input
      type="checkbox"
      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      checked={checked}
      onChange={onChange}
      name={name}
    />
  );
}

export default Checkbox;