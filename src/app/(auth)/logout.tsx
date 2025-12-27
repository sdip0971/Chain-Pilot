"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        // 1. Perform the signout
        await authClient.signOut();

        // 2. Redirect immediately after completion
        router.push("/login");

        // Optional: Force a router refresh to clear any cached protected data
        router.refresh();
      }}
    >
      Logout
    </Button>
  );
};
