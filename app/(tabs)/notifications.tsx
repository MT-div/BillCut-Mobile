// import { useQuery } from "@tanstack/react-query";
// import React from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { useMeter } from "../../context/MeterContext"; // 1. استيراد المركز
// import { fetchNotifications } from "../../utils/apiClient";

// export default function NotificationsScreen() {
//   // استخدم نفس رقم العداد الذي تستخدمه في الداشبورد
//   const { selectedMeterId } = useMeter();

//   const {
//     data: notifications,
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["notifications", selectedMeterId],
//     queryFn: () => fetchNotifications(selectedMeterId),
//     enabled: !!selectedMeterId, // 3. لا تطلب حتى يتحدد العداد
//   });

//   // دالة صغيرة لتنسيق شكل التاريخ
//   const formatDate = (dateString: string) => {
//     const options: Intl.DateTimeFormatOptions = {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString("ar-EG", options);
//   };

//   // حالة جديدة: إذا لم يتم تحديد عداد بعد
//   if (!selectedMeterId) {
//     return (
//       <View style={[styles.container, styles.centered]}>
//         <ActivityIndicator size="large" color="#2563eb" />
//       </View>
//     );
//   }

//   // حالة التحميل
//   if (isLoading) {
//     return (
//       <View style={[styles.container, styles.centered]}>
//         <ActivityIndicator size="large" color="#2563eb" />
//       </View>
//     );
//   }

//   // حالة الخطأ
//   if (isError) {
//     return (
//       <View style={[styles.container, styles.centered]}>
//         <Text style={styles.errorText}>عذراً، فشل جلب الإشعارات</Text>
//         <Text style={styles.retryText} onPress={() => refetch()}>
//           إعادة المحاولة
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>الإشعارات 🔔</Text>
//       </View>

//       {/* التحقق مما إذا كانت القائمة فارغة */}
//       {!notifications || notifications.length === 0 ? (
//         <View style={styles.centered}>
//           <Text style={styles.emptyText}>لا يوجد إشعارات حالياً</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={notifications}
//           keyExtractor={(item) => item.id.toString()}
//           contentContainerStyle={styles.listContent}
//           refreshing={isLoading}
//           onRefresh={refetch} // هذه الميزة تسمح للمستخدم بسحب الشاشة للأسفل للتحديث (Pull to refresh)
//           renderItem={({ item }) => (
//             <View
//               style={[
//                 styles.card,
//                 item.is_read ? styles.readCard : styles.unreadCard,
//               ]}
//             >
//               <Text style={styles.messageText}>{item.message}</Text>
//               <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// // التنسيقات الأصلية
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f9fafb" },
//   centered: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: {
//     paddingTop: 60,
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     backgroundColor: "#ffffff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#f3f4f6",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#1f2937",
//     textAlign: "left",
//   },
//   listContent: { padding: 20, paddingBottom: 40 },
//   card: {
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     elevation: 1,
//   },
//   unreadCard: { backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }, // أزرق فاتح للإشعارات الجديدة
//   readCard: { backgroundColor: "#ffffff", borderColor: "#f3f4f6" }, // أبيض للإشعارات المقروءة
//   messageText: {
//     fontSize: 16,
//     color: "#1f2937",
//     marginBottom: 8,
//     lineHeight: 24,
//     textAlign: "left",
//   },
//   dateText: { fontSize: 12, color: "#6b7280", textAlign: "left" },
//   emptyText: { fontSize: 16, color: "#6b7280" },
//   errorText: { color: "#ef4444", fontSize: 16, marginBottom: 10 },
//   retryText: { color: "#2563eb", fontWeight: "bold", fontSize: 16 },
// });
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useMeter } from "../../context/MeterContext";
import { fetchNotifications } from "../../utils/apiClient";

export default function NotificationsScreen() {
  const { selectedMeterId } = useMeter();

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["notifications", selectedMeterId],
    queryFn: () => fetchNotifications(selectedMeterId),
    enabled: !!selectedMeterId,
  });

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

  if (!selectedMeterId || isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color="#ef4444"
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.errorText}>لم نتمكن من جلب إشعاراتك</Text>
        <Text style={styles.retryText} onPress={() => refetch()}>
          حاول مرة أخرى
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>التنبيهات</Text>
        <Ionicons name="notifications-outline" size={28} color="#0f172a" />
      </View>

      {!notifications || notifications.length === 0 ? (
        <View style={styles.centered}>
          <MaterialCommunityIcons
            name="bell-sleep-outline"
            size={64}
            color="#cbd5e1"
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.emptyText}>
            كل شيء هادئ هنا، لا توجد إشعارات جديدة.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <View style={[styles.card, !item.is_read && styles.unreadCard]}>
              {!item.is_read && <View style={styles.unreadIndicator} />}
              <View style={styles.cardIcon}>
                <Ionicons
                  name={item.is_read ? "mail-open-outline" : "mail-unread"}
                  size={24}
                  color={item.is_read ? "#94a3b8" : "#2563eb"}
                />
              </View>
              <View style={styles.cardContent}>
                <Text
                  style={[
                    styles.messageText,
                    !item.is_read && styles.messageTextUnread,
                  ]}
                >
                  {item.message}
                </Text>
                <View style={styles.dateRow}>
                  <Ionicons name="time-outline" size={14} color="#64748b" />
                  <Text style={styles.dateText}>
                    {formatDate(item.created_at)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  title: { fontSize: 26, fontWeight: "800", color: "#0f172a" },
  listContent: { padding: 20, paddingBottom: 40, gap: 12 },

  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    position: "relative",
    overflow: "hidden",
  },
  unreadCard: { backgroundColor: "#f8fafc" },
  unreadIndicator: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#2563eb",
  },

  cardIcon: { marginEnd: 12, justifyContent: "center", alignItems: "center" },
  cardContent: { flex: 1 },
  messageText: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 8,
    lineHeight: 22,
  },
  messageTextUnread: { color: "#0f172a", fontWeight: "700" },

  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 12, color: "#64748b", fontWeight: "500" },

  emptyText: { fontSize: 16, color: "#64748b", textAlign: "center" },
  errorText: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  retryText: { color: "#2563eb", fontWeight: "bold", fontSize: 15 },
});
