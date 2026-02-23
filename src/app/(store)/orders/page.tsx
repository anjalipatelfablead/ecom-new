"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useEffect } from "react";

import { getOrders } from "@/redux/products/orderSlice";
import OrderCard from "./OrderCard";
import EmptyOrders from "./EmptyOrders";
import HelpSection from "./HelpSection";

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.order);
  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);

  useEffect(() => {
    if (userId) {
      dispatch(getOrders(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </Link>
        <div className="mt-2">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">
            Track your order status and view order history
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading orders...</span>
          </CardContent>
        </Card>
      )}

      {/* Orders List or Empty State */}
      {!loading && (
        <>
          {orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Help Section */}
      <HelpSection />
    </div>
  );
}