import React from 'react'

// 🎴 Main Card Container
export const Card = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`
        bg-white
        border border-gray-200
        rounded-lg
        shadow-sm
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// 📌 Card Header (top section với border-bottom)
export const CardHeader = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`
        px-6 py-4
        border-b border-gray-200
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// 📄 Card Content (main content area)
export const CardContent = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`
        px-6 py-6
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// 🔚 Card Footer (bottom section)
export const CardFooter = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`
        px-6 py-4
        border-t border-gray-200
        bg-gray-50
        ${className}
      `}
    >
      {children}
    </div>
  )
}
