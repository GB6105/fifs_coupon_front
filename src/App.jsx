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

// const IP_ADDRESS = "localhost"; // 로컬 테스트용
// const IP_ADDRESS = "coupon.taegynkim.com";
const IP_ADDRESS = "3.38.114.206";
const BASE_URL = `http://${IP_ADDRESS}:8080`; // 백엔드 서버 기본 URL

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
  const couponData = useCouponData(); 
  const { config, applyConfig, resetConfig } = useElementConfig(); 

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


  useEffect(() => {
    if (config) {
      applyConfig(config);
    }
  }, [config, applyConfig]);
  
  


  const memberRegisterAPI = useCallback(async (email) => {
    const API_URL = `${BASE_URL}/member/register`;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': `http://${IP_ADDRESS}:5173`, 
        },

        body: JSON.stringify({ email: email }),
      });

      // HTTP 상태 코드가 200번대인지 확인 (성공)
      if (response.ok) {

        return true; 
      } else {
        console.error(`Registration failed with status: ${response.status}`);
        return false; 
      }
    } catch (error) {
      console.error("Network or Fetch Error:", error);
      throw error; 
    }
  }, []);

const issueCouponAPI = useCallback(async (email, couponName) => {
    const couponId = COUPON_NAME_TO_ID[couponName];

    if (couponId === undefined) {
      console.error(`Unknown coupon name: ${couponName}`);
      return { isOk: false, message: "유효하지 않은 쿠폰입니다." };
    }

    const API_URL = `${BASE_URL}/coupon/issue/queue`;
    
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

const fetchRemainingStockAPI = useCallback(async (couponName) => {
    const couponId = COUPON_NAME_TO_ID[couponName];

    if (couponId === undefined) {
        return 0;
    }

    const API_URL = `${BASE_URL}/coupon/stock/${couponId}`;

    try {
        const response = await fetch(API_URL);
        
        if (response.ok) {
            const data = await response.json(); 
            return data.remainingStock !== undefined ? data.remainingStock : 0; 
        } else {
            console.error(`Failed to fetch stock for ID ${couponId}: ${response.status}`);
            return 0;
        }
    } catch (error) {
        console.error("Stock API Network Error:", error);
        return 0;
    }
}, []);

const fetchIssuedMembersAPI = useCallback(async (couponName) => {
    const couponId = COUPON_NAME_TO_ID[couponName];
    if (couponId === undefined) return [];

    const API_URL = `${BASE_URL}/member/issued-members/${couponId}`;

    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json(); 
            return Array.isArray(data) ? data : []; 
        } else {
            console.error(`Failed to fetch issued members: ${response.status}`);
            return [];
        }
    } catch (error) {
        console.error("Issued Members API Network Error:", error);
        return [];
    }
}, []);

// 페이지 렌더링
let PageComponent;
const commonProps = { currentEmail, goToCouponList, goToCouponInfo, showMessage, resetEmail, config, couponData };

switch (currentPage) {
    case PAGES.COUPON_LIST:
        PageComponent = <CouponListPage {...commonProps} />;
        break;

case PAGES.COUPON_INFO:
      PageComponent = (
          <CouponInfoPage 
              {...commonProps} 
              selectedCouponName={selectedCouponName} 
              issueCouponAPI={issueCouponAPI}
              fetchRemainingStockAPI={fetchRemainingStockAPI}
              fetchIssuedMembersAPI={fetchIssuedMembersAPI} 
          />
      );
      break;

    case PAGES.SIGNUP:
    default:
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

