import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // إخفاء الشريط العلوي
        tabBarActiveTintColor: "#3b82f6", // لون أزرق عند التفعيل
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "الرئيسية" }} />
      <Tabs.Screen name="notifications" options={{ title: "الإشعارات" }} />
      <Tabs.Screen name="meters" options={{ title: "العدادات" }} />
      {/* الشاشة الجديدة التي أضفناها للتو */}
      <Tabs.Screen name="settings" options={{ title: "الإعدادات" }} />
    </Tabs>
  );
}
