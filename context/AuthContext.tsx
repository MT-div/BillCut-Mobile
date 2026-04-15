import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";

// إنشاء المركز
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // هذه الدالة تعمل فور فتح التطبيق لتفقد الخزنة
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        if (token) setUserToken(token);
      } catch (e) {
        console.error("فشل في قراءة الخزنة", e);
      } finally {
        setIsLoading(false); // انتهينا من البحث
      }
    };
    checkToken();
  }, []);

  // دالة تُستدعى عند نجاح تسجيل الدخول لحفظ المفتاح
  const signIn = async (token: string) => {
    await SecureStore.setItemAsync("access_token", token);
    setUserToken(token);
  };

  // دالة تُستدعى عند تسجيل الخروج لمسح المفتاح
  const signOut = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// أداة مساعدة (Hook) لسهولة استخدام المركز في أي شاشة
export const useAuth = () => useContext(AuthContext);
