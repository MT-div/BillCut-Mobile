import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

const queryClient = new QueryClient();

// هذا هو "الحارس الشخصي" الذي يراقب التنقلات
function AuthGuard() {
  const { userToken, isLoading } = useAuth();
  const segments = useSegments(); // لمعرفة الشاشة الحالية التي يقف عليها المستخدم
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // انتظر حتى ينتهي البحث في الخزنة

    // هل المستخدم موجود حالياً في شاشة الدخول؟
    const inAuthScreen = String(segments[0]) === "login";

    if (!userToken && !inAuthScreen) {
      // 1. لا يملك مفتاح + يحاول فتح الداشبورد = اطرده لصفحة الدخول
      router.replace("./login");
    } else if (userToken && inAuthScreen) {
      // 2. يملك مفتاح + يحاول فتح صفحة الدخول = وجهه فوراً للداشبورد
      router.replace("/(tabs)");
    }
  }, [userToken, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    // نغلف التطبيق بمركز المصادقة أولاً، ثم بالموزع، ثم نشغل الحارس
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGuard />
      </QueryClientProvider>
    </AuthProvider>
  );
}
