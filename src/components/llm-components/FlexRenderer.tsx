import { cn } from "@/lib/utils";
import { FlexComponent } from "./types";
import { UIRenderer } from "./UIRenderer";

interface FlexRendererProps {
  component: FlexComponent;
  onAction?: (action: string, label: string) => void;
  formValues?: Record<string, string>;
  onFormChange?: (id: string, value: string) => void;
}

export function FlexRenderer({
  component,
  onAction,
  formValues,
  onFormChange,
}: FlexRendererProps) {
  const {
    direction = "column",
    align = "stretch",
    justify = "start",
    wrap = false,
    children = [],
  } = component;

  const directionClasses = {
    row: "flex-col sm:flex-row gap-3",
    column: "flex-col gap-4",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const effectiveAlign =
    direction === "row" && align === "stretch" ? "center" : align;

  const className = cn(
    "flex",
    directionClasses[direction],
    alignClasses[effectiveAlign],
    justifyClasses[justify],
    wrap && "flex-wrap",
  );

  return (
    <div className={className}>
      {children?.map((child, index) => (
        <UIRenderer
          key={index}
          component={child}
          isInFlexRow={direction === "row"}
          onAction={onAction}
          formValues={formValues}
          onFormChange={onFormChange}
        />
      ))}
    </div>
  );
}
