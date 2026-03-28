import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind class names safely. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
