"use client";

import { MetricComponent } from "./types";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricRendererProps {
  component: MetricComponent;
}

export function MetricRenderer({ component }: MetricRendererProps) {
  const { label, value, change, trend, prefix, suffix, description } =
    component;

  if (!value) return null;

  const trendColor =
    trend === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : trend === "down"
        ? "text-red-500 dark:text-red-400"
        : "text-muted-foreground";

  return (
    <div className="pl-4 border-l-2 border-brand py-0.5">
      {label && (
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
          {label}
        </p>
      )}

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {prefix}
          {value}
          {suffix}
        </span>

        {(change || trend) && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
            {trend === "up" && <TrendingUp className="h-3.5 w-3.5" />}
            {trend === "down" && <TrendingDown className="h-3.5 w-3.5" />}
            {change && <span>{change}</span>}
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
