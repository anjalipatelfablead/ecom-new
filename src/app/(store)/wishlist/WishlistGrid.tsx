"use client";

import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WishlistItem } from "@/redux/products/wishlistSlice";
import { getImageUrl } from "@/lib/utils";

// interface WishlistItem {
//   id: number;
//   title: string;
//   price: number;
//   image: string;
//   addedDate: string;
// }

interface WishlistGridProps {
  wishlistItems: WishlistItem[];
  handleRemoveFromWishlist: (id: string, title: string) => Promise<void>;
  handleAddToCart: (item: WishlistItem) => Promise<void>;
}

export default function WishlistGrid({
  wishlistItems,
  handleRemoveFromWishlist,
  handleAddToCart,
}: WishlistGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {wishlistItems.map((item) => (
        <div
          key={item._id}
          className="relative block aspect-square h-full w-full"
        >
          <Link href={`/products/${item._id}`}>
            <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">

              {/* Product Image */}
              <Image
                src={getImageUrl(item.image)}
                alt={item.title}
                fill
                className="object-contain transition duration-300 ease-in-out group-hover:scale-105"
                sizes="(min-width: 768px) 33vw, 100vw"
                unoptimized
              />

              {/* Bottom overlay with product info */}
              <div className="absolute bottom-0 left-0 flex w-full px-4 pb-4">
                <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
                  <h3 className="mr-4 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <p className="flex-none rounded-full bg-black p-2 text-white dark:bg-white dark:text-black">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Remove from wishlist button */}
              <div className="absolute top-2 left-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveFromWishlist(item._id!, item.title);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              {/* Add to cart button */}
              <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Button
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(item);
                  }}
                  className="rounded-full bg-black text-white shadow-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>

              {/* Added date badge */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 transform">
                <span className="rounded-full bg-white/70 px-2 py-1 text-xs text-black backdrop-blur-md dark:bg-black/70 dark:text-white">
                  Added {new Date(item.addedDate).toLocaleDateString()}
                </span>
              </div>

            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
