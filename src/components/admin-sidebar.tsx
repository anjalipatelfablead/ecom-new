"use client";

import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, LogOut, Package, Plus, Users, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/redux/auth/authSlice";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Add Product",
    href: "/admin/add-product",
    icon: Plus,
  },
  {
    title: "User List",
    href: "/admin/userlist",
    icon: Users,
  },
  {
    title: "Order List",
    href: "/admin/orders",
    icon: Users,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/login");
  };

  return (
    <div className="bg-background flex h-full w-64 flex-col border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <span className="text-xl font-bold">Admin Panel</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="space-y-2 border-t p-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Theme</span>
          <ModeToggle />
        </div>
        <Link href="/">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Back to Store
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
