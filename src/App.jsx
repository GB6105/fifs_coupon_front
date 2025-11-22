// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from './hooks/useToast';
import { useCouponData } from './hooks/useCouponData';
import { useElementConfig } from './hooks/useConfig';
import SignupPage from './pages/SignupPage.jsx'; 
import CouponListPage from './pages/CouponListPage.jsx'; 
import CouponInfoPage from './pages/CouponInfoPage.jsx'; 
import { COUPON_NAME_TO_ID } from './data/referenceCoupons.js';

import MessageBar from "./components/MessageBar.jsx"; 
import Header from "./components/Header.jsx";

// 가상의 페이지 열거형
const PAGES = {
  SIGNUP: 'signup',
  COUPON_LIST: 'coupon',
  COUPON_INFO: 'info',
};

const App = () => {
  // 1. 상태 관리
  const [currentEmail, setCurrentEmail] = useState(localStorage.getItem('currentEmail') || null);
  const [selectedCouponName, setSelectedCouponName] = useState(localStorage.getItem('selectedCouponName') || null);
  const [currentPage, setCurrentPage] = useState(
    currentEmail ? (selectedCouponName ? PAGES.COUPON_INFO : PAGES.COUPON_LIST) : PAGES.SIGNUP
  );

  // 2. Custom Hooks
  const { message, isVisible, showMessage, hideMessage } = useToast();
  const couponData = useCouponData(); // allRecords, applyCoupon 등 제공
  const { config, applyConfig, resetConfig } = useElementConfig(); // config 상태 및 SDK 초기화/업데이트 로직 제공

  // 3. 네비게이션 로직
  // const goToSignup = useCallback(() => {
  //   setCurrentEmail(null);
  //   setSelectedCouponName(null);
  //   localStorage.removeItem('currentEmail');
  //   localStorage.removeItem('selectedCouponName');
  //   setCurrentPage(PAGES.SIGNUP);
  // }, []);

  const goToCouponList = useCallback(() => {
    setSelectedCouponName(null);
    localStorage.removeItem('selectedCouponName');
    setCurrentPage(PAGES.COUPON_LIST); 
}, []);

  const goToCouponInfo = useCallback((couponName) => {
    setSelectedCouponName(couponName);
    localStorage.setItem('selectedCouponName', couponName);
    setCurrentPage(PAGES.COUPON_INFO);
  }, []);

  const resetEmail = useCallback(() => {
    setCurrentEmail(null);
    setSelectedCouponName(null);
    localStorage.removeItem('currentEmail');
    localStorage.removeItem('selectedCouponName');
    setCurrentPage(PAGES.SIGNUP);
  }, []);

  // 4. 전역 스타일 적용 (config 변경 시)
  useEffect(() => {
    if (config) {
      applyConfig(config); // Tailwind CDN 위에 동적으로 인라인 스타일 적용
    }
  }, [config, applyConfig]);
  const IP_ADDRESS = "3.38.114.206";
  const memberRegisterAPI = useCallback(async (email) => {
    const API_URL = `http://${IP_ADDRESS}:8080/member/register`;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // CORS 문제 해결을 위해 필요할 수 있습니다.
          // 'Access-Control-Allow-Origin': `http://${IP_ADDRESS}:5173`, 
        },
        // 요청 본문으로 이메일 객체를 JSON 형태로 전송
        body: JSON.stringify({ email: email }),
      });

      // HTTP 상태 코드가 200번대인지 확인 (성공)
      if (response.ok) {
        // 서버에서 응답 본문이 필요하다면 여기서 처리할 수 있습니다.
        // const result = await response.json(); 
        return true; // 등록 성공
      } else {
        // 4xx 또는 5xx 오류 시
        console.error(`Registration failed with status: ${response.status}`);
        return false; // 등록 실패 (서버 응답 오류)
      }
    } catch (error) {
      console.error("Network or Fetch Error:", error);
      throw error; // SignupPage.jsx에서 오류를 catch하도록 던짐
    }
  }, []);

const issueCouponAPI = useCallback(async (email, couponName) => {
    // ⭐️ 쿠폰 이름을 정수 ID로 변환 ⭐️
    const couponId = COUPON_NAME_TO_ID[couponName];

    // 유효성 검사: 매핑되는 ID가 없는 경우 처리
    if (couponId === undefined) {
      console.error(`Unknown coupon name: ${couponName}`);
      return { isOk: false, message: "유효하지 않은 쿠폰입니다." };
    }

    const API_URL = `http://${IP_ADDRESS}:8080/coupon/issue/queue`;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, couponId: couponId }),
      });

      if (response.ok) {
        return { isOk: true, message: "쿠폰 발급 요청 성공" };
      } else {
        const errorBody = await response.json();
        return { isOk: false, message: errorBody.message || "서버 오류로 신청 실패" }; 
      }
    } catch (error) {
      console.error("Coupon Issue API 호출 오류:", error);
      return { isOk: false, message: "네트워크 오류" };
    }
}, []);

  // 5. 페이지 렌더링
let PageComponent;
const commonProps = { currentEmail, goToCouponList, goToCouponInfo, showMessage, resetEmail, config, couponData };

switch (currentPage) {
    case PAGES.COUPON_LIST:
        // 쿠폰 목록 페이지 렌더링
        PageComponent = <CouponListPage {...commonProps} />;
        break;

case PAGES.COUPON_INFO:
      PageComponent = (
          <CouponInfoPage 
              {...commonProps} 
              selectedCouponName={selectedCouponName} 
              issueCouponAPI={issueCouponAPI} 
          />
      );
      break;

    case PAGES.SIGNUP:
    default:
        // 이메일 등록 페이지 렌더링 (기본값)
        PageComponent = (
            <SignupPage 
                {...commonProps} 
                setCurrentEmail={setCurrentEmail}
                memberRegisterAPI={memberRegisterAPI} 
            />
        );
        break;
}

return (
    <div id="app-root" className="h-full" style={{ backgroundColor: config.background_color, color: config.text_color, fontFamily: config.font_family }}>
        {PageComponent}
        <MessageBar message={message} isVisible={isVisible} hideMessage={hideMessage} config={config} />
    </div>
);
};

export default App;

