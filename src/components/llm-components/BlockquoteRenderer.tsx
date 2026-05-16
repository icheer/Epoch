import { BlockquoteComponent } from "./types";

interface BlockquoteRendererProps {
  component: BlockquoteComponent;
}

export function BlockquoteRenderer({ component }: BlockquoteRendererProps) {
  const { text, author } = component;

  if (!text) return null;

  return (
    <blockquote className="px-6 py-2">
      <p className="text-lg italic text-gray-700 dark:text-gray-300">
        {text}
      </p>
      {author && (
        <footer className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-right">
          — {author}
        </footer>
      )}
    </blockquote>
  );
}
