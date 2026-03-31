import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Supabase SSR middleware — must run on every request so that:
 *  1. The session cookie is refreshed when the access token expires.
 *  2. Server components and Route Handlers see a valid session.
 *
 * Without this, the token is never refreshed server-side and the user
 * appears logged out on every cold page load / dev restart.
 */
export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // Write updated cookies onto the response so the browser
                    // receives the refreshed token.
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: Do not add logic between createServerClient and getUser().
    // A mistake here could leave users randomly logged out.
    await supabase.auth.getUser();

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Run on all paths except:
         * - _next/static (static files)
         * - _next/image  (image optimisation)
         * - favicon.ico
         * - api/support  (internal Next.js API route)
         */
        "/((?!_next/static|_next/image|favicon.ico|api/support).*)",
    ],
};
