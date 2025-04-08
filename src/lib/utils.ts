import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString:string) {
  // Create a new Date object from the input string
  const date = new Date(dateString);
  
  // Array of month names
  const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Get date components
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  // Get time components
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)
  
  // Pad minutes with leading zero if needed
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  // Construct the formatted string
  return `${month} ${day}, ${year}, ${hours}:${paddedMinutes} ${ampm}`;
}
