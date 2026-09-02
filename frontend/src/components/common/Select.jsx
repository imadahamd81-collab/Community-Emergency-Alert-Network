const Select = ({ label, options, value, onChange, error, className = '', placeholder = 'Select...' }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      >
        <option value="">{placeholder}</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Select
