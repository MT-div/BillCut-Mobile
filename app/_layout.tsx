import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

// إنشاء المخزن المؤقت (الذاكرة)
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    // تغليف التطبيق بالمزود
    <QueryClientProvider client={queryClient}>
      <Stack>
        {/* استدعاء شريط التنقل السفلي وإخفاء الشريط العلوي الافتراضي */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
