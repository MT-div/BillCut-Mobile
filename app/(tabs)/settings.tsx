import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  const { selectedMeterId } = useMeter();
  const queryClient = useQueryClient();

  const [meterName, setMeterName] = useState("");
  const [customBudget, setCustomBudget] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      updateMeterSettings(selectedMeterId, meterName, customBudget),
    onSuccess: () => {
      Alert.alert("رائع!", "تم تحديث إعداداتك بنجاح.");
      setMeterName("");
      setCustomBudget("");
      queryClient.invalidateQueries({ queryKey: ["userMeters"] });
      queryClient.invalidateQueries({
        queryKey: ["prediction", selectedMeterId],
      });
    },
    onError: () => {
      Alert.alert("خطأ", "حدث خطأ أثناء الاتصال. يرجى المحاولة لاحقاً.");
    },
  });

  const handleUpdate = () => {
    if (!selectedMeterId) {
      Alert.alert("تنبيه", "يرجى اختيار عداد أولاً من شاشة العدادات.");
      return;
    }
    if (!meterName && !customBudget) {
      Alert.alert("تنبيه", "أدخل اسماً جديداً أو ميزانية جديدة للحفظ.");
      return;
    }
    mutation.mutate();
  };

  const handleLogout = () => {
    Alert.alert("تسجيل الخروج", "هل أنت متأكد من رغبتك بالمغادرة؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "نعم، خروج", onPress: () => signOut(), style: "destructive" },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>الإعدادات</Text>
        <Ionicons name="settings-outline" size={32} color="#0f172a" />
      </View>

      {/* قسم تعديل العداد */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="tune" size={22} color="#2563eb" />
          <Text style={styles.sectionTitle}>تخصيص العداد الحالي</Text>
        </View>
        <Text style={styles.helperText}>
          العداد المختار: {selectedMeterId || "غير محدد"}
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="pricetag-outline"
            size={20}
            color="#94a3b8"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="اسم مميز للعداد (مثال: منزل العائلة)"
            placeholderTextColor="#94a3b8"
            value={meterName}
            onChangeText={setMeterName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="wallet-outline"
            size={20}
            color="#94a3b8"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="الميزانية بالليرة السورية (مثال: 150000)"
            placeholderTextColor="#94a3b8"
            value={customBudget}
            onChangeText={setCustomBudget}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdate}
          disabled={mutation.isPending}
          activeOpacity={0.8}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>حفظ التعديلات</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* قسم الحساب */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#ef4444" />
          <Text style={styles.sectionTitle}>إدارة الحساب</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text style={styles.logoutText}>تسجيل الخروج من التطبيق</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  title: { fontSize: 30, fontWeight: "800", color: "#0f172a" },

  section: {
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  helperText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
    fontWeight: "500",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: { marginStart: 12 },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: "#0f172a",
  },

  saveButton: {
    flexDirection: "row",
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    gap: 8,
  },
  saveButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },

  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#fef2f2",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    gap: 8,
  },
  logoutText: { color: "#ef4444", fontSize: 16, fontWeight: "700" },
});
