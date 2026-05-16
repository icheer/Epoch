"use client";

import { SelectComponent } from "./types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectRendererProps {
  component: SelectComponent;
  value?: string;
  onChange?: (id: string, value: string) => void;
  isInFlexRow?: boolean;
}

export function SelectRenderer({
  component,
  value,
  onChange,
  isInFlexRow = false,
}: SelectRendererProps) {
  const {
    id,
    label,
    placeholder = "Select an option",
    options,
    required = false,
    error = "",
    helperText = "",
  } = component;

  if (!id || !options || options.length === 0) return null;

  const handleChange = (newValue: string) => {
    onChange?.(id, newValue);
  };

  const hasError = error && error.trim() !== "";

  return (
    <div className={cn("space-y-2", isInFlexRow && "flex-1 min-w-0")}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className={cn(
          "border-gray-300 focus:border-pink-500 focus:ring-pink-500",
          hasError && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options
            .filter((option) => option.value && option.value.trim() !== "")
            .map((option, index) => (
              <SelectItem key={option.value || index} value={option.value!}>
                {option.label || option.value}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
      {!hasError && helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
