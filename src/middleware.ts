// "use client";


// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const [isAuth, setIsAuth] = useState<boolean | null>(null);

//   useEffect(() => {
//     const user = sessionStorage.getItem("loggedUser");
//     if (!user) {
//       router.replace("/login"); 
//       setIsAuth(false);
//     } else {
//       setIsAuth(true);
//     }
//   }, [router]);

//   if (isAuth === null) return null; 

//   return <>{children}</>;
// }



// import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//   const loggedUser = req.cookies.get("loggedUser");
//   const { pathname } = req.nextUrl;

//   // Ignore Next.js internals and static files
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/favicon.ico") ||
//     pathname.startsWith("/api")
//   ) {
//     return NextResponse.next();
//   }

//   // Protect pages except login
//   if (!loggedUser && pathname !== "/login") {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (loggedUser && pathname === "/login") {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|favicon.ico).*)"],
// };





import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const loggedUser = req.cookies.get("loggedUser");
  const { pathname } = req.nextUrl;

  // Ignore Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Public routes
  const publicRoutes = ["/login", "/register"];

  const isPublicRoute = publicRoutes.includes(pathname);

  // If not logged in and trying to access protected route
  // if (!loggedUser && !isPublicRoute) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // If logged in and trying to access login/register
  // if (loggedUser && isPublicRoute) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
