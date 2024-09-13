"use client";

import { SignInCard } from "./sign-in-card";

export function AuthScreen() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-700">
      <div className="md:h-auto md:w-[420px]">
        <SignInCard></SignInCard>
      </div>
    </div>
  );
}
