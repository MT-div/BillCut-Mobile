import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMeter } from "../../context/MeterContext";
import { fetchPrediction } from "../../utils/apiClient";

export default function DashboardScreen() {
  const { selectedMeterId } = useMeter();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["prediction", selectedMeterId],
    queryFn: () => fetchPrediction(selectedMeterId),
    enabled: !!selectedMeterId,
  });

  if (!selectedMeterId) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.stateIconCircle}>
          <MaterialCommunityIcons
            name="power-plug-off"
            size={48}
            color="#94a3b8"
          />
        </View>
        <Text style={styles.stateTitle}>لم تحدد عداداً بعد!</Text>
        <Text style={styles.stateSubtitle}>
          يرجى الانتقال إلى شاشة العدادات واختيار العداد لنتمكن من عرض توقعات
          استهلاكك.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.loadingCircle}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
        <Text style={styles.loadingText}>نحسب استهلاكك بدقة...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={[styles.stateIconCircle, { backgroundColor: "#fee2e2" }]}>
          <Ionicons name="cloud-offline-outline" size={48} color="#ef4444" />
        </View>
        <Text style={styles.stateTitle}>عذراً، انقطع الاتصال!</Text>
        <Text style={styles.stateSubtitle}>
          {error ? error.message : "تعذر جلب البيانات في الوقت الحالي."}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={20} color="#ffffff" />
          <Text style={styles.retryButtonText}>تحديث الصفحة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const prediction = data.prediction;
  const meterName = data.meter_name;

  const subsidizedProgress = Math.min(
    (prediction.current_consumption_kwh / 300) * 100,
    100
  );
  const budgetProgress = prediction.budget_info?.budget_target_kwh
    ? Math.min(
        (prediction.current_consumption_kwh /
          prediction.budget_info.budget_target_kwh) *
          100,
        100
      )
    : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* الترحيب */}
      <View style={styles.header}>
        <View>
          <Text style={styles.titleText}>{meterName}</Text>
        </View>
        <View style={styles.headerIconBg}>
          <MaterialCommunityIcons
            name="lightning-bolt-circle"
            size={32}
            color="#2563eb"
          />
        </View>
      </View>

      {/* البطاقة الرئيسية */}
      <View style={styles.mainCard}>
        <View style={styles.mainCardTop}>
          <Text style={styles.mainCardTitle}>
            الفاتورة المتوقعة بنهاية الدورة
          </Text>
          <MaterialCommunityIcons
            name="calculator-variant-outline"
            size={24}
            color="#dbeafe"
          />
        </View>
        <Text style={styles.mainCardPrice}>
          {prediction.predicted_cost_syp.toLocaleString()}{" "}
          <Text style={styles.currencyText}>ل.س</Text>
        </Text>

        <View style={styles.innerCard}>
          <View style={styles.innerCardRow}>
            <Ionicons name="analytics-outline" size={18} color="#93c5fd" />
            <Text style={styles.innerCardText}>
              الاستهلاك الإجمالي المتوقع:
            </Text>
          </View>
          <Text style={styles.innerCardValue}>
            {prediction.expected_cycle_kwh} kWh
          </Text>
        </View>
      </View>

      {/* بطاقة مراقبة الاستهلاك */}
      <View style={styles.secondaryCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardHeader}>مراقبة الاستهلاك الحالي</Text>
          <Ionicons name="speedometer-outline" size={22} color="#1f2937" />
        </View>

        <Text style={styles.subText}>
          استهلكت حتى الآن:{" "}
          <Text style={styles.boldBlue}>
            {prediction.current_consumption_kwh} kWh
          </Text>
        </Text>

        {/* شريط الشريحة المدعومة */}
        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>الشريحة المدعومة (300 kWh)</Text>
            <Text style={styles.progressLimit}>
              {prediction.subsidized_daily_avg_limit} kWh/يوم
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${subsidizedProgress}%`, backgroundColor: "#10b981" },
              ]}
            />
          </View>
        </View>

        {/* شريط الميزانية */}
        {prediction.budget_info?.custom_budget_syp && (
          <View style={[styles.progressContainer, { marginTop: 24 }]}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>
                ميزانيتك المخصصة (
                {prediction.budget_info.custom_budget_syp.toLocaleString()} ل.س)
              </Text>
              <Text style={[styles.progressLimit, { color: "#f59e0b" }]}>
                {prediction.budget_info.budget_daily_avg_limit} kWh/يوم
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${budgetProgress}%`, backgroundColor: "#f59e0b" },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* معلومات الدورة */}
      <View style={styles.cycleInfoCard}>
        <View style={styles.cycleColumn}>
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={24}
            color="#64748b"
            style={styles.cycleIcon}
          />
          <Text style={styles.cycleLabel}>مضى من الدورة</Text>
          <Text style={styles.cycleValue}>
            {prediction.days_passed} <Text style={styles.cycleUnit}>أيام</Text>
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.cycleColumn}>
          <MaterialCommunityIcons
            name="calendar-check-outline"
            size={24}
            color="#2563eb"
            style={styles.cycleIcon}
          />
          <Text style={styles.cycleLabel}>الأيام المتبقية</Text>
          <Text style={[styles.cycleValue, { color: "#2563eb" }]}>
            {prediction.days_remaining}{" "}
            <Text style={styles.cycleUnit}>يوم</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centered: { justifyContent: "center", alignItems: "center", padding: 20 },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  welcomeText: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 4,
    fontFamily: "System",
  },
  titleText: { fontSize: 28, fontWeight: "800", color: "#0f172a" },
  headerIconBg: { backgroundColor: "#eff6ff", padding: 12, borderRadius: 16 },

  // Empty & Error States
  stateIconCircle: {
    backgroundColor: "#f1f5f9",
    padding: 24,
    borderRadius: 100,
    marginBottom: 16,
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  stateSubtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  loadingCircle: {
    backgroundColor: "#eff6ff",
    padding: 20,
    borderRadius: 100,
    marginBottom: 16,
  },
  loadingText: { fontSize: 16, color: "#64748b", fontWeight: "500" },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  retryButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },

  // Cards
  mainCard: {
    backgroundColor: "#2563eb",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  mainCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mainCardTitle: { color: "#bfdbfe", fontSize: 15, fontWeight: "600" },
  mainCardPrice: {
    color: "#ffffff",
    fontSize: 38,
    fontWeight: "800",
    marginBottom: 24,
  },
  currencyText: { fontSize: 18, fontWeight: "500", color: "#dbeafe" },
  innerCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  innerCardRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  innerCardText: { color: "#dbeafe", fontSize: 14, fontWeight: "500" },
  innerCardValue: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },

  secondaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardHeader: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  subText: { color: "#64748b", marginBottom: 24, fontSize: 15 },
  boldBlue: { fontWeight: "800", color: "#2563eb", fontSize: 16 },

  progressContainer: { marginBottom: 8 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressLabel: { color: "#475569", fontSize: 13, fontWeight: "600" },
  progressLimit: { color: "#10b981", fontSize: 13, fontWeight: "bold" },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 10 },

  cycleInfoCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cycleColumn: { alignItems: "center", flex: 1 },
  cycleIcon: { marginBottom: 8 },
  cycleLabel: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  cycleValue: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
  cycleUnit: { fontSize: 14, fontWeight: "600", color: "#94a3b8" },
  divider: { width: 1, backgroundColor: "#f1f5f9", marginHorizontal: 12 },
});
