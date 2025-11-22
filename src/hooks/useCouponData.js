// src/hooks/useCouponData.js
import { useState, useEffect } from 'react';
import { REFERENCE_COUPONS } from '../data/referenceCoupons.js';

// Data SDK 초기화 및 레코드 관리 로직
export const useCouponData = () => {
  const [allRecords, setAllRecords] = useState([]);
  const currentRecordCount = allRecords.length;

  // Data SDK 핸들러
  const dataHandler = {
    onDataChanged(data) {
      setAllRecords(Array.isArray(data) ? data : []);
    }
  };

  useEffect(() => {
    async function initDataSdk() {
      if (!window.dataSdk) return;
      const initResult = await window.dataSdk.init(dataHandler);
      if (!initResult.isOk) {
        console.error("데이터 저장 기능을 초기화하지 못했습니다.");
        // Production에서 showMessage를 호출해야 함 (useToast와 연동 필요)
      }
    }
    initDataSdk();
  }, []);

  const getRecordsForCoupon = (couponName) => {
    return allRecords.filter((r) => r.coupon_name === couponName);
  };

  const getRemainingStock = (couponName) => {
    const ref = REFERENCE_COUPONS.find((c) => c.coupon_name === couponName);
    if (!ref) return 0;
    const used = getRecordsForCoupon(couponName).length;
    const remaining = ref.total_stock - used;
    return remaining < 0 ? 0 : remaining;
  };

  const emailAlreadyHasCoupon = (email, couponName) => {
    return allRecords.some(
      (r) => r.email === email && r.coupon_name === couponName
    );
  };
  
  // 쿠폰 신청 로직 (App.jsx에서 호출됨)
  const applyCoupon = async (email, couponName) => {
    if (!window.dataSdk) return { isOk: false };
    
    // ... (기존 app.js의 couponCode 생성 로직)
    const codeSuffix = Math.floor(1000 + Math.random() * 9000);
    const couponCode =
      couponName
        .split(" ")
        .map((w) => w[0] || "")
        .join("")
        .toUpperCase() +
      "-" +
      codeSuffix;

    const record = {
      email: email,
      coupon_name: couponName,
      coupon_code: couponCode,
      applied_at: new Date().toISOString()
    };

    return await window.dataSdk.create(record);
  }

  return {
    allRecords,
    currentRecordCount,
    getRecordsForCoupon,
    getRemainingStock,
    emailAlreadyHasCoupon,
    applyCoupon,
    REFERENCE_COUPONS,
  };
};