import React from 'react';
import Header from '../components/Header.jsx';

const CouponListPage = ({ currentEmail, goToCouponList, goToCouponInfo, config, showMessage, resetEmail, couponData }) => {
  const { REFERENCE_COUPONS, getRemainingStock } = couponData;
  
  const smallSize = config.font_size * 0.85;
  const largeSize = config.font_size * 1.4;
  const tinySize = config.font_size * 0.75;

  const handleCouponClick = (couponName) => {
    if (!currentEmail) {
      showMessage("먼저 이메일을 등록해 주세요.", 2500);
      return;
    }
    goToCouponInfo(couponName);
  };
  
  const cardStyle = {
    backgroundColor: config.surface_color,
    borderColor: config.secondary_action_color,
  };
  
  const buttonStyle = {
    backgroundColor: 'transparent',
    borderWidth: '1px',
    borderColor: config.secondary_action_color,
    color: config.text_color,
    fontSize: smallSize + 'px'
  };

  return (
    <div className="h-full flex flex-col">
      <Header currentEmail={currentEmail} resetEmail={resetEmail} config={config} />
      
      <main id="main-content" className="h-full flex items-center justify-center flex-grow" aria-live="polite">
        <div className="max-w-3xl w-full mx-auto px-6 pb-10">
          <section id="coupon-page" aria-labelledby="coupon-page-title" className="pt-6">
            <div className="rounded-2xl px-6 py-6 shadow-sm border-2" id="coupon-card" style={cardStyle}>
              
              <h2 id="coupon-page-title" className="font-semibold mb-2" style={{ fontSize: largeSize + 'px' }}>
                {config.coupon_page_title}
              </h2>
              <p className="text-sm opacity-90 mb-4" style={{ fontSize: config.font_size + 'px' }}>
                원하는 커피 브랜드를 고르고 선착순 쿠폰을 신청하세요.
              </p>
              
              <div id="coupon-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {REFERENCE_COUPONS.map((coupon) => (
                  <article 
                    key={coupon.coupon_name}
                    className="rounded-xl px-4 py-4 shadow-sm border-2 flex flex-col justify-between" 
                    data-coupon-name={coupon.coupon_name}
                    style={cardStyle}
                  >
                    <div>
                      <h3 className="font-semibold mb-1 text-sm">{coupon.display_name}</h3>
                      {/* 실제 쿠폰 설명은 정적 텍스트로 대체 */}
                      <p className="text-xs opacity-90 mb-3" style={{ fontSize: tinySize + 'px' }}>
                        {coupon.coupon_name === 'Starbugs' && '따뜻한 별빛과 함께하는 한 잔.'}
                        {coupon.coupon_name === 'TwoThumb' && '두 손 엄지 척, 상쾌한 한 잔.'}
                        {coupon.coupon_name === 'Megabyte Coffee' && '에너지 풀충전 메가바이트 한 잔.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-full text-xs font-medium rounded-lg px-3 py-2 mt-auto transition-colors focus-visible:outline-none"
                      onClick={() => handleCouponClick(coupon.coupon_name)}
                      style={buttonStyle}
                    >
                      상세 보기
                    </button>
                  </article>
                ))}
              </div>
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

export default CouponListPage;