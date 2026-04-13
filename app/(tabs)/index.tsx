import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function DashboardScreen() {
  // بيانات تجريبية (Mock Data) مطابقة للباك-إند
  const mockData = {
    current_consumption_kwh: 120,
    expected_cycle_kwh: 350,
    predicted_cost_syp: 250000,
    days_passed: 20,
    days_remaining: 40,
    subsidized_daily_avg_limit: 4.5,
    budget_info: {
      custom_budget_syp: 200000,
      budget_target_kwh: 314.28,
      budget_daily_avg_limit: 4.8,
    },
  };

  const subsidizedProgress = Math.min(
    (mockData.current_consumption_kwh / 300) * 100,
    100
  );
  const budgetProgress = Math.min(
    (mockData.current_consumption_kwh /
      mockData.budget_info.budget_target_kwh) *
      100,
    100
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* الترحيب */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>مرحباً بك،</Text>
        <Text style={styles.titleText}>عداد المنزل ⚡</Text>
      </View>

      {/* البطاقة الرئيسية */}
      <View style={styles.mainCard}>
        <Text style={styles.mainCardTitle}>
          الفاتورة المتوقعة (للدورة كاملة)
        </Text>
        <Text style={styles.mainCardPrice}>
          {mockData.predicted_cost_syp.toLocaleString()} ل.س
        </Text>

        <View style={styles.innerCard}>
          <Text style={styles.innerCardText}>الاستهلاك المتوقع:</Text>
          <Text style={styles.innerCardValue}>
            {mockData.expected_cycle_kwh} kWh
          </Text>
        </View>
      </View>

      {/* البطاقة الثانية */}
      <View style={styles.secondaryCard}>
        <Text style={styles.cardHeader}>مراقبة الاستهلاك الحالي</Text>
        <Text style={styles.subText}>
          استهلكت حتى الآن:{" "}
          <Text style={styles.boldBlue}>
            {mockData.current_consumption_kwh} kWh
          </Text>
        </Text>

        {/* شريط الشريحة المدعومة */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>المدعوم (300 kWh)</Text>
          <Text style={styles.progressLimit}>
            {mockData.subsidized_daily_avg_limit} kWh/يوم مسموح
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${subsidizedProgress}%`, backgroundColor: "#22c55e" },
            ]}
          />
        </View>

        {/* شريط الميزانية */}
        <View style={[styles.progressRow, { marginTop: 20 }]}>
          <Text style={styles.progressLabel}>
            ميزانيتك ({mockData.budget_info.custom_budget_syp.toLocaleString()}{" "}
            ل.س)
          </Text>
          <Text style={[styles.progressLimit, { color: "#f97316" }]}>
            {mockData.budget_info.budget_daily_avg_limit} kWh/يوم مسموح
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${budgetProgress}%`, backgroundColor: "#f97316" },
            ]}
          />
        </View>
      </View>

      {/* معلومات الدورة */}
      <View style={styles.cycleInfoCard}>
        <View style={styles.cycleColumn}>
          <Text style={styles.cycleLabel}>مضى من الدورة</Text>
          <Text style={styles.cycleValue}>{mockData.days_passed} أيام</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.cycleColumn}>
          <Text style={styles.cycleLabel}>المتبقي</Text>
          <Text style={[styles.cycleValue, { color: "#2563eb" }]}>
            {mockData.days_remaining} يوم
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ==========================================
// التنسيقات (Native React Native StyleSheet)
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb", // لون خلفية التطبيق
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60, // مسافة علوية بديلة لـ SafeAreaView
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "left",
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "left",
    marginTop: 4,
  },
  mainCard: {
    backgroundColor: "#2563eb", // أزرق
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // ظل لأجهزة أندرويد
  },
  mainCardTitle: {
    color: "#dbeafe",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  mainCardPrice: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 16,
  },
  innerCard: {
    backgroundColor: "rgba(30, 64, 175, 0.3)",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  innerCardText: {
    color: "#dbeafe",
  },
  innerCardValue: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  secondaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    elevation: 2,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  subText: {
    color: "#6b7280",
    marginBottom: 16,
  },
  boldBlue: {
    fontWeight: "bold",
    color: "#2563eb",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    color: "#4b5563",
    fontSize: 14,
  },
  progressLimit: {
    color: "#22c55e",
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  cycleInfoCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    justifyContent: "space-between",
    elevation: 1,
    marginBottom: 20,
  },
  cycleColumn: {
    alignItems: "center",
    flex: 1,
  },
  cycleLabel: {
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 4,
  },
  cycleValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  divider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
  },
});
