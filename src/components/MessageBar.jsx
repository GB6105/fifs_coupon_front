import React from 'react';

// type prop: 'success' | 'error' | 'info' (기본값 'info')
const MessageBar = ({ message, isVisible, hideMessage, config, type = 'info' }) => {
  if (!message) return null;

  // 타입별 좌측 인디케이터 바 렌더링 헬퍼
  const renderIndicator = () => {
    if (type === 'success') {
      return <span className="w-1 self-stretch rounded-full bg-green-500 shrink-0" aria-hidden="true" />;
    }
    if (type === 'error') {
      return <span className="w-1 self-stretch rounded-full bg-red-500 shrink-0" aria-hidden="true" />;
    }
    // info: config 기반 동적 색상 — 인라인 style 사용
    return (
      <span
        className="w-1 self-stretch rounded-full shrink-0"
        aria-hidden="true"
        style={{ backgroundColor: config.primary_action_color }}
      />
    );
  };

  return (
    <div
      id="message-bar"
      className={`fixed left-1/2 -translate-x-1/2 bottom-6 max-w-xs w-[90%] rounded-full px-4 py-2 text-xs shadow-md flex items-center justify-between gap-3 transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      role="status"
      aria-live="polite"
      style={{
        backgroundColor: config.surface_color,
        color: config.text_color,
      }}
    >
      {/* 좌측 타입별 컬러 인디케이터 바 */}
      {renderIndicator()}
      <span id="message-text" className="flex-1">{message}</span>
      <button
        id="message-close"
        type="button"
        className="shrink-0 text-[11px] px-2 py-0.5 rounded-full border focus-visible:outline-none"
        onClick={hideMessage}
        style={{
          borderColor: config.secondary_action_color,
          color: config.text_color,
          fontSize: (config.font_size * 0.75) + 'px'
        }}
      >
        닫기
      </button>
    </div>
  );
};

export default MessageBar;