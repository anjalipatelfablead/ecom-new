"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { Order, OrderItem } from "@/redux/products/orderSlice";

interface OrderCardProps {
    order: Order;
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case "processing":
            return <Clock className="h-4 w-4" />;
        case "shipped":
            return <Truck className="h-4 w-4" />;
        case "delivered":
            return <CheckCircle className="h-4 w-4" />;
        default:
            return <Package className="h-4 w-4" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "processing":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        case "shipped":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        case "delivered":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
};

const getProductInfo = (item: OrderItem) => {
    if (typeof item.product === "string") {
        return { title: "Unknown Product", image: "/placeholder.png" };
    }
    return {
        title: item.product.title || "Unknown Product",
        image: item.product.image || "/placeholder.png",
    };
};

const OrderCard = memo(function OrderCard({ order }: OrderCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Order {order._id.substring(0, 8)}</CardTitle>
                        <p className="text-muted-foreground text-sm">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <p className="mt-2 text-lg font-semibold">
                            ₹ {order.totalAmount.toFixed(2)}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                    {order.items.map((item, index) => {
                        const productInfo = getProductInfo(item);
                        return (
                            <div key={`${order._id}-${index}`} className="flex items-center space-x-4">
                                <div className="relative h-16 w-16 flex-shrink-0">
                                    <Image
                                        src={productInfo.image}
                                        alt={productInfo.title}
                                        fill
                                        className="rounded-md object-contain"
                                        sizes="64px"
                                        quality={75}
                                        loading="lazy"
                                        unoptimized
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate">{productInfo.title}</h4>
                                    <p className="text-muted-foreground text-sm">
                                        ₹ {item.price.toFixed(2)} × {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-medium">
                                        ₹ {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Details */}
                <div className="border-t pt-4">
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                        <div>
                            <p className="text-muted-foreground font-medium">
                                Delivery Address
                            </p>
                            <p className="text-xs">
                                {order.shippingAddress.address}, {order.shippingAddress.city}
                            </p>
                        </div>
                        {order.trackingNumber && (
                            <div>
                                <p className="text-muted-foreground font-medium">
                                    Tracking Number
                                </p>
                                <p className="font-mono">{order.trackingNumber}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-muted-foreground font-medium">Status</p>
                            <p className="capitalize">{order.status}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {order.trackingNumber && (
                    <div className="flex gap-2 pt-4">
                        <Button variant="outline" size="sm">
                            Track Package
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

export default OrderCard;