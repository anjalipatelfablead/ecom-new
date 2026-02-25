"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createOrder } from "@/redux/products/orderSlice";
import { deleteCart, clearCartState } from "@/redux/products/cartSlice";
import { updateProductStock } from "@/redux/products/productSlice";
import { toast } from "sonner";

export default function CheckoutSuccessPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processOrder = async () => {
      const pendingOrderData = sessionStorage.getItem("pendingOrder");

      if (pendingOrderData) {
        try {
          const pendingOrder = JSON.parse(pendingOrderData);

          // Create the order in the database
          const result = await dispatch(
            createOrder({
              user: pendingOrder.user,
              items: pendingOrder.items,
              totalAmount: pendingOrder.totalAmount,
              shippingAddress: pendingOrder.shippingAddress,
              paymentMethod: pendingOrder.paymentMethod,
            })
          ).unwrap();

          // Generate order number from the created order
          const generatedOrderNumber = `ORD-${result._id.slice(-6).toUpperCase()}`;
          setOrderNumber(generatedOrderNumber);

          // Reduce stock for each ordered item
          const stockUpdatePromises = pendingOrder.items.map((item: { product: string; quantity: number }) =>
            dispatch(
              updateProductStock({
                id: item.product,
                quantity: item.quantity,
              })
            ).unwrap()
          );

          try {
            await Promise.all(stockUpdatePromises);
            toast.success("Stock updated successfully");
          } catch (stockError) {
            console.error("Failed to update stock:", stockError);
            toast.error("Order placed but stock update failed. Please contact support.");
          }

          // Clear the cart after successful order creation
          if (pendingOrder.cartId) {
            await dispatch(deleteCart(pendingOrder.cartId));
          }
          dispatch(clearCartState());

          // Clear pending order from sessionStorage
          sessionStorage.removeItem("pendingOrder");

          toast.success("Order placed successfully!");
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to create order");
          // Generate a fallback order number even if order creation fails
          setOrderNumber(`ORD-${Date.now().toString().slice(-6)}`);
        } finally {
          setIsProcessing(false);
        }
      } else {
        // No pending order found, just show success page
        setOrderNumber(`ORD-${Date.now().toString().slice(-6)}`);
        setIsProcessing(false);
      }
    };

    processOrder();
  }, [dispatch]);

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <Loader2 className="mx-auto h-24 w-24 animate-spin text-primary" />
            <h1 className="text-3xl font-bold">Processing Your Order...</h1>
            <p className="text-muted-foreground text-lg">
              Please wait while we confirm your payment and create your order.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
          <h1 className="text-3xl font-bold text-green-700">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Package className="mr-2 h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="mb-1 text-sm font-medium">Order Number</p>
              <p className="text-2xl font-bold">{orderNumber}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <p className="mb-1 font-medium">Estimated Delivery</p>
                <p className="text-muted-foreground">
                  {new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="mb-1 font-medium">Order Status</p>
                <p className="text-green-600">Processing</p>
              </div>
            </div>

            <div className="text-muted-foreground space-y-1 text-sm">
              {/* <p>📧 A confirmation email has been sent to your email address</p> */}
              <p>
                📦 You&apos;ll receive tracking information once your order
                ships
              </p>
              <p>💬 Questions? Contact our support team anytime</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            <Link href="/orders" className="w-full">
              <Button className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Track Your Order
              </Button>
            </Link>
          </div>

          <p className="text-muted-foreground text-sm">
            Need help?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
