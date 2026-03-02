import React from "react";

export function Button({ children, className = "", variant = "default", size = "default", ...props }) {
  return (
    <button 
      className={`inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}