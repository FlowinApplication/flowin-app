import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/api/private(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = req.nextUrl;
  const pathname = url.pathname;

  const isApi = pathname.startsWith("/api/");
  const needsAuth = isProtectedRoute(req);

  if (needsAuth && !userId) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const redirect = new URL("/sign-in", url);
    redirect.searchParams.set("redirect_url", pathname + (url.search || ""));
    return NextResponse.redirect(redirect);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
