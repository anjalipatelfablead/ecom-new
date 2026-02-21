import Navbar from "@/components/navbar";
import { CartInitializer } from "@/components/cart-initializer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <CartInitializer />
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
