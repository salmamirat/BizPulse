import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "../store/authStore";

const queryClient = new QueryClient();

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, loading, loadSession } = useAuthStore();

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (loading || pathname === "/") return;
    const publicPage = pathname === "/login" || pathname === "/register";
    if (!accessToken && !publicPage) router.replace("/login");
    if (accessToken && publicPage) router.replace("/dashboard");
  }, [accessToken, loading, pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}

