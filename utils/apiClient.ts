import axios from "axios";
import * as SecureStore from "expo-secure-store";
// تذكر: تأكد من أن الـ IP هو الخاص بجهازك
const BASE_URL = "http://192.168.98.50:8000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// مُعترض الطلبات (Request Interceptor)
// ==========================================
// هذه الدالة السحرية تعمل تلقائياً قبل خروج أي طلب من الموبايل
apiClient.interceptors.request.use(
  async (config) => {
    // 1. نبحث عن المفتاح في خزنة الهاتف
    const token = await SecureStore.getItemAsync("access_token");

    // 2. إذا وجدناه، نرفقه في ترويسة الطلب (Headers)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// دوال الاتصال بالسيرفر (API Calls)
// ==========================================

// دالة تسجيل الدخول (جديدة)
export const loginUser = async (username: any, password: any) => {
  // هذه تطلب الرابط الذي أنشأناه في جانغو لإصدار الـ Token
  const response = await apiClient.post("/auth/login/", { username, password });
  return response.data; // سترجع لنا access و refresh tokens
};

// دالة التنبؤ (القديمة)
export const fetchPrediction = async (meterId: string) => {
  const response = await apiClient.get(`/predict/${meterId}/`);
  return response.data;
};

// دالة جلب الإشعارات (جديدة)
export const fetchNotifications = async (meterId: string) => {
  const response = await apiClient.get(`/notifications/${meterId}/`);
  return response.data; // سترجع لنا قائمة بالإشعارات
};

// دالة جلب قائمة عدادات المستخدم (جديدة)
export const fetchUserMeters = async () => {
  const response = await apiClient.get("/meters/");
  return response.data;
};

// دالة تحديث العداد
export const updateMeterSettings = async (
  meterId: string,
  name: string,
  budget: string
) => {
  const response = await apiClient.patch(`/meters/${meterId}/update/`, {
    name: name,
    custom_budget: budget,
  });
  return response.data;
};
