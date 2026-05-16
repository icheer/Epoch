"use client";

import { GridComponent } from "./types";
import { UIRenderer } from "./UIRenderer";
import { cn } from "@/lib/utils";

interface GridRendererProps {
  component: GridComponent;
  onAction?: (action: string, label: string) => void;
  formValues?: Record<string, string>;
  onFormChange?: (id: string, value: string) => void;
}

export function GridRenderer({
  component,
  onAction,
  formValues,
  onFormChange,
}: GridRendererProps) {
  const { columns = 2, children = [] } = component;

  if (children.length === 0) return null;

  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid gap-4",
        gridColsClass[
          Math.min(4, Math.max(1, columns)) as keyof typeof gridColsClass
        ],
      )}
    >
      {children.map((child, index) => (
        <UIRenderer
          key={index}
          component={child}
          onAction={onAction}
          formValues={formValues}
          onFormChange={onFormChange}
          isInGrid={child.type === "card"}
        />
      ))}
    </div>
  );
}
