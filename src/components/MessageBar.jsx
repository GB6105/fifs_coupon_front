// src/components/MessageBar.jsx
import React from 'react';

const MessageBar = ({ message, isVisible, hideMessage, config }) => {
  if (!message) return null;

  return (
    <div
      id="message-bar"
      className={`fixed left-1/2 -translate-x-1/2 bottom-6 max-w-xs w-[90%] rounded-full px-4 py-2 text-xs shadow-md flex items-center justify-between gap-3 transition-opacity ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      role="status"
      aria-live="polite"
      style={{
        backgroundColor: config.surface_color,
        color: config.text_color,
      }}
    >
      <span id="message-text">{message}</span>
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