"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CartItem } from "@/redux/products/cartSlice";
import { useMemo } from "react";

interface Props {
    items: CartItem[];
}

export default function OrderSummary({ items }: Props) {
    // Memoize all calculations - only recalculate when items change
    const summary = useMemo(() => {
        const totalPrice = items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        const shippingCost = totalPrice >= 100 ? 0 : 9.99;

        const grandTotal = totalPrice + shippingCost;

        return {
            totalPrice,
            totalItems,
            shippingCost,
            grandTotal,
            isFreeShipping: totalPrice >= 100,
        };
    }, [items]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between">
                    <span>Subtotal ({summary.totalItems} items)</span>
                    <span>${summary.totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                        {summary.isFreeShipping ? "Free" : `$${summary.shippingCost.toFixed(2)}`}
                    </span>
                </div>

                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${summary.grandTotal.toFixed(2)}</span>
                </div>

                <Link href="/checkout">
                    <Button className="w-full" size="lg">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}