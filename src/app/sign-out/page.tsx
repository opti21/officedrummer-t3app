"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOutPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    // Redirect to home if the user is already signed out
    // or if the user status is still loading
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, isLoaded, router]);

  // Optionally, add a loading state while checking user status
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Render the sign-out button only if the user is signed in
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Sign Out
        </h1>
        {isSignedIn && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-2xl text-white">
              Are you sure you want to sign out?
            </p>
            <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
              <button className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        )}
      </div>
    </main>
  );
}
