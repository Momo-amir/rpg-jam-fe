import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/*

The function cn is a standard helper utility that makes it easier to handle className manipulation in a React + 
Tailwind
 environment, ensuring that classNames are appropriately merged and any conflicts are resolved, making the component styling more consistent and 
maintainable
.

*/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
