"use client";

import { cn } from "@/lib/utils";
import { ButtonComponent } from "./types";

interface ButtonRendererProps {
  component: ButtonComponent;
  onAction?: (action: string, label: string) => void;
}

export function ButtonRenderer({ component, onAction }: ButtonRendererProps) {
  const { label, action, variant = "primary", size = "md" } = component;

  if (!label || !action) return null;

  const variantClasses = {
    primary:
      "bg-brand text-brand-foreground hover:brightness-105 shadow-sm",
    secondary:
      "bg-gray-800/90 text-white hover:bg-gray-800 hover:shadow-md shadow-sm dark:bg-gray-700 dark:hover:bg-gray-600",
    outline:
      "border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 shadow-sm dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const handleClick = () => {
    onAction?.(action, label);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-xl font-semibold transition-[filter,box-shadow,background-color,border-color,color] duration-200 cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
      )}
    >
      {label}
    </button>
  );
}
