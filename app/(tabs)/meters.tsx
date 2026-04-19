import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  const { selectedMeterId, setSelectedMeterId } = useMeter();

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
        <Ionicons
          name="warning-outline"
          size={48}
          color="#ef4444"
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.errorText}>عذراً، تعذر جلب قائمة العدادات</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>عداداتي</Text>
        <MaterialCommunityIcons
          name="home-lightning-bolt-outline"
          size={28}
          color="#0f172a"
        />
      </View>

      {!meters || meters.length === 0 ? (
        <View style={styles.centered}>
          <MaterialCommunityIcons
            name="meter-electric-outline"
            size={64}
            color="#cbd5e1"
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.emptyText}>
            لا يوجد أي عدادات مرتبطة بحسابك حالياً.
          </Text>
        </View>
      ) : (
        <FlatList
          data={meters}
          keyExtractor={(item) => item.meter_id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={refetch}
          renderItem={({ item }) => {
            const isSelected = item.meter_id === selectedMeterId;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => setSelectedMeterId(item.meter_id)}
              >
                <View style={styles.cardIconBg}>
                  <MaterialCommunityIcons
                    name="meter-electric"
                    size={28}
                    color={isSelected ? "#2563eb" : "#64748b"}
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text
                    style={[
                      styles.meterName,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.meterId}>
                    الرقم التسلسلي: {item.meter_id}
                  </Text>
                </View>
                {isSelected ? (
                  <View style={styles.activeBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#ffffff"
                      style={{ marginLeft: 4 }}
                    />
                    <Text style={styles.activeBadgeText}>مفعل</Text>
                  </View>
                ) : (
                  <Ionicons
                    name="chevron-back-outline"
                    size={20}
                    color="#cbd5e1"
                  />
                )}
              </TouchableOpacity>
            );
          }}
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
  listContent: { padding: 24, gap: 16 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  selectedCard: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },

  cardIconBg: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 16,
    marginLeft: 16,
  },
  cardInfo: { flex: 1, justifyContent: "center" },
  meterName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  selectedText: { color: "#2563eb" },
  meterId: { fontSize: 13, color: "#64748b", fontWeight: "500" },

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeBadgeText: { color: "#ffffff", fontSize: 12, fontWeight: "bold" },

  errorText: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: { color: "#2563eb", fontWeight: "bold", fontSize: 15 },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
  },
});
