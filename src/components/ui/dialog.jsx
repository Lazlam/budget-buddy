import React from "react";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Added dark:bg-gray-900 and a subtle dark border! */}
      <div className="relative z-50 w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-xl p-6 border border-transparent dark:border-gray-700 transition-colors duration-200">
        
        {/* Updated the close 'X' button for dark mode hover states */}
        <button 
          onClick={() => onOpenChange(false)} 
          className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children, className = "" }) {
  {/* Added dark:text-white to ensure the title flips color automatically */}
  return <h2 className={`text-lg font-semibold tracking-tight text-gray-900 dark:text-white ${className}`}>{children}</h2>;
}