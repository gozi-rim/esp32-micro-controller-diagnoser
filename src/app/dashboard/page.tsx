"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { ExpertSystem } from "@/components/ExpertSystem";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, signOut } = useAuth();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  const handleSignOut = () => {
    signOut();
    window.location.href = "/";
  };

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return <ExpertSystem onSignOut={handleSignOut} />;
}
