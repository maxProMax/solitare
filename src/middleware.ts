import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALES } from "./locales";

function middleware(request: NextRequest) {
  const nextIntlMiddleware = createMiddleware(routing)(request);
  const browserLanguage =
    headers().get("accept-language")?.split(",")[0] || "en";
  const [country] = browserLanguage.split("-");

  if (
    request.nextUrl.pathname === "/" &&
    country !== DEFAULT_LOCALE &&
    LOCALES.includes(country)
  ) {
    return NextResponse.redirect(new URL(`/${country}`, request.url));
  }

  return nextIntlMiddleware;
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next|assets|favicon.ico|sitemap.xml|robots.txt|sw.js|.*\\..*).*)",
  ],
};

export default middleware;
