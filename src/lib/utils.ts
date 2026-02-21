import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(imagePath: string): string {
  if (!imagePath) {
    console.warn("No image path provided");
    return "";
  }
  if (imagePath.startsWith("http")) {
    console.log("Using full URL:", imagePath);
    return imagePath;
  }
  const fullUrl = `http://localhost:3030${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  console.log("Converting to full URL:", { original: imagePath, converted: fullUrl });
  return fullUrl;
}
