// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import Header from '../components/Header.jsx';

const SignupPage = ({ currentEmail, setCurrentEmail, goToCouponList, config, showMessage, resetEmail, memberRegisterAPI }) => {
  const [email, setEmail] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSigningUp) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      showMessage("이메일을 입력해 주세요.", 2500);
      return;
    }

    setIsSigningUp(true);

    try {
      // API 호출 로직을 App.jsx에서 받아 실행
      const success = await memberRegisterAPI(trimmedEmail);

      if (success) {
        setCurrentEmail(trimmedEmail);
        localStorage.setItem('currentEmail', trimmedEmail);

        showMessage("이메일 등록 완료! 쿠폰을 선택해 주세요.", 2500);
        goToCouponList(); // API 성공 시 다음 페이지로 이동
      } else {
        // API 호출은 성공했으나 (200 OK), 백엔드 로직상 등록 실패(예: 이메일 중복 등)
        showMessage("등록 실패: 이미 등록된 이메일이거나 서버 오류입니다.", 3500);
      }
    } catch (error) {
      // 네트워크 오류 또는 서버 응답 오류 (4xx, 5xx)
      console.error("멤버 등록 API 호출 오류:", error);
      showMessage("네트워크 오류 또는 서버에 연결할 수 없습니다.", 3500);
    } finally {
      setIsSigningUp(false);
    }
  };
  
const smallSize = config.font_size * 0.85;
  const tinySize = config.font_size * 0.75;
  const largeSize = config.font_size * 1.4;

  return (
    <div className="h-full flex flex-col">
      <Header currentEmail={currentEmail} resetEmail={resetEmail} config={config} />
      
      <main id="main-content" className="h-full flex items-center justify-center flex-grow" aria-live="polite">
        <div className="max-w-3xl w-full mx-auto px-6 pb-10">
          <section id="signup-page" aria-labelledby="signup-title" className="pt-6">
            <div className="rounded-2xl px-6 py-6 shadow-sm border-2" id="signup-card" 
                 style={{ backgroundColor: config.surface_color, borderColor: config.secondary_action_color }}>
              
              <h2 id="signup-title" className="font-semibold mb-2" style={{ fontSize: largeSize + 'px' }}>
                {config.main_title}
              </h2>
              <p id="signup-subtitle" className="text-sm opacity-90 mb-4" style={{ fontSize: config.font_size + 'px' }}>
                {config.signup_subtitle}
              </p>
              
              <form id="signup-form" className="space-y-3" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
                  <label htmlFor="signup-email" className="text-sm font-medium" style={{ fontSize: smallSize + 'px' }}>
                    이메일
                  </label>
                  <input
                    id="signup-email"
                    name="signup-email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full px-3 py-2 rounded-lg border text-sm focus-visible:outline-none"
                    placeholder="you@example.com"
                    aria-describedby="signup-help"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ borderColor: config.secondary_action_color }}
                  />
                  <p id="signup-help" className="text-xs opacity-80" style={{ fontSize: tinySize + 'px' }}>
                    쿠폰 신청 내역을 이메일 기준으로 보여드려요.
                  </p>
                </div>
                <button
                  id="signup-submit"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none"
                  disabled={isSigningUp}
                  style={{ backgroundColor: config.primary_action_color, color: '#111827', fontSize: smallSize + 'px' }}
                >
                  <span id="signup-button-text">{config.signup_button_text}</span>
                  <span id="signup-spinner" className={`w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin ${isSigningUp ? '' : 'hidden'}`} aria-hidden="true"></span>
                </button>
              </form>
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

export default SignupPage;