import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function calculateStorage(
  usedBytes: number = 0,
  limitBytes: number = 5 * 1024 * 1024 * 1024,
) {
  const percent = Math.min(100, Math.round((usedBytes / limitBytes) * 100));
  const usedGb = (usedBytes / 1024 ** 3).toFixed(2);
  const limitGb = (limitBytes / 1024 ** 3).toFixed(0);
  return { percent, usedGb, limitGb };
}

export function formatMonthYear(date: string | Date, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    year: "numeric",
  });
}
