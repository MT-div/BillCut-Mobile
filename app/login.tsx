import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../utils/apiClient";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMsg("يرجى إدخال اسم المستخدم وكلمة المرور للمتابعة.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const data = await loginUser(username, password);
      await signIn(data.access);
      router.replace("/(tabs)");
    } catch {
      setErrorMsg("المعلومات غير صحيحة، يرجى التأكد والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={56}
            color="#2563eb"
          />
        </View>
        <Text style={styles.title}>مرحباً بك في BillCut</Text>
        <Text style={styles.subtitle}>سجل دخولك للتحكم باستهلاكك الذكي</Text>
      </View>

      <View style={styles.card}>
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Ionicons name="warning" size={20} color="#ef4444" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>اسم المستخدم</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#94a3b8"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="أدخل اسم المستخدم الخاص بك"
              placeholderTextColor="#cbd5e1"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>كلمة المرور</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#94a3b8"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="أدخل كلمة المرور"
              placeholderTextColor="#cbd5e1"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>تسجيل الدخول</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    padding: 24,
  },

  logoContainer: { alignItems: "center", marginBottom: 40 },
  iconCircle: {
    backgroundColor: "#eff6ff",
    padding: 20,
    borderRadius: 100,
    marginBottom: 20,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#0f172a", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#64748b", fontWeight: "500" },

  card: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: { color: "#ef4444", fontSize: 14, fontWeight: "600", flex: 1 },

  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
    marginStart: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  inputIcon: { marginLeft: 12 },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: "#0f172a",
    textAlign: "right",
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});
