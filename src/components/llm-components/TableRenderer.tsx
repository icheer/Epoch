"use client";

import { TableComponent } from "./types";
import { cn } from "@/lib/utils";

interface TableRendererProps {
  component: TableComponent;
}

export function TableRenderer({ component }: TableRendererProps) {
  const { columns, data = [], variant = "default" } = component;

  if (!columns || columns.length === 0 || data.length === 0) return null;

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className={cn(
                  "px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800",
                  alignmentClasses[column.align || "left"]
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors",
                variant === "striped" && rowIndex % 2 === 1 && "bg-gray-50/50 dark:bg-gray-900/50"
              )}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={column.key || colIndex}
                  className={cn(
                    "px-4 py-3 text-sm text-gray-700 dark:text-gray-300",
                    alignmentClasses[column.align || "left"]
                  )}
                >
                  {row[column.key] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
