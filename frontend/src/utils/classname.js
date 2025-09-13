import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function mergeClassnames(...inputs) {
  return twMerge(clsx(inputs))
}
