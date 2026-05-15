"use client";

import { StatsComponent } from "./types";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsRendererProps {
  component: StatsComponent;
}

export function StatsRenderer({ component }: StatsRendererProps) {
  const { items = [] } = component;

  if (items.length === 0) return null;

  return (
    <div className="border-t border-border pt-4">
      <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-border gap-5 sm:gap-0">
        {items.map((item, index) => {
          const trendColor =
            item.trend === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : item.trend === "down"
                ? "text-red-500 dark:text-red-400"
                : "text-muted-foreground";

          const trendIcon =
            item.trend === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : item.trend === "down" ? (
              <TrendingDown className="h-3 w-3" />
            ) : item.trend === "neutral" ? (
              <Minus className="h-3 w-3" />
            ) : null;

          return (
            <div
              key={index}
              className="flex-1 sm:px-5 first:sm:pl-0 last:sm:pr-0"
            >
              {item.label && (
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                  {item.label}
                </p>
              )}
              {item.value && (
                <p className={cn(
                  "font-bold tracking-tight text-foreground",
                  index === 0 ? "text-2xl" : "text-xl"
                )}>
                  {item.value}
                </p>
              )}
              {(item.change || item.trend) && (
                <div className={cn("flex items-center gap-1 text-xs font-medium mt-0.5", trendColor)}>
                  {trendIcon}
                  {item.change && <span>{item.change}</span>}
                </div>
              )}
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
