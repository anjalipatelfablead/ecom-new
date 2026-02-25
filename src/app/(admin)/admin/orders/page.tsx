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
import { Trash2, ChevronDown, CheckCircle, Truck, Package, XCircle, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
            dispatch(deleteOrder(orderId));
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "processing":
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
            case "confirmed":
                return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Confirmed</Badge>;
            case "shipped":
                return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Shipped</Badge>;
            case "delivered":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
            case "cancelled":
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
    
    if (error) return (
        <div className="p-6 text-center">
            <div className="text-destructive font-medium mb-2">Error loading orders</div>
            <p className="text-muted-foreground">{error}</p>
        </div>
    );

    return (
        <div className="space-y-6 p-8 bg-gray-50/30 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
                    <p className="text-muted-foreground mt-1">Manage and track all customer orders</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[250px]">Customer</TableHead>
                            <TableHead>Order Details</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">
                                            {order.user?.username || "Guest User"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {order.user?.email}
                                        </span>
                                        <span className="text-[10px] mt-1 font-mono text-gray-400 uppercase tracking-tighter">
                                            ID: {order._id.slice(-8)}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="max-w-[300px]">
                                        {order.items.map((item, index) => {
                                            const product = typeof item.product === "object" ? item.product : null;
                                            return (
                                                <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                                                    <span className="text-sm font-medium truncate">
                                                        {product?.title || "Product Item"}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                        ×{item.quantity}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {/* {order.items.length > 2 && (
                                            <span className="text-xs text-blue-600 font-medium">
                                                +{order.items.length - 2} more items
                                            </span>
                                        )} */}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="font-bold text-gray-900">
                                        ${order.totalAmount.toFixed(2)}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground uppercase">
                                        {order.paymentMethod}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(order.status)}
                                        
                                        {order.status !== "delivered" && order.status !== "cancelled" && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    {(order.status === "processing" || order.status === "confirmed") && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleStatusChange(order._id, "shipped")}>
                                                                <Truck className="mr-2 h-4 w-4 text-purple-600" />
                                                                <span>Mark Shipped</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusChange(order._id, "cancelled")} className="text-destructive">
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                <span>Cancel Order</span>
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {order.status === "shipped" && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(order._id, "delivered")}>
                                                            <Package className="mr-2 h-4 w-4 text-green-600" />
                                                            <span>Mark Delivered</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </TableCell>

                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleDelete(order._id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete Order</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}

                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Package className="h-10 w-10 mb-2 opacity-20" />
                                        <p>No orders found in the database</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}