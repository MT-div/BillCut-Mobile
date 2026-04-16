import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMeter } from "../../context/MeterContext";
import { fetchUserMeters } from "../../utils/apiClient";

export default function MetersScreen() {
  const { selectedMeterId, setSelectedMeterId } = useMeter(); // جلبنا المركز

  const {
    data: meters,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userMeters"],
    queryFn: fetchUserMeters,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>عذراً، فشل جلب العدادات</Text>
        <Text style={styles.retryText} onPress={() => refetch()}>
          إعادة المحاولة
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>عداداتي 📊</Text>
      </View>

      {!meters || meters.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>لا يوجد عدادات مرتبطة بحسابك</Text>
        </View>
      ) : (
        <FlatList
          data={meters}
          keyExtractor={(item) => item.meter_id}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={refetch}
          renderItem={({ item }) => {
            const isSelected = item.meter_id === selectedMeterId;
            return (
              <TouchableOpacity
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => setSelectedMeterId(item.meter_id)} // عند الضغط نغير العداد في التطبيق كله!
              >
                <View style={styles.cardHeader}>
                  <Text
                    style={[
                      styles.meterName,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>نشط الآن</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.meterId}>
                  الرقم التسلسلي: {item.meter_id}
                </Text>
              </TouchableOpacity>
            );
          }}
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
  listContent: { padding: 20 },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#f3f4f6",
    elevation: 1,
  },
  selectedCard: { borderColor: "#2563eb", backgroundColor: "#eff6ff" }, // لون مميز للعداد المختار
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  meterName: { fontSize: 20, fontWeight: "bold", color: "#1f2937" },
  selectedText: { color: "#2563eb" },
  meterId: { fontSize: 14, color: "#6b7280", textAlign: "left" },
  activeBadge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: { color: "#ffffff", fontSize: 12, fontWeight: "bold" },
  errorText: { color: "#ef4444", fontSize: 16, marginBottom: 10 },
  retryText: { color: "#2563eb", fontWeight: "bold", fontSize: 16 },
  emptyText: { fontSize: 16, color: "#6b7280" },
});
