import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Normalize removing port if testing locally with custom hosts file
    const currentHost = hostname.split(':')[0];

    // If the domain is the specific shop domain (handling possible typos from the prompt)
    if (currentHost === 'shop.rebootx.shop' || currentHost === 'shop.reboots.shop') {

        // EXCEPT for the /checkout route, allow it to render as-is
        if (url.pathname.startsWith('/checkout')) {
            return NextResponse.next();
        }

        // ELSE: Any other route coming to this domain should REDIRECT to rebootx.shop
        const redirectUrl = new URL(url.pathname, 'https://rebootx.shop');
        redirectUrl.search = url.search; // Keep search params if any

        return NextResponse.redirect(redirectUrl);
    }

    // Continue normally for requests that are NOT on shop.rebootx.shop
    return NextResponse.next();
}

// In Next.js, this config tells the middleware which paths to run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
