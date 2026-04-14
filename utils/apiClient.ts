import axios from "axios";

// هنا نضع عنوان السيرفر الخاص بـ Django.
// ملاحظة: إذا كنت تختبر على هاتف حقيقي (أو محاكي)، فإن 127.0.0.1 لن يعمل!
// يجب أن تضع عنوان الـ IP الخاص بجهاز الكمبيوتر على الشبكة (مثال: 192.168.1.10)
// سنضع الآن عنواناً افتراضياً وسأعلمك كيف تستخرجه لاحقاً.

const BASE_URL = "http://192.168.98.50:8000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// دوال الاتصال بالسيرفر (API Calls)
export const fetchPrediction = async (meterId: any) => {
  // هذه الدالة تطلب الرابط: GET /api/v1/predict/12345/
  const response = await apiClient.get(`/predict/${meterId}/`);
  return response.data;
};
