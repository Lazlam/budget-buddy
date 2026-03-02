import React, { useState, useContext } from "react";

const SelectContext = React.createContext();

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className = "" }) {
  const { setOpen, open } = useContext(SelectContext);
  return (
    <div onClick={() => setOpen(!open)} className={`flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}>
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectContext);
  return <span className="capitalize">{value?.replace(/_/g, " ") || placeholder}</span>;
}

export function SelectContent({ children }) {
  const { open } = useContext(SelectContext);
  if (!open) return null;
  return (
    <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-md">
      <div className="p-1">{children}</div>
    </div>
  );
}

export function SelectItem({ value, children }) {
  const { value: selectedValue, onValueChange, setOpen } = useContext(SelectContext);
  const isSelected = selectedValue === value;
  return (
    <div
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm hover:bg-indigo-50 hover:text-indigo-600 ${isSelected ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-700"}`}
      onClick={() => { onValueChange(value); setOpen(false); }}
    >
      {children}
    </div>
  );
}