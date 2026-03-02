import React from "react";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative z-50 w-full max-w-lg rounded-2xl bg-white shadow-xl p-6">
        <button onClick={() => onOpenChange(false)} className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
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
  return <h2 className={`text-lg font-semibold tracking-tight ${className}`}>{children}</h2>;
}