"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

export default function SignInPage() {
  const { isLoaded, signIn } = useSignIn();
  const [error, setError] = useState("");

  // Handle the Twitch sign-in click
  const handleTwitchSignIn = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_twitch",
        redirectUrl: "/sso-callback", // Or wherever your Clerk instance expects the callback
        redirectUrlComplete: "/", // Where to redirect after successful sign-in
      });
    } catch (err: unknown) {
      console.error("OAuth error", JSON.stringify(err, null, 2));
      let errorMessage = "An unexpected error occurred during Twitch sign-in.";
      if (isClerkAPIResponseError(err)) {
        errorMessage = err.errors?.[0]?.longMessage ?? errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Sign In
        </h1>
        <div className="flex flex-col gap-4 rounded bg-white p-8 text-black shadow-md">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={handleTwitchSignIn}
            disabled={!isLoaded}
            className="focus:shadow-outline flex items-center justify-center gap-2 rounded bg-[#6441a5] px-4 py-2 font-bold text-white hover:bg-[#7a5fb_f] focus:outline-none disabled:opacity-50"
          >
            Sign In with Twitch
          </button>
        </div>
      </div>
    </main>
  );
}
