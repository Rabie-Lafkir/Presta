import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatProper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getLastMonth() {
  let today = new Date();
  return `${today.getFullYear()}-${
    today.getUTCMonth() - 1
  }-${today.getUTCDate()}`;
}

export function resetDate(date) {
  let tmpDate = new Date(date);
  tmpDate.setHours(0);
  tmpDate.setMinutes(0);
  tmpDate.setMilliseconds(0);
  return tmpDate;
}

export function getAbbv(string) {
  const tmpAbbv = string.includes(" ")
    ? `${string.split(" ")[0][0]}${string.split(" ")[0][0]}`
    : string.slice(0, 2);
  return tmpAbbv.toUpperCase();
}
