"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
    getOrders,
    updateOrderStatus,
    deleteOrder,
} from "@/redux/products/orderSlice";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function AdminOrderListPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading, error } = useSelector(
        (state: RootState) => state.order
    );

    useEffect(() => {
        dispatch(getOrders(undefined));
    }, [dispatch]);

    const handleStatusChange = (orderId: string, status: string) => {
        dispatch(updateOrderStatus({ orderId, status }));
    };

    const handleDelete = (orderId: string) => {
        if (confirm("Delete this order?")) {
            dispatch(deleteOrder(orderId));
        }
    };

    if (loading) return <div className="p-6">Loading orders...</div>;
    if (error) return <div className="p-6 text-destructive">Error: {error}</div>;

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold">All Orders</h1>

            <div className="bg-card rounded-lg border shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                {/* USER */}
                                <TableCell>
                                    <div className="font-medium">
                                        {order.user?.username}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {order.user?.email}
                                    </div>
                                </TableCell>

                                {/* PRODUCTS */}
                                <TableCell>
                                    <div className="space-y-2">
                                        {order.items.map((item, index) => {
                                            const product =
                                                typeof item.product === "object"
                                                    ? item.product
                                                    : null;

                                            return (
                                                <div key={index} className="text-sm">
                                                    <div className="font-medium">
                                                        {product?.title || "Product"}
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        Qty: {item.quantity} × ${item.price}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </TableCell>

                                {/* TOTAL */}
                                <TableCell className="font-semibold">
                                    ${order.totalAmount.toFixed(2)}
                                </TableCell>

                                {/* STATUS */}
                                <TableCell>
                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            handleStatusChange(order._id, e.target.value)
                                        }
                                        className="rounded border px-2 py-1"
                                    >
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </TableCell>

                                {/* DATE */}
                                <TableCell>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </TableCell>

                                {/* ACTIONS */}
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(order._id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}