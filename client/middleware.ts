// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { STORAGES } from "./constant/storages";

// Hàm logic middleware cho admin
function adminGuard(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const token = req.cookies.get(STORAGES.ACCESS_TOKEN)?.value;

  const allow = ["/admin/login", "/admin/forgot", "/admin/register"];
  const isAuth = allow.includes(pathname);

  if (!pathname.startsWith("/admin")) {
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  if (!token && !isAuth) {
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (token && pathname === "/admin/login") {
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// Hàm logic middleware cho user
function userGuard(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  // ví dụ đọc cookie user-token nếu có
  // const token = req.cookies.get(STORAGES.USER_TOKEN)?.value;

  // const allow = ["/user/login", "/user/register"];
  // const isAuth = allow.includes(pathname);

  if (!pathname.startsWith("/user")) {
    url.pathname = "/user";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const role = process.env.NEXT_PUBLIC_ROLE;
  const isAdminPath = pathname.startsWith("/admin");
  const isUserPath = pathname.startsWith("/user");

  // 1) Nếu KHÔNG thuộc /admin hoặc /user -> redirect theo role của env
  if (!isAdminPath && !isUserPath) {
    const url = req.nextUrl.clone();
    if (role === "admin") {
      const token = req.cookies.get(STORAGES.ACCESS_TOKEN)?.value;
      url.pathname = token ? "/admin" : "/admin/login";
      return NextResponse.redirect(url);
    }
    // default hoặc role === 'user'
    url.pathname = "/user";
    return NextResponse.redirect(url);
  }

  if (role === "admin") {
    return adminGuard(req);
  }

  if (role === "user") {
    return userGuard(req);
  }

  return NextResponse.next();
}

// Match tất cả route trừ: _next, api, và file tĩnh (*.png, *.css, v.v.)
export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
