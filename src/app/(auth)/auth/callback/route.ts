import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user exists in our database, if not create them
      const existingUser = await prisma.user.findUnique({
        where: { id: data.user.id },
      });

      if (!existingUser) {
        // Create new user in our database
        await prisma.user.create({
          data: {
            id: data.user.id,
            email: data.user.email!,
            role: "CREATOR",
          },
        });

        // Redirect to onboarding for new users
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/onboarding`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}/onboarding`);
        } else {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      // Check if user has completed onboarding
      const creator = await prisma.creator.findUnique({
        where: { userId: data.user.id },
      });

      if (!creator || !creator.onboardingComplete) {
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/onboarding`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}/onboarding`);
        } else {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      // Redirect to the intended page
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
