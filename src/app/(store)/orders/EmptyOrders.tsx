import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import Link from "next/link";

export default function EmptyOrders() {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="text-muted-foreground mb-4 h-16 w-16" />
                <h3 className="mb-2 text-xl font-semibold">No orders found</h3>
                <p className="text-muted-foreground mb-6 text-center">
                    You haven&apos;t placed any orders yet. Start shopping to see your
                    orders here.
                </p>
                <Link href="/">
                    <Button>Start Shopping</Button>
                </Link>
            </CardContent>
        </Card>
    );
}