import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input"; 
import { Button } from "./ui/button";

export const PasswordInput = React.forwardRef(({ className = "", ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={`pr-10 ${className}`}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={(e) => {
          e.preventDefault(); // Prevents the button from accidentally submitting the form
          setShowPassword(!showPassword);
        }}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-gray-500" />
        ) : (
          <Eye className="h-4 w-4 text-gray-500" />
        )}
      </Button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";