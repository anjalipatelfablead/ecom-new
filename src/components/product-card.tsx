"use client";

// import { Product } from "@/redux/products/productSlice";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useDispatch } from "react-redux";
// import { addToCart } from "@/redux/products/cartSlice";
// import { ShoppingCart, Heart, Star } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { toast } from "sonner";

// import { addToWishlist } from "@/redux/products/wishlistSlice";

// interface ProductCardProps {
//   product: Product;
// }

// export default function ProductCard({ product }: ProductCardProps) {
//   const dispatch = useDispatch();

//   const handleAddToCart = () => {
//     dispatch(addToCart({ product, quantity: 1 }));
//     toast.success(`${product.title} added to cart!`);
//   };

//   const handleAddToWishlist = () => {
//     dispatch(addToWishlist(product));
//     toast.success(`${product.title} added to wishlist`);
//   };

"use client";

import { Product } from "@/redux/products/productSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { createCart, updateCart, fetchCart } from "@/redux/products/cartSlice";
import { ShoppingCart, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { addToWishlist } from "@/redux/products/wishlistSlice";
import { getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { cartId, items } = useSelector(
    (state: RootState) => state.cart
  );

  //  Replace with actual logged-in user ID from auth slice
  const userId = useSelector(
    (state: RootState) => state.auth.currentUser?._id
  );

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    try {
      if (!cartId && items.length === 0) {
        await dispatch(fetchCart(userId)).unwrap();
      }

      const currentCartId = cartId;
      const currentItems = items;

      const existingItem = currentItems.find(
        (item) => item.product._id === product._id
      );

      let updatedItems;

      if (existingItem) {
        updatedItems = currentItems.map((item) =>
          item.product._id === product._id
            ? { product: product._id!, quantity: item.quantity + 1 }
            : { product: item.product._id!, quantity: item.quantity }
        );
      } else {
        updatedItems = [
          ...currentItems.map((item) => ({
            product: item.product._id!,
            quantity: item.quantity,
          })),
          { product: product._id!, quantity: 1 },
        ];
      }

      if (!currentCartId) {
        await dispatch(
          createCart({
            user: userId,
            items: [{ product: product._id!, quantity: 1 }],
          })
        ).unwrap();
      } else {
        await dispatch(
          updateCart({
            cartId: currentCartId,
            items: updatedItems,
          })
        ).unwrap();
      }

      await dispatch(fetchCart(userId));
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product));
    toast.success(`${product.title} added to wishlist`);
  };

  return (
    <div className="relative block aspect-square h-full w-full">
      <Link href={`/products/${product._id}`}>
        <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-neutral-400 bg-white dark:border-neutral-800 dark:bg-black">
          <Image
            src={getImageUrl(product.image)}
            alt={product.title}
            fill
            unoptimized
            className="relative h-full w-full object-contain transition duration-300 ease-in-out group-hover:scale-105"
          />

          {/* Bottom overlay with product info */}
          <div className="absolute bottom-0 left-0 flex w-full px-4 pb-4">
            <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
              <h3 className="mr-4 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">
                {product.title}
              </h3>
              <p className="flex-none rounded-full bg-black p-2 text-white dark:bg-white dark:text-black">
                ${product.price.toFixed(2)}
                <span className="ml-1 inline">USD</span>
              </p>
            </div>
          </div>

          {/* Category badge in top corner */}
          {product.category && (
            <Badge
              className="absolute top-2 left-2 border-neutral-200 bg-white/70 text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white"
              variant="secondary"
            >
              {product.category}
            </Badge>
          )}

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.category && (
              <Badge
                className="border-neutral-200 bg-white/70 text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white"
                variant="secondary"
              >
                {product.category}
              </Badge>
            )}

            {product.rating && (
              <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white/70 px-2 py-1 text-xs font-medium text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span>{product.rating.rate}</span>
                <span className="text-[10px] opacity-70">
                  ({product.rating.count})
                </span>
              </div>
            )}
          </div>


          {/* Add to cart button - appears on hover */}
          <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              size={"icon"}
              className="rounded-full bg-black text-white shadow-lg hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              <ShoppingCart />
            </Button>
          </div>
          <div className="absolute top-2 right-12 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button
              variant="ghost"
              className="rounded-full bg-black text-white shadow-lg hover:bg-gray-800 disabled:opacity-50 dark:bg-whit dark:hover:bg-gray-200"
              onClick={(e) => {
                e.preventDefault();
                handleAddToWishlist();
              }}
              size={"icon"}
            >
              <Heart className="h-5 w-5 text-white " />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
