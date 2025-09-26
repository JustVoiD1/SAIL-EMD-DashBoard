'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MyLoader from "./components/MyLoader";

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
    <MyLoader content="Redirecting..."/>
  );
}
