import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useMeter } from "../../context/MeterContext"; // 1. استيراد المركز
import { fetchPrediction } from "../../utils/apiClient";

export default function DashboardScreen() {
  const { selectedMeterId } = useMeter(); // 2. جلب رقم العداد المحدد

  // 3. استخدام React Query لجلب البيانات
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["prediction", selectedMeterId], // 3. نربط المفتاح برقم العداد ليحدث نفسه عند التغيير
    queryFn: () => fetchPrediction(selectedMeterId),
    enabled: !!selectedMeterId, // 4. كود احترافي: لا تطلب بيانات إذا لم يكن هناك عداد محدد بعد!
  });

  // 5. حالة ذكية: إذا لم يتم تحديد عداد (إما لأنه لا يوجد عدادات، أو فشل الجلب)
  if (!selectedMeterId) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: 10,
          }}
        >
          لم يتم تحديد عداد ⚡
        </Text>
        <Text
          style={{
            color: "#6b7280",
            textAlign: "center",
            paddingHorizontal: 40,
            lineHeight: 24,
          }}
        >
          الرجاء الانتقال إلى شاشة العدادات من الشريط السفلي لاختيار العداد
          الخاص بك لكي نعرض بياناته هنا.
        </Text>
      </View>
    );
  }

  // 3. حالة التحميل (Loading State)
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10, color: "#6b7280" }}>
          جاري حساب توقعات الفاتورة...
        </Text>
      </View>
    );
  }

  // 4. حالة الخطأ (Error State)
  if (isError || !data) {
    console.log("API Error:", error); // طباعة الخطأ في التيرمينال

    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={{ color: "#ef4444", fontSize: 18, marginBottom: 10 }}>
          ⚠️ عذراً، فشل الاتصال بالخادم
        </Text>
        <Text
          style={{ color: "#ef4444", marginBottom: 20, textAlign: "center" }}
        >
          السبب: {error ? error.message : "بيانات فارغة"}
        </Text>

        <Text
          style={{ color: "#2563eb", fontWeight: "bold" }}
          onPress={() => refetch()}
        >
          اضغط هنا لإعادة المحاولة
        </Text>
      </View>
    );
  }

  // 5. البيانات الحقيقية من السيرفر
  const prediction = data.prediction; // أخذنا قسم التنبؤ من الـ JSON المردود
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
    >
      {/* الترحيب */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>مرحباً بك،</Text>
        <Text style={styles.titleText}>{meterName} ⚡</Text>
      </View>

      {/* البطاقة الرئيسية */}
      <View style={styles.mainCard}>
        <Text style={styles.mainCardTitle}>
          الفاتورة المتوقعة (للدورة كاملة)
        </Text>
        <Text style={styles.mainCardPrice}>
          {prediction.predicted_cost_syp.toLocaleString()} ل.س
        </Text>

        <View style={styles.innerCard}>
          <Text style={styles.innerCardText}>الاستهلاك المتوقع:</Text>
          <Text style={styles.innerCardValue}>
            {prediction.expected_cycle_kwh} kWh
          </Text>
        </View>
      </View>

      {/* البطاقة الثانية */}
      <View style={styles.secondaryCard}>
        <Text style={styles.cardHeader}>مراقبة الاستهلاك الحالي</Text>
        <Text style={styles.subText}>
          استهلكت حتى الآن:{" "}
          <Text style={styles.boldBlue}>
            {prediction.current_consumption_kwh} kWh
          </Text>
        </Text>

        {/* شريط الشريحة المدعومة */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>المدعوم (300 kWh)</Text>
          <Text style={styles.progressLimit}>
            {prediction.subsidized_daily_avg_limit} kWh/يوم مسموح
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
        {prediction.budget_info?.custom_budget_syp && (
          <>
            <View style={[styles.progressRow, { marginTop: 20 }]}>
              <Text style={styles.progressLabel}>
                ميزانيتك (
                {prediction.budget_info.custom_budget_syp.toLocaleString()} ل.س)
              </Text>
              <Text style={[styles.progressLimit, { color: "#f97316" }]}>
                {prediction.budget_info.budget_daily_avg_limit} kWh/يوم مسموح
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
          </>
        )}
      </View>

      {/* معلومات الدورة */}
      <View style={styles.cycleInfoCard}>
        <View style={styles.cycleColumn}>
          <Text style={styles.cycleLabel}>مضى من الدورة</Text>
          <Text style={styles.cycleValue}>{prediction.days_passed} أيام</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.cycleColumn}>
          <Text style={styles.cycleLabel}>المتبقي</Text>
          <Text style={[styles.cycleValue, { color: "#2563eb" }]}>
            {prediction.days_remaining} يوم
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
  container: { flex: 1, backgroundColor: "#f9fafb" },
  centered: { justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 24 },
  welcomeText: { fontSize: 18, color: "#6b7280", textAlign: "left" },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "left",
    marginTop: 4,
  },
  mainCard: {
    backgroundColor: "#2563eb",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
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
  innerCardText: { color: "#dbeafe" },
  innerCardValue: { color: "#ffffff", fontWeight: "bold" },
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
  subText: { color: "#6b7280", marginBottom: 16 },
  boldBlue: { fontWeight: "bold", color: "#2563eb" },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: { color: "#4b5563", fontSize: 14 },
  progressLimit: { color: "#22c55e", fontSize: 14, fontWeight: "bold" },
  progressBarBackground: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 6 },
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
  cycleColumn: { alignItems: "center", flex: 1 },
  cycleLabel: { color: "#6b7280", fontSize: 14, marginBottom: 4 },
  cycleValue: { fontSize: 20, fontWeight: "bold", color: "#1f2937" },
  divider: { width: 1, backgroundColor: "#e5e7eb", marginHorizontal: 16 },
});
