import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-700 text-white hover:from-blue-800 hover:to-blue-900 focus:ring-primary shadow-md hover:shadow-lg transform hover:scale-105",
    secondary: "bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 focus:ring-blue-400 shadow-md hover:shadow-lg transform hover:scale-105",
    outline: "border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-gray-600 bg-transparent hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-300",
    success: "bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-600 hover:to-blue-700 focus:ring-teal-500 shadow-md hover:shadow-lg transform hover:scale-105",
    warning: "bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 focus:ring-indigo-500 shadow-md hover:shadow-lg transform hover:scale-105",
    error: "bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-950 focus:ring-blue-800 shadow-md hover:shadow-lg transform hover:scale-105"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg"
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;