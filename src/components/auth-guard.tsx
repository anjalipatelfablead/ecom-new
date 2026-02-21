"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const currentUser = useSelector(
    (state: RootState) => state.auth.currentUser
  );

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (!isAdmin && currentUser) {
      router.push("/");
    }
  }, [isAdmin, currentUser, router]);

  if (!isAdmin && currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Not Authenticated</h1>
          <p className="text-muted-foreground">
            Please login first.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
