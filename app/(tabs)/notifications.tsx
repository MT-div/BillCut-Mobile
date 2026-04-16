import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "../../utils/apiClient";

export default function NotificationsScreen() {
  // استخدم نفس رقم العداد الذي تستخدمه في الداشبورد
  const METER_ID = "12345";

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["notifications", METER_ID],
    queryFn: () => fetchNotifications(METER_ID),
  });

  // دالة صغيرة لتنسيق شكل التاريخ
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  // حالة التحميل
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // حالة الخطأ
  if (isError) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>عذراً، فشل جلب الإشعارات</Text>
        <Text style={styles.retryText} onPress={() => refetch()}>
          إعادة المحاولة
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>الإشعارات 🔔</Text>
      </View>

      {/* التحقق مما إذا كانت القائمة فارغة */}
      {!notifications || notifications.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>لا يوجد إشعارات حالياً</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={refetch} // هذه الميزة تسمح للمستخدم بسحب الشاشة للأسفل للتحديث (Pull to refresh)
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                item.is_read ? styles.readCard : styles.unreadCard,
              ]}
            >
              <Text style={styles.messageText}>{item.message}</Text>
              <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// التنسيقات الأصلية
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "left",
  },
  listContent: { padding: 20, paddingBottom: 40 },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 1,
  },
  unreadCard: { backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }, // أزرق فاتح للإشعارات الجديدة
  readCard: { backgroundColor: "#ffffff", borderColor: "#f3f4f6" }, // أبيض للإشعارات المقروءة
  messageText: {
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 24,
    textAlign: "left",
  },
  dateText: { fontSize: 12, color: "#6b7280", textAlign: "left" },
  emptyText: { fontSize: 16, color: "#6b7280" },
  errorText: { color: "#ef4444", fontSize: 16, marginBottom: 10 },
  retryText: { color: "#2563eb", fontWeight: "bold", fontSize: 16 },
});
