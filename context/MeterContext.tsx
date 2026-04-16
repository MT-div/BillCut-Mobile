import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserMeters } from "../utils/apiClient";
import { useAuth } from "./AuthContext"; // نحتاج معرفة ما إذا كان مسجل دخول

const MeterContext = createContext<any>(null);

export const MeterProvider = ({ children }: any) => {
  const [selectedMeterId, setSelectedMeterId] = useState<string | null>(null);
  const { userToken } = useAuth(); // نجلب حالة المستخدم

  // السحر الجديد: بمجرد أن يسجل دخوله، ابحث بصمت عن عداداته واختر الأول
  useEffect(() => {
    const initDefaultMeter = async () => {
      // إذا كان مسجل دخول، ولم يختر عداداً بعد
      if (userToken && !selectedMeterId) {
        try {
          const meters = await fetchUserMeters();
          if (meters && meters.length > 0) {
            setSelectedMeterId(meters[0].meter_id); // تعيين أول عداد كافتراضي
          }
        } catch (error) {
          console.error("فشل تهيئة العداد الافتراضي");
        }
      }
    };
    initDefaultMeter();
  }, [userToken]);

  return (
    <MeterContext.Provider value={{ selectedMeterId, setSelectedMeterId }}>
      {children}
    </MeterContext.Provider>
  );
};

export const useMeter = () => useContext(MeterContext);
