// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft, CheckCircle, Clock, Package, Truck } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// const getStatusIcon = (status: string) => {
//   switch (status) {
//     case "processing":
//       return <Clock className="h-4 w-4" />;
//     case "shipped":
//       return <Truck className="h-4 w-4" />;
//     case "delivered":
//       return <CheckCircle className="h-4 w-4" />;
//     default:
//       return <Package className="h-4 w-4" />;
//   }
// };

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "processing":
//       return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
//     case "shipped":
//       return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
//     case "delivered":
//       return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
//     default:
//       return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
//   }
// };

// export default function OrdersPage() {

//   const user =
//     typeof window !== "undefined"
//       ? JSON.parse(sessionStorage.getItem("loggedUser") || "null")
//       : null;

//   const email = user?.email;

//   console.log("email  ", email);

//   const orders = useSelector((state: RootState) =>
//     email ? state.order.ordersByEmail[email] || [] : []
//   );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <Link href="/">
//           <Button variant="ghost" size="sm">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Shop
//           </Button>
//         </Link>
//         <div className="mt-2">
//           <h1 className="text-3xl font-bold">My Orders</h1>
//           <p className="text-muted-foreground">
//             Track your order status and view order history
//           </p>
//         </div>
//       </div>

//       {orders.length === 0 ? (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-16">
//             <Package className="text-muted-foreground mb-4 h-16 w-16" />
//             <h3 className="mb-2 text-xl font-semibold">No orders found</h3>
//             <p className="text-muted-foreground mb-6 text-center">
//               You haven&apos;t placed any orders yet. Start shopping to see your
//               orders here.
//             </p>
//             <Link href="/">
//               <Button>Start Shopping</Button>
//             </Link>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => (
//             <Card key={order.id}>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <CardTitle className="text-lg">Order {order.id}</CardTitle>
//                     <p className="text-muted-foreground text-sm">
//                       Placed on {new Date(order.date).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <Badge className={getStatusColor(order.status)}>
//                       {getStatusIcon(order.status)}
//                       <span className="ml-1 capitalize">{order.status}</span>
//                     </Badge>
//                     <p className="mt-2 text-lg font-semibold">
//                       ${order.total.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {/* Order Items */}
//                 <div className="space-y-3">
//                   {order.items.map((item) => (
//                     <div key={item.id} className="flex items-center space-x-4">
//                       <div className="relative h-16 w-16 flex-shrink-0">
//                         <Image
//                           src={item.image}
//                           alt={item.title}
//                           fill
//                           className="rounded-md object-contain"
//                           unoptimized
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="font-medium">{item.title}</h4>
//                         <p className="text-muted-foreground text-sm">
//                           ${item.price.toFixed(2)} × {item.quantity}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-medium">
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Order Details */}
//                 <div className="border-t pt-4">
//                   <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
//                     <div>
//                       <p className="text-muted-foreground font-medium">
//                         Estimated Delivery
//                       </p>
//                       <p>
//                         {new Date(order.estimatedDelivery).toLocaleDateString()}
//                       </p>
//                     </div>
//                     {order.trackingNumber && (
//                       <div>
//                         <p className="text-muted-foreground font-medium">
//                           Tracking Number
//                         </p>
//                         <p className="font-mono">{order.trackingNumber}</p>
//                       </div>
//                     )}
//                     <div>
//                       <p className="text-muted-foreground font-medium">
//                         Status
//                       </p>
//                       <p className="capitalize">{order.status}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-2 pt-4">
//                   {order.trackingNumber && (
//                     <Button variant="outline" size="sm">
//                       Track Package
//                     </Button>
//                   )}
//                   {/* <Button variant="outline" size="sm">
//                     View Details
//                   </Button>
//                   {order.status === "delivered" && (
//                     <Button variant="outline" size="sm">
//                       Write Review
//                     </Button>
//                   )}
//                   <Button variant="outline" size="sm">
//                     Reorder
//                   </Button> */}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Additional Information */}
//       <Card className="mt-8">
//         <CardHeader>
//           <CardTitle>Need Help?</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
//             <div>
//               <h4 className="mb-2 font-medium">Order Questions</h4>
//               <p className="text-muted-foreground mb-2">
//                 Have questions about your order? We&apos;re here to help.
//               </p>
//               <Button variant="outline" size="sm">
//                 Contact Support
//               </Button>
//             </div>
//             <div>
//               <h4 className="mb-2 font-medium">Returns & Exchanges</h4>
//               <p className="text-muted-foreground mb-2">
//                 30-day return policy on all items. Free returns on orders over
//                 $50.
//               </p>
//               <Button variant="outline" size="sm">
//                 Start Return
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useMemo } from "react";

import OrderCard from "./OrderCard";
import EmptyOrders from "./EmptyOrders";
import HelpSection from "./HelpSection";

export default function OrdersPage() {
  //  Memoize user email to prevent unnecessary recalculations
  const email = useMemo(() => {
    if (typeof window === "undefined") return null;
    const user = JSON.parse(sessionStorage.getItem("loggedUser") || "null");
    return user?.email || null;
  }, []);

  const orders = useSelector((state: RootState) =>
    email ? state.order.ordersByEmail[email] || [] : []
  );

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

      {/* Orders List or Empty State */}
      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Help Section */}
      <HelpSection />
    </div>
  );
}