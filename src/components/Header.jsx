import React from 'react';

const Header = ({ currentEmail, resetEmail, config, applyConfig }) => {
  const primaryColor = config.primary_action_color;

  return (
    <header className="w-full">
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <svg
            className="w-9 h-9 rounded-full p-1.5"
            id="logo-circle"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ backgroundColor: primaryColor + "22", color: primaryColor }}
          >
            <rect x="0" y="0" width="24" height="24" rx="12"></rect>
            <path
              id="logo-mug"
              d="M7 7h7.5a1.5 1.5 0 0 1 1.5 1.5V15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8.5A1.5 1.5 0 0 1 7 7zm9 2h1a2 2 0 0 1 0 4h-1V9z"
              fill="currentColor"
            ></path>
            <path
              id="logo-steam"
              d="M11 5c0-.6.2-1 .5-1.3.3-.3.5-.7.5-1.2M14 5c0-.6.2-1 .5-1.3.3-.3.5-.7.5-1.2"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            ></path>
          </svg>
          <div>
            <h1 id="main-title" className="font-semibold tracking-tight" style={{ fontSize: (config.font_size * 1.8) + 'px' }}>
              {config.main_title}
            </h1>
            <p id="header-tagline" className="text-sm opacity-80" style={{ fontSize: (config.font_size * 0.85) + 'px' }}>
              First in, First Served Coupon Service
            </p>
          </div>
        </div>
        <nav aria-label="주요 내비게이션">
          <button
            id="nav-reset"
            type="button"
            className="text-xs px-3 py-1.5 rounded-full border transition-colors focus-visible:outline-none"
            onClick={resetEmail}
            style={{ borderColor: config.secondary_action_color, color: config.text_color, fontSize: (config.font_size * 0.85) + 'px' }}
          >
            처음으로
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;