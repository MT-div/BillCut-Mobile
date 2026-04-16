import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { userToken, isLoading } = useAuth();

  // بينما يبحث عن المفتاح، أظهر شاشة تحميل بدلاً من الشاشة السوداء
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // التوجيه الذكي: إذا كان يملك مفتاحاً اذهب للداشبورد، وإلا اذهب لشاشة الدخول
  if (userToken) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/login" />;
  }
}
