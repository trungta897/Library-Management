import React from 'react'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Checkbox({
  label,
  className = '',
  ...props
}: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        className={`
          w-4 h-4 rounded
          accent-primary-500
          cursor-pointer
          focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${className}
        `}
        {...props}
      />
      {label && (
        <label className="text-sm font-medium text-gray-700 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
}
