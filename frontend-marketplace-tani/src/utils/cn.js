import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "h4",
            "body-lg",
            "body",
            "body-sm",
            "caption",
          ],
        },
      ],
      "text-color": [
        {
          text: [
            "ink",
            "ink-soft",
            "ink-muted",
            "surface",
            "canvas",
            "media-bg",
            "star",
            "status-pending-fg",
            "status-paid-fg",
            "status-processing-fg",
            "status-shipped-fg",
            "status-completed-fg",
            "status-cancelled-fg",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs) {
  return customTwMerge(clsx(inputs));
}
