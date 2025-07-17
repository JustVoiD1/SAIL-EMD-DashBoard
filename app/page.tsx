'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    
    if (token) {
      // User is authenticated, redirect to dashboard
      router.push("/dashboard");
    } else {
      // User is not authenticated, redirect to signin
      router.push("/signin");
    }
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-cente fixed inset-0 bg-background/50 backdrop-blur-sm justify-center p-4 z-50r">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-secondary">Redirecting...</p>
      </div>
    </div>
  );
}
