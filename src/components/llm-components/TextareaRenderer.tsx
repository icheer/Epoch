"use client";

import { TextareaComponent } from "./types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TextareaRendererProps {
  component: TextareaComponent;
  value?: string;
  onChange?: (id: string, value: string) => void;
  isInFlexRow?: boolean;
}

export function TextareaRenderer({
  component,
  value = "",
  onChange,
  isInFlexRow = false,
}: TextareaRendererProps) {
  const {
    id,
    label,
    placeholder,
    rows = 4,
    required = false,
    error = "",
    helperText = "",
  } = component;

  if (!id) return null;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(id, e.target.value);
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
      <Textarea
        id={id}
        placeholder={placeholder}
        required={required}
        rows={rows}
        value={value}
        onChange={handleChange}
        className={cn(
          "border-gray-300 focus:border-pink-500 focus:ring-pink-500 resize-none",
          hasError && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
      />
      {hasError && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
      {!hasError && helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
