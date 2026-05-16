"use client";

import { CardComponent } from "./types";
import { UIRenderer } from "./UIRenderer";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { imageCache } from "@/lib/imageCache";

interface CardRendererProps {
  component: CardComponent;
  onAction?: (action: string, label: string) => void;
  formValues?: Record<string, string>;
  onFormChange?: (id: string, value: string) => void;
  isInGrid?: boolean;
}

export function CardRenderer({
  component,
  onAction,
  formValues,
  onFormChange,
  isInGrid = false,
}: CardRendererProps) {
  const {
    title,
    description,
    image,
    imageQuery,
    children = [],
    clickAction,
  } = component;
  const [imageUrl, setImageUrl] = useState<string | null>(image || null);
  const [loading, setLoading] = useState(false);
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (
      !image &&
      imageQuery &&
      imageQuery.length >= 3 &&
      imageQuery !== loadedQuery
    ) {
      let cancelled = false;

      const debounceTimer = setTimeout(() => {
        const fetchImage = async () => {
          try {
            setLoading(true);
            setImageError(false);
            const url = await imageCache.getImage(imageQuery);
            if (!cancelled) {
              if (url) {
                setImageUrl(url);
                setLoadedQuery(imageQuery);
              } else {
                setImageError(true);
              }
            }
          } catch (err) {
            console.error("Failed to fetch image:", err);
            if (!cancelled) {
              setImageError(true);
            }
          } finally {
            if (!cancelled) {
              setLoading(false);
            }
          }
        };

        fetchImage();
      }, 700);

      return () => {
        cancelled = true;
        clearTimeout(debounceTimer);
      };
    }
  }, [image, imageQuery, loadedQuery]);

  const handleClick = () => {
    if (clickAction && onAction) {
      onAction(clickAction, title || "Card clicked");
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden transition-[box-shadow,transform] duration-300 hover:shadow-xl border border-border bg-card dark:bg-card",
        clickAction &&
          "cursor-pointer hover:scale-[1.01] hover:-translate-y-0.5",
        isInGrid && "h-full flex flex-col",
      )}
      onClick={handleClick}
    >
      {(imageUrl || loading || imageError) && (
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />
          ) : imageError ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="text-center px-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-xs text-gray-500">Image unavailable</p>
              </div>
            </div>
          ) : (
            imageUrl && (
              <div className="relative h-full w-full">
                <img
                  src={imageUrl}
                  alt={title || ""}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/90 to-transparent" />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    backdropFilter: "blur(1px)",
                    background:
                      "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,0) 100%)",
                  }}
                />
              </div>
            )
          )}
        </div>
      )}

      <div
        className={cn(
          "relative flex flex-col p-4 sm:p-5",
          (imageUrl || loading) && "-mt-12 sm:-mt-16 z-10",
        )}
      >
        {(title || description) && (
          <div className="space-y-2 mb-4">
            {title && (
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        )}

        {children.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {children.map((child, index) => (
              <UIRenderer
                key={index}
                component={child}
                onAction={onAction}
                formValues={formValues}
                onFormChange={onFormChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
