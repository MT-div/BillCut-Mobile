import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useMeter } from "../../context/MeterContext";
import { updateMeterSettings } from "../../utils/apiClient";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { selectedMeterId } = useMeter(); // معرفة العداد النشط حالياً
  const queryClient = useQueryClient();

  // متغيرات التخزين للحقول
  const [meterName, setMeterName] = useState("");
  const [customBudget, setCustomBudget] = useState("");

  // إعداد دالة التحديث باستخدام React Query
  const mutation = useMutation({
    mutationFn: () =>
      updateMeterSettings(selectedMeterId, meterName, customBudget),
    onSuccess: () => {
      Alert.alert("نجاح", "تم تحديث إعدادات العداد بنجاح!");
      setMeterName("");
      setCustomBudget("");
      // السحر: إخبار الداشبورد وشاشة العدادات بأن البيانات القديمة أصبحت منتهية الصلاحية ليجلبوا الجديد فوراً
      queryClient.invalidateQueries({ queryKey: ["userMeters"] });
      queryClient.invalidateQueries({
        queryKey: ["prediction", selectedMeterId],
      });
    },
    onError: () => {
      Alert.alert("خطأ", "حدث خطأ أثناء تحديث الإعدادات. حاول مجدداً.");
    },
  });

  const handleUpdate = () => {
    if (!selectedMeterId) {
      Alert.alert("تنبيه", "الرجاء اختيار عداد أولاً من شاشة العدادات.");
      return;
    }
    if (!meterName && !customBudget) {
      Alert.alert("تنبيه", "الرجاء إدخال اسم جديد أو ميزانية جديدة للتعديل.");
      return;
    }
    mutation.mutate();
  };

  const handleLogout = () => {
    Alert.alert("تسجيل الخروج", "هل أنت متأكد؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "نعم، خروج", onPress: () => signOut(), style: "destructive" },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>الإعدادات ⚙️</Text>
      </View>

      {/* قسم تعديل العداد */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>تعديل العداد النشط</Text>
        <Text style={styles.helperText}>
          العداد المحدد حالياً: {selectedMeterId || "غير محدد"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="اسم العداد الجديد (مثال: عداد المتجر)"
          value={meterName}
          onChangeText={setMeterName}
        />

        <TextInput
          style={styles.input}
          placeholder="الميزانية الجديدة بالليرة السورية (مثال: 250000)"
          value={customBudget}
          onChangeText={setCustomBudget}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdate}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>حفظ التعديلات</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* قسم الحساب */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الحساب والأمان</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 20 },
  header: { marginTop: 60, marginBottom: 30 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "left",
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    elevation: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4b5563",
    marginBottom: 10,
    textAlign: "left",
  },
  helperText: {
    fontSize: 14,
    color: "#2563eb",
    marginBottom: 20,
    textAlign: "left",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#1f2937",
    textAlign: "left",
  },
  saveButton: {
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#fee2e2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { color: "#ef4444", fontSize: 16, fontWeight: "bold" },
});
