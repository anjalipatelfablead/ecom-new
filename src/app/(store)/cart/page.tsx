  // "use client";

  // import { Button } from "@/components/ui/button";
  // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  // // import { useCart } from "@/lib/cart-context";
  // import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
  // import Image from "next/image";
  // import Link from "next/link";
  // import { toast } from "sonner";

  // import { useDispatch, useSelector } from "react-redux";
  // import { RootState } from "@/redux/store";
  // import { removeFromCart, updateQuantity, clearUserCart, setUserCart, } from "@/redux/products/cartSlice";
  // // import { deleteCart, updateCart, clearCartState, } from "@/redux/products/cartSlice";

  // import { useEffect, useState } from "react";
  // import { addToWishlist } from "@/redux/products/wishlistSlice";
  // // import { addToCart } from "@/redux/cart/cartSlice";

  // import dynamic from "next/dynamic";

  // const CartItemsList = dynamic(() => import("./CartItemsList"), { loading: () => <p>Loading cart...</p> });

  // const OrderSummary = dynamic(() => import("./OrderSummary"), { loading: () => <p>Loading Order Summary...</p> })
  // export default function CartPage() {
  //   // const { items, removeFromCart, updateQuantity, totalPrice, clearCart } =useCart();
  //   const [deleteModal, setDeleteModal] = useState<{
  //     open: boolean;
  //     itemId: number | null;
  //     itemTitle: string;
  //   } | null>(null);

  //   const dispatch = useDispatch();
  //   const items = useSelector((state: RootState) => state.cart.items);

  //   useEffect(() => {
  //     const user = sessionStorage.getItem("loggedUser");
  //     if (user) {
  //       const { email } = JSON.parse(user);
  //       dispatch(setUserCart(email));
  //     } else {
  //       dispatch(setUserCart("guest"));
  //     }
  //   }, [dispatch]);



  //   const totalPrice = items.reduce(
  //     (sum, item) => sum + item.price * item.quantity,
  //     0
  //   );

  //   // const handleRemoveItem = (id: number, title: string) => {
  //   //   dispatch(removeFromCart(id));
  //   //   toast.success(`${title} removed from cart`);
  //   // };

  //   const handleClearCart = () => {
  //     dispatch(clearUserCart());
  //     toast.success("Cart cleared");
  //   };

  //   const handleDeleteClick = (id: number, title: string) => {
  //     setDeleteModal({ open: true, itemId: id, itemTitle: title });
  //   };

  //   const handleCancelDelete = () => {
  //     setDeleteModal(null);
  //   };

  //   const handleConfirmDelete = () => {
  //     if (deleteModal?.itemId !== null && deleteModal?.itemId !== undefined) {
  //       dispatch(removeFromCart(deleteModal.itemId));
  //       toast.success(`${deleteModal.itemTitle || "Item"} removed from cart`);
  //     }
  //     setDeleteModal(null);
  //   };

  //   const handleMoveToWishlist = () => {
  //     if (deleteModal?.itemId !== null && deleteModal?.itemId !== undefined) {
  //       const item = items.find(i => i.id === deleteModal.itemId);
  //       if (item) {
  //         dispatch(addToWishlist(item));
  //         dispatch(removeFromCart(item.id));
  //         toast.success(`${item.title} moved to wishlist`);
  //       }
  //     }
  //     setDeleteModal(null);
  //   };

  //   if (items.length === 0) {
  //     return (
  //       <div className="container mx-auto px-4 py-8">
  //         <div className="space-y-6 text-center">
  //           <ShoppingBag className="text-muted-foreground mx-auto h-24 w-24" />
  //           <div>
  //             <h1 className="mb-2 text-3xl font-bold">Your cart is empty</h1>
  //             <p className="text-muted-foreground mb-6">
  //               Looks like you haven&apos;t added any items to your cart yet.
  //             </p>
  //             <Link href="/">
  //               <Button size="lg">Continue Shopping</Button>
  //             </Link>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  //   return (

  //     <>
  //       <div className="container mx-auto px-4 py-8">
  //         <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

  //         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">


  //           <div className="lg:col-span-2">
  //             <CartItemsList
  //               items={items}
  //               onDeleteClick={handleDeleteClick}
  //               onUpdateQuantity={(id, qty) =>
  //                 dispatch(updateQuantity({ productId: id, quantity: qty }))
  //               }
  //             />
  //           </div>

  //           <div>
  //             <OrderSummary items={items} />
  //           </div>

  //         </div>
  //       </div>

  //       {deleteModal?.open && (
  //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
  //           {/* <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"> */}
  //           <div className="bg-white rounded-lg p-6 shadow-lg w-150">
  //             <h2 className="text-lg font-semibold mb-4">
  //               What do you want to do with "{deleteModal?.itemTitle || ""}"?
  //             </h2>
  //             <div className="flex justify-end gap-3">
  //               <Button variant="outline" onClick={handleCancelDelete}>
  //                 Cancel
  //               </Button>
  //               <Button variant="destructive" onClick={handleConfirmDelete}>
  //                 Delete
  //               </Button>
  //               <Button variant="secondary" onClick={handleMoveToWishlist}>
  //                 Add to Wishlist
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //     </>
  //   );
  // }





    "use client";

    import { Button } from "@/components/ui/button";
    import { ShoppingBag } from "lucide-react";
    import Link from "next/link";
    import { toast } from "sonner";

    import { useDispatch, useSelector } from "react-redux";
    import { RootState, AppDispatch } from "@/redux/store";
    import {
      fetchCart,
      updateCart,
      deleteCart,
    } from "@/redux/products/cartSlice";

    import { useEffect, useState } from "react";
    import { addToWishlist } from "@/redux/products/wishlistSlice";
    import dynamic from "next/dynamic";

    const CartItemsList = dynamic(() => import("./CartItemsList"), {
      loading: () => <p>Loading cart...</p>,
    });

    const OrderSummary = dynamic(() => import("./OrderSummary"), {
      loading: () => <p>Loading Order Summary...</p>,
    });

    export default function CartPage() {
      const dispatch = useDispatch<AppDispatch>();

      const { items, cartId } = useSelector(
        (state: RootState) => state.cart
      );

      const userId = useSelector(
        (state: RootState) => state.auth.currentUser?._id
      );

      const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        productId: string | null;
        itemTitle: string;
      } | null>(null);

      /* FETCH CART */
      useEffect(() => {
        if (userId) {
          dispatch(fetchCart(userId));
        }
      }, [dispatch, userId]);

      /* TOTAL PRICE */
      const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      /* CLEAR CART */
      const handleClearCart = async () => {
        if (!cartId) return;

        await dispatch(deleteCart(cartId));
        toast.success("Cart cleared");
      };

      /* DELETE MODAL OPEN */
      const handleDeleteClick = (productId: string, title: string) => {
        setDeleteModal({ open: true, productId, itemTitle: title });
      };

      const handleCancelDelete = () => {
        setDeleteModal(null);
      };

      /* CONFIRM DELETE */
      const handleConfirmDelete = async () => {
        if (!deleteModal?.productId || !cartId) return;

        const updatedItems = items
          .filter((item) => item.product._id !== deleteModal.productId)
          .map((item) => ({
            product: item.product._id!,
            quantity: item.quantity,
          }));

        await dispatch(
          updateCart({
            cartId,
            items: updatedItems,
          })
        );

        toast.success(`${deleteModal.itemTitle} removed from cart`);
        setDeleteModal(null);
      };

      /* MOVE TO WISHLIST */
      const handleMoveToWishlist = async () => {
        if (!deleteModal?.productId || !cartId || !userId) {
          toast.error("Please login first");
          return;
        }

        const item = items.find(
          (i) => i.product._id === deleteModal.productId
        );

        if (!item) return;

        try {
          await dispatch(
            addToWishlist({
              userId,
              productId: item.product._id!,
            })
          ).unwrap();

          const updatedItems = items
            .filter((i) => i.product._id !== deleteModal.productId)
            .map((i) => ({
              product: i.product._id!,
              quantity: i.quantity,
            }));

          await dispatch(
            updateCart({
              cartId,
              items: updatedItems,
            })
          );

          toast.success(`${item.product.title} moved to wishlist`);
          setDeleteModal(null);
        } catch (error) {
          toast.error("Failed to move to wishlist");
        }
      };

      /* UPDATE QUANTITY */
      const handleUpdateQuantity = async (
        productId: string,
        quantity: number
      ) => {
        if (!cartId) return;

        const updatedItems = items.map((item) =>
          item.product._id === productId
            ? { product: productId, quantity }
            : { product: item.product._id!, quantity: item.quantity }
        );

        await dispatch(
          updateCart({
            cartId,
            items: updatedItems,
          })
        );
      };

      /* EMPTY CART UI */
      if (items.length === 0) {
        return (
          <div className="container mx-auto px-4 py-8 text-center">
            <ShoppingBag className="text-muted-foreground mx-auto h-24 w-24" />
            <h1 className="mt-4 text-3xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground mt-2 mb-6">
              Looks like you haven't added anything yet.
            </p>
            <Link href="/">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        );
      }

      return (
        <>
          <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CartItemsList
                  items={items}
                  onDeleteClick={handleDeleteClick}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              </div>

              <div>
                {/* <OrderSummary items={items} totalPrice={totalPrice} /> */}
                <Button
                  variant="destructive"
                  className="w-full mt-4"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>

          {/* DELETE MODAL */}
          {deleteModal?.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
              <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">
                  What do you want to do with "{deleteModal.itemTitle}"?
                </h2>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleCancelDelete}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleConfirmDelete}>
                    Delete
                  </Button>
                  <Button variant="secondary" onClick={handleMoveToWishlist}>
                    Add to Wishlist
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }