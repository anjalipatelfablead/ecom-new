// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Minus, Plus, Trash2 } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { CartItem } from "@/redux/products/cartSlice";

// interface Props {
//     items: CartItem[];
//     onDeleteClick: (id: number, title: string) => void;
//     onUpdateQuantity: (productId: number, quantity: number) => void;
// }

// export default function CartItemsList({
//     items,
//     onDeleteClick,
//     onUpdateQuantity,
// }: Props) {
//     return (
//         <div className="space-y-4">
//             {items.map((item) => (
//                 <Card key={item.id}>
//                     <CardContent className="p-4 md:p-6">
//                         <div className="flex items-center space-x-4">
//                             <div className="relative h-20 w-20">
//                                 <Image
//                                     src={item.image}
//                                     alt={item.title}
//                                     fill
//                                     className="rounded-md object-contain"
//                                 />
//                             </div>

//                             <div className="flex-1">
//                                 <Link href={`/products/${item.id}`}>
//                                     <h3 className="font-semibold cursor-pointer hover:text-primary">
//                                         {item.title}
//                                     </h3>
//                                 </Link>
//                                 <p className="text-sm text-muted-foreground">
//                                     ${item.price.toFixed(2)} each
//                                 </p>
//                             </div>

//                             <div className="flex items-center space-x-2">
//                                 <Button
//                                     size="icon"
//                                     variant="outline"
//                                     onClick={() =>
//                                         onUpdateQuantity(item.id, item.quantity - 1)
//                                     }
//                                     disabled={item.quantity <= 1}
//                                 >
//                                     <Minus className="h-4 w-4" />
//                                 </Button>

//                                 <span>{item.quantity}</span>

//                                 <Button
//                                     size="icon"
//                                     variant="outline"
//                                     onClick={() =>
//                                         onUpdateQuantity(item.id, item.quantity + 1)
//                                     }
//                                 >
//                                     <Plus className="h-4 w-4" />
//                                 </Button>
//                             </div>

//                             <div className="font-semibold">
//                                 ${(item.price * item.quantity).toFixed(2)}
//                             </div>

//                             <Button
//                                 variant="ghost"
//                                 onClick={() => onDeleteClick(item.id, item.title)}
//                                 className="text-red-500"
//                             >
//                                 <Trash2 className="h-4 w-4" />
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>
//             ))}
//         </div>
//     );
// }



"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/redux/products/cartSlice";
import { memo, useCallback } from "react";
import { getImageUrl } from "@/lib/utils";

interface Props {
    items: CartItem[];
    onDeleteClick: (id: string, title: string) => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
}

//  Memoized individual cart item
const SingleCartItem = memo(function SingleCartItem({
    item,
    onDeleteClick,
    onUpdateQuantity,
}: {
    item: CartItem;
    onDeleteClick: (id: string, title: string) => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
}) {
    const product = item.product;
    //  Memoize handlers to prevent re-creating functions
    const handleDecrease = useCallback(() => {
        if (item.quantity > 1) {
            onUpdateQuantity(product._id!, item.quantity - 1);
        }
    }, [product._id, item.quantity, onUpdateQuantity]);

    const handleIncrease = useCallback(() => {
        onUpdateQuantity(product._id!, item.quantity + 1);
    }, [product._id, item.quantity, onUpdateQuantity]);

    const handleDelete = useCallback(() => {
        onDeleteClick(product._id!, product.title);
    }, [product._id, product.title, onDeleteClick]);


    return (
        <Card>
            <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-4">
                    <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                            src={getImageUrl(product.image)}
                            alt={product.title}
                            fill
                            className="rounded-md object-contain"
                            sizes="80px"
                            quality={75}
                            loading="lazy" //  Lazy load images
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <Link href={`/products/${product._id}`}>
                            <h3 className="font-semibold cursor-pointer hover:text-primary truncate">
                                {product.title}
                            </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            ${product.price.toFixed(2)} each
                        </p>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={handleDecrease}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>

                        <span className="w-8 text-center">{item.quantity}</span>

                        <Button
                            size="icon"
                            variant="outline"
                            onClick={handleIncrease}
                            aria-label="Increase quantity"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="font-semibold flex-shrink-0">
                        ${(product.price * item.quantity).toFixed(2)}
                    </div>

                    <Button
                        variant="ghost"
                        onClick={handleDelete}
                        className="text-red-500 flex-shrink-0"
                        aria-label={`Remove ${product.title}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
});

export default function CartItemsList({
    items,
    onDeleteClick,
    onUpdateQuantity,
}: Props) {
    return (
        <div className="space-y-4">
            {items.map((item) => (
                <SingleCartItem
                    key={item.product._id}
                    item={item}
                    onDeleteClick={onDeleteClick}
                    onUpdateQuantity={onUpdateQuantity}
                />
            ))}
        </div>
    );
}