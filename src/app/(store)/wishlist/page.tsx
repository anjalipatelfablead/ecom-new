"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { removeFromWishlist, clearWishlist, } from "@/redux/products/wishlistSlice";
import { createCart, updateCart, fetchCart } from "@/redux/products/cartSlice";

import { useEffect } from "react";
import { setUserWishlist } from "@/redux/products/wishlistSlice";

import dynamic from "next/dynamic";

export default function WishlistPage() {

  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.items
  );
  
  const { cartId, items } = useSelector(
    (state: RootState) => state.cart
  );

  const userId = useSelector(
    (state: RootState) => state.auth.currentUser?._id
  );

  const WishlistGrid = dynamic(
    () => import("./WishlistGrid"),
    {
      loading: () => <p>Loading wishlist...</p>,
    }
  );

  const handleRemoveFromWishlist = (id: string, title: string) => {
    dispatch(removeFromWishlist(id));
    toast.success(`${title} removed from wishlist`);
  };


  const handleAddToCart = async (item: (typeof wishlistItems)[0]) => {
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
        (cartItem) => cartItem.product._id === item._id
      );

      let updatedItems;

      if (existingItem) {
        updatedItems = currentItems.map((cartItem) =>
          cartItem.product._id === item._id
            ? { product: item._id!, quantity: existingItem.quantity + 1 }
            : { product: cartItem.product._id!, quantity: cartItem.quantity }
        );
      } else {
        updatedItems = [
          ...currentItems.map((cartItem) => ({
            product: cartItem.product._id!,
            quantity: cartItem.quantity,
          })),
          { product: item._id!, quantity: 1 },
        ];
      }

      if (!currentCartId) {
        await dispatch(
          createCart({
            user: userId,
            items: [{ product: item._id!, quantity: 1 }],
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
      toast.success(`${item.title} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };


  const handleMoveAllToCart = async () => {
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

      const newItems = wishlistItems.map((item) => ({
        product: item._id!,
        quantity: 1,
      }));

      const allItems = [
        ...currentItems.map((cartItem) => ({
          product: cartItem.product._id!,
          quantity: cartItem.quantity,
        })),
        ...newItems,
      ];

      if (!currentCartId) {
        await dispatch(
          createCart({
            user: userId,
            items: newItems,
          })
        ).unwrap();
      } else {
        await dispatch(
          updateCart({
            cartId: currentCartId,
            items: allItems,
          })
        ).unwrap();
      }

      await dispatch(fetchCart(userId));
      dispatch(clearWishlist());
      toast.success(`${wishlistItems.length} items added to cart!`);
    } catch (error) {
      toast.error("Failed to add items to cart");
    }
  };

  useEffect(() => {
    const user = sessionStorage.getItem("loggedUser");
    if (user) {
      const { email } = JSON.parse(user);
      dispatch(setUserWishlist(email));
    } else {
      dispatch(setUserWishlist("guest"));
    }
  }, [dispatch]);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex-1">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
          <h1 className="mt-2 text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} items saved for later
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <Button onClick={handleMoveAllToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add All to Cart
          </Button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="text-muted-foreground mb-4 h-16 w-16" />
            <h3 className="mb-2 text-xl font-semibold">
              Your wishlist is empty
            </h3>
            <p className="text-muted-foreground mb-6 text-center">
              Save items you love to your wishlist. They&apos;ll appear here so
              you can easily find them later.
            </p>
            <Link href="/">
              <Button>Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        // <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        //   {wishlistItems.map((item) => (
        //     <div
        //       key={item.id}
        //       className="relative block aspect-square h-full w-full"
        //     >
        //       <Link href={`/products/${item.id}`}>
        //         <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
        //           <Image
        //             src={item.image}
        //             alt={item.title}
        //             fill
        //             className="relative h-full w-full object-contain transition duration-300 ease-in-out group-hover:scale-105"
        //             sizes="(min-width: 768px) 33vw, 100vw"
        //             unoptimized
        //           />

        //           {/* Bottom overlay with product info */}
        //           <div className="absolute bottom-0 left-0 flex w-full px-4 pb-4">
        //             <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        //               <h3 className="mr-4 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">
        //                 {item.title}
        //               </h3>
        //               <div className="flex items-center gap-1">
        //                 <p className="flex-none rounded-full bg-black p-2 text-white dark:bg-white dark:text-black">
        //                   ${item.price.toFixed(2)}
        //                 </p>
        //                 {item.price > item.price && (
        //                   <span className="text-muted-foreground text-xs line-through">
        //                     ${item.price.toFixed(2)}
        //                   </span>
        //                 )}
        //               </div>
        //             </div>
        //           </div>

        //           {/* Stock status overlay */}
        //           {/* {!item.inStock && (
        //             <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        //               <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
        //                 Out of Stock
        //               </span>
        //             </div>
        //           )} */}

        //           {/* Remove from wishlist button - top left */}
        //           <div className="absolute top-2 left-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        //             <Button
        //               variant="ghost"
        //               size="icon"
        //               className="h-8 w-8 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black"
        //               onClick={(e) => {
        //                 e.preventDefault();
        //                 handleRemoveFromWishlist(item.id, item.title);
        //               }}
        //             >
        //               <Trash2 className="h-4 w-4 text-red-500" />
        //             </Button>
        //           </div>

        //           {/* Add to cart button - top right */}
        //           <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        //             <Button
        //               size={"icon"}
        //               onClick={(e) => {
        //                 e.preventDefault();
        //                 handleAddToCart(item);
        //               }}
        //               // disabled={!item.inStock}
        //               className="rounded-full bg-black text-white shadow-lg hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        //             >
        //               <ShoppingCart />
        //             </Button>
        //           </div>

        //           {/* Added date badge - top center */}
        //           <div className="absolute top-2 left-1/2 -translate-x-1/2 transform">
        //             <span className="rounded-full bg-white/70 px-2 py-1 text-xs text-black backdrop-blur-md dark:bg-black/70 dark:text-white">
        //               Added {new Date(item.addedDate).toLocaleDateString()}
        //             </span>
        //           </div>
        //         </div>
        //       </Link>
        //     </div>
        //   ))}
        // </div>
        <WishlistGrid
          wishlistItems={wishlistItems}
          handleRemoveFromWishlist={handleRemoveFromWishlist}
          handleAddToCart={handleAddToCart}
        />
      )}

      {/* Recommendations */}
      {wishlistItems.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>You might also like</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Based on your wishlist, we think you&apos;ll love these items
              </p>
              <Link href="/">
                <Button variant="outline">Browse Recommendations</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
