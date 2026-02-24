"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { removeFromWishlist, clearWishlist, fetchWishlist, addToWishlist } from "@/redux/products/wishlistSlice";
import { createCart, updateCart, fetchCart } from "@/redux/products/cartSlice";

import { useEffect } from "react";

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

  const handleRemoveFromWishlist = async (id: string, title: string) => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }
    try {
      await dispatch(
        removeFromWishlist({
          userId,
          productId: id,
        })
      ).unwrap();
      toast.success(`${title} removed from wishlist`);
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
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
      await dispatch(clearWishlist(userId)).unwrap();
      toast.success(`${wishlistItems.length} items added to cart!`);
    } catch (error) {
      toast.error("Failed to add items to cart");
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [userId, dispatch]);


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
