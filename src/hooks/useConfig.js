// src/hooks/useConfig.js
import { useState, useEffect, useCallback } from 'react';

// Element SDK를 위한 기본 설정
const defaultConfig = {
  background_color: "#0f172a", 
  surface_color: "#111827", 
  text_color: "#e5e7eb", 
  primary_action_color: "#f97316", 
  secondary_action_color: "#4b5563", 
  font_family: "Pretendard",
  font_size: 14,
  main_title: "우와한 커피",
  signup_subtitle: "이메일을 입력하고 선착순 커피 쿠폰을 받아보세요.",
  signup_button_text: "등록하기",
  coupon_page_title: "쿠폰을 선택하세요",
  coupon_info_title: "쿠폰 정보",
  apply_button_text: "쿠폰 신청하기",
  footer_text: "선착순 쿠폰 서비스 · 우와한 커피"
};

export const useElementConfig = () => {
    const [config, setConfig] = useState(defaultConfig);

    const applyConfigToUI = useCallback((currentConfig) => {
        const cfg = currentConfig || defaultConfig;
        
        // 1. React 상태 업데이트
        setConfig(cfg);

        // 2. DOM 레벨 스타일 적용 (전역)
        document.body.style.backgroundColor = cfg.background_color;
        document.body.style.color = cfg.text_color;
        const fullFontStack = cfg.font_family + ", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        document.body.style.fontFamily = fullFontStack;
        
        // NOTE: 개별 컴포넌트의 인라인 스타일은 config 상태를 통해 처리됩니다.
    }, []);

    useEffect(() => {
        if (!window.elementSdk) {
            applyConfigToUI(defaultConfig);
            return;
        }
        
        // --- Element SDK 초기화 및 Config 매핑 로직 (원본 app.js에서 가져옴) ---
        window.elementSdk.init({
            defaultConfig,
            onConfigChange: (newConfig) => {
                applyConfigToUI(newConfig);
            },
            mapToCapabilities: (config) => {
                const cfg = config || defaultConfig;
                const setAndNotify = (key) => (value) => {
                    cfg[key] = value;
                    window.elementSdk.setConfig({ [key]: value });
                };

                return {
                    recolorables: [
                        { get: () => cfg.background_color, set: setAndNotify('background_color') },
                        { get: () => cfg.surface_color, set: setAndNotify('surface_color') },
                        { get: () => cfg.text_color, set: setAndNotify('text_color') },
                        { get: () => cfg.primary_action_color, set: setAndNotify('primary_action_color') },
                        { get: () => cfg.secondary_action_color, set: setAndNotify('secondary_action_color') },
                    ],
                    fontEditable: { get: () => cfg.font_family, set: setAndNotify('font_family') },
                    fontSizeable: { get: () => cfg.font_size, set: setAndNotify('font_size') }
                };
            },
            mapToEditPanelValues: (config) =>
                new Map([
                    ["main_title", config.main_title || defaultConfig.main_title],
                    ["signup_subtitle", config.signup_subtitle || defaultConfig.signup_subtitle],
                    ["signup_button_text", config.signup_button_text || defaultConfig.signup_button_text],
                    ["coupon_page_title", config.coupon_page_title || defaultConfig.coupon_page_title],
                    ["coupon_info_title", config.coupon_info_title || defaultConfig.coupon_info_title],
                    ["apply_button_text", config.apply_button_text || defaultConfig.apply_button_text],
                    ["footer_text", config.footer_text || defaultConfig.footer_text]
                ])
        });

        // 초기 config 적용
        applyConfigToUI(window.elementSdk.config || defaultConfig);
    }, [applyConfigToUI]);

    return { config, applyConfig: applyConfigToUI, defaultConfig };
};