import { BlockquoteComponent } from "./types";

interface BlockquoteRendererProps {
  component: BlockquoteComponent;
}

export function BlockquoteRenderer({ component }: BlockquoteRendererProps) {
  const { text, author } = component;

  if (!text) return null;

  return (
    <blockquote className="relative px-8 py-6 my-4">
      <span className="absolute top-0 left-0 text-7xl text-gray-200 dark:text-gray-700 leading-none select-none">
        "
      </span>
      <span className="absolute bottom-0 right-0 text-7xl text-gray-200 dark:text-gray-700 leading-none select-none">
        "
      </span>
      <div className="relative z-10">
        <p className="text-lg italic text-gray-700 dark:text-gray-300">
          {text}
        </p>
        {author && (
          <footer className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-right">
            — {author}
          </footer>
        )}
      </div>
    </blockquote>
  );
}
