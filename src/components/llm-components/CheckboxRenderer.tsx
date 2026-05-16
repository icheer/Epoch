"use client";

import { CheckboxComponent } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CheckboxRendererProps {
  component: CheckboxComponent;
  value?: boolean;
  onChange?: (id: string, value: string) => void;
  isInFlexRow?: boolean;
}

export function CheckboxRenderer({
  component,
  value,
  onChange,
  isInFlexRow = false,
}: CheckboxRendererProps) {
  const {
    id,
    label,
    checked = false,
    required = false,
    error = "",
    helperText = "",
  } = component;

  if (!id) return null;

  const isChecked = value !== undefined ? value === "true" : checked;

  const handleChange = (newChecked: boolean) => {
    onChange?.(id, String(newChecked));
  };

  const hasError = error && error.trim() !== "";

  return (
    <div className={cn("space-y-2", isInFlexRow && "flex-1 min-w-0")}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={isChecked}
          onCheckedChange={handleChange}
          className={cn(
            hasError && "border-red-500 data-[state=checked]:bg-red-500"
          )}
        />
        {label && (
          <Label
            htmlFor={id}
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
      </div>
      {hasError && <p className="text-xs text-red-600 ml-6">{error}</p>}
      {!hasError && helperText && (
        <p className="text-xs text-gray-500 ml-6">{helperText}</p>
      )}
    </div>
  );
}
