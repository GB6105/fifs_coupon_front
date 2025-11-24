import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header.jsx';

const CouponInfoPage = ({ 
  currentEmail, 
  goToCouponList, 
  config,
  showMessage, 
  resetEmail, 
  couponData, 
  selectedCouponName, 
  issueCouponAPI,
  fetchRemainingStockAPI,
  fetchIssuedMembersAPI }) => {

    const { REFERENCE_COUPONS, getRecordsForCoupon, emailAlreadyHasCoupon } = couponData;
    const [isApplying, setIsApplying] = useState(false);
    const [remainingStock, setRemainingStock] = useState(0);
    const [issuedEmails, setIssuedEmails] = useState([]);

    // 선택된 쿠폰 정보 가져오기
    const selectedCouponRef = REFERENCE_COUPONS.find(c => c.coupon_name === selectedCouponName);
    const appliedRecords = getRecordsForCoupon(selectedCouponName); // Data SDK 기록은 여전히 필요
    const alreadyHas = issuedEmails.includes(currentEmail);

    //  신청자 목록 로드 함수
    const loadIssuedMembers = useCallback(async () => {
        if (selectedCouponName) {
            const emails = await fetchIssuedMembersAPI(selectedCouponName);
            console.log("Fetched Issued Members:", emails);
            setIssuedEmails(emails);
        }
    }, [selectedCouponName, fetchIssuedMembersAPI]);

    //  잔여 수량을 API에서 가져오는 함수
    const loadRemainingStock = useCallback(async () => {
        if (selectedCouponName) {
            const stock = await fetchRemainingStockAPI(selectedCouponName);
            console.log("Fetched Remaining Stock:", stock);
            setRemainingStock(stock);
        }
    }, [selectedCouponName, fetchRemainingStockAPI]);

    // UI 업데이트 로직
    // 컴포넌트 마운트 시 잔여 수량 로드 및 API 호출 후 재로드 
    useEffect(() => {
        if (!selectedCouponName) {
            goToCouponList();
            return;
        }
        loadRemainingStock();
        loadIssuedMembers();
    }, [selectedCouponName, goToCouponList, loadRemainingStock, loadIssuedMembers]);
  
    // handleApply 함수 내에서 API 호출 후 재로드
    const handleApply = async () => {
        // if (isApplying || !currentEmail || !selectedCouponName) return;
        
        // if (remainingStock <= 0) {
        //     showMessage("이미 선착순 마감된 쿠폰입니다.", 2600);
        //     return;
        // }
        // if (alreadyHas) { 
        //     showMessage("이미 이 쿠폰을 신청하셨어요.", 2600);
        //     return;
        // }

        setIsApplying(true);
        
        const result = await issueCouponAPI(currentEmail, selectedCouponName);
        
        if (result.isOk) {
            showMessage("쿠폰 신청 완료! 잠시 후 내역을 확인할 수 있어요.", 2600);
            //  API 호출 성공 후, 잔여 수량을 Redis에서 다시 가져오도록 요청
            await loadRemainingStock();
            await loadIssuedMembers(); 
            await new Promise(resolve => setTimeout(resolve, 1000));
            await loadRemainingStock();
            await loadIssuedMembers();
        } else {
            showMessage(`신청 실패: ${result.message}`, 3500); 
        }
        
        setIsApplying(false);
    };
  // 스타일 정의
  const smallSize = config.font_size * 0.85;
  const tinySize = config.font_size * 0.75;
  const largeSize = config.font_size * 1.4;

  const cardStyle = {
    backgroundColor: config.surface_color,
    borderColor: config.secondary_action_color,
  };
  
  const secondaryButtonStyle = {
    backgroundColor: 'transparent',
    borderColor: config.secondary_action_color,
    color: config.text_color,
    fontSize: smallSize + 'px'
  };

  const primaryButtonStyle = {
    backgroundColor: config.primary_action_color,
    color: '#111827',
    fontSize: smallSize + 'px'
  };

  // 버튼 비활성화 조건
  const applyDisabled = isApplying || remainingStock <= 0 || alreadyHas || !currentEmail;
  
  return (
    <div className="h-full flex flex-col">
      <Header currentEmail={currentEmail} resetEmail={resetEmail} config={config} />
      
      <main id="main-content" className="h-full flex items-center justify-center flex-grow" aria-live="polite">
        <div className="max-w-3xl w-full mx-auto px-6 pb-10">
          <section id="coupon-info-page" aria-labelledby="coupon-info-title" className="pt-6">
            <div className="rounded-2xl px-6 py-6 shadow-sm border-2 space-y-6" id="coupon-info-card" style={cardStyle}>
              
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 id="coupon-info-title" className="font-semibold mb-1" style={{ fontSize: largeSize + 'px' }}>
                    {config.coupon_info_title}
                  </h2>
                  <p id="coupon-info-subtitle" className="text-sm opacity-90" style={{ fontSize: smallSize + 'px' }}>
                    선택한 브랜드의 잔여 수량과 신청 내역을 확인하세요.
                  </p>
                </div>
                <button 
                  id="back-to-coupons" 
                  type="button" 
                  className="text-xs px-3 py-1.5 rounded-full border transition-colors focus-visible:outline-none" 
                  onClick={goToCouponList}
                  style={secondaryButtonStyle}
                >
                  목록으로
                </button>
              </div>

              {/* Selected Coupon Summary */}
              <div className="rounded-xl px-4 py-4 shadow-sm border-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" id="coupon-summary" style={cardStyle}>
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-80 mb-1" style={{ fontSize: tinySize + 'px' }}>선택한 쿠폰</p>
                  <h3 id="coupon-summary-name" className="font-semibold">{selectedCouponRef ? selectedCouponRef.display_name : '-'}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs opacity-80" style={{ fontSize: tinySize + 'px' }}>남은 수량</p>
                    <p id="coupon-remaining" className="text-lg font-semibold">{remainingStock}</p>
                  </div>
                  <button 
                    id="apply-coupon-btn" 
                    type="button" 
                    className="rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors focus-visible:outline-none"
                    onClick={handleApply}
                    disabled={applyDisabled}
                    style={primaryButtonStyle}
                  >
                    <span id="apply-button-text">{config.apply_button_text}</span>
                    <span id="apply-spinner" className={`w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin ${isApplying ? '' : 'hidden'}`} aria-hidden="true"></span>
                  </button>
                </div>
              </div>

              {/* Status List */}
              <section aria-label="쿠폰 신청 내역">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">신청한 사람 목록</h3>
                    <p id="coupon-applied-count" className="text-xs opacity-80">{issuedEmails.length}명</p>
                </div>
                <div id="status-list-wrapper" className="rounded-xl px-4 py-3 shadow-sm border-2" style={cardStyle}>
                    <ul id="status-list" className="divide-y text-sm">
                        {issuedEmails.length === 0 ? (
                            <p id="status-empty" className="text-sm opacity-80" style={{ fontSize: smallSize + 'px' }}>아직 이 쿠폰을 신청한 사람이 없어요.</p>
                        ) : (
                            issuedEmails.map((email, index) => {
                                return (
                                    <li key={email} className="py-1.5 flex items-center justify-between gap-3 text-xs sm:text-sm" style={{ fontSize: smallSize + 'px' }}>
                                        <span>{email}</span>
                                        <span className="opacity-70 text-[11px]" style={{ fontSize: tinySize + 'px' }}>#{index + 1}</span>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            </section>
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full mt-auto">
        <div className="max-w-3xl mx-auto px-6 pb-6 pt-4 text-xs opacity-80 flex items-center justify-between" style={{ fontSize: tinySize + 'px' }}>
          <p id="footer-text">{config.footer_text}</p>
          <p id="current-email-label" className="text-right">
            현재 이메일: <span id="current-email-value" className="font-medium" style={{ fontSize: smallSize + 'px' }}>{currentEmail || '-'}</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CouponInfoPage;