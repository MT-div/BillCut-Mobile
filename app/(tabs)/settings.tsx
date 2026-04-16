import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function SettingsScreen() {
  const { signOut } = useAuth(); // جلب دالة تسجيل الخروج من المركز

  // دالة التأكيد قبل الخروج
  const handleLogout = () => {
    Alert.alert(
      "تسجيل الخروج",
      "هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟",
      [
        { text: "إلغاء", style: "cancel" },
        // إذا ضغط نعم، نستدعي دالة signOut التي ستمسح المفتاح وتطرده
        { text: "نعم، خروج", onPress: () => signOut(), style: "destructive" },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>الإعدادات ⚙️</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الحساب والأمان</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// التنسيقات الأصلية (Native StyleSheet)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4b5563",
    marginBottom: 20,
    textAlign: "left",
  },
  logoutButton: {
    backgroundColor: "#fee2e2", // أحمر فاتح للتحذير
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#ef4444", // نص أحمر
    fontSize: 16,
    fontWeight: "bold",
  },
});
