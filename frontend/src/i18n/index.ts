/**
 * @fileoverview i18n bootstrap and configuration for BlockSight.live
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * @state 🔄 In Development
 * @description Internationalization setup with comprehensive translation files
 * 
 * @todo [HIGH] Install and configure i18next + react-i18next packages
 * @todo [HIGH] Replace placeholder interface with actual i18next implementation
 * @todo [MEDIUM] Add language detection and switching functionality
 * @todo [MEDIUM] Implement RTL support for Hebrew language
 * @todo [LOW] Add language persistence and user preferences
 * @todo [LOW] Add fallback language handling and error recovery
 * 
 * @mockData Translation files are complete but i18next integration is pending
 * 
 * @bugs No actual i18next implementation yet - only placeholder interface
 * 
 * @dependencies
 * - i18next (to be installed)
 * - react-i18next (to be installed)
 * - Translation files (✅ Complete)
 * 
 * @files
 * - locales/en/translation.json (✅ Complete - English)
 * - locales/es/translation.json (✅ Complete - Spanish)
 * - locales/he/translation.json (✅ Complete - Hebrew)
 * - locales/pt/translation.json (✅ Complete - Portuguese)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import es from './locales/es/translation.json';
import he from './locales/he/translation.json';
import pt from './locales/pt/translation.json';

// Initialize immediately on module import
void i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, es: { translation: es }, he: { translation: he }, pt: { translation: pt } },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  });

export { i18n };

// Export translation keys for type safety
export const translationKeys = {
  app: {
    title: 'app.title',
    tagline: 'app.tagline',
    loading: 'app.loading',
    error: 'app.error'
  },
  navigation: {
    home: 'navigation.home',
    dashboard: 'navigation.dashboard',
    search: 'navigation.search',
    calculator: 'navigation.calculator',
    settings: 'navigation.settings'
  },
  header: {
    logo: 'header.logo',
    searchPlaceholder: 'header.searchPlaceholder',
    searchButton: 'header.searchButton',
    languageSelector: 'header.languageSelector'
  },
  dashboard: {
    title: 'dashboard.title',
    leftPanel: {
      title: 'dashboard.leftPanel.title',
      noResults: 'dashboard.leftPanel.noResults'
    },
    centerPanel: {
      title: 'dashboard.centerPanel.title',
      memoryPool: {
        title: 'dashboard.centerPanel.memoryPool.title'
      }
    },
    rightPanel: {
      title: 'dashboard.rightPanel.title'
    }
  },
  bitcoin: {
    price: {
      title: 'bitcoin.price.title',
      currentPrice: 'bitcoin.price.currentPrice'
    },
    fees: {
      title: 'bitcoin.fees.title',
      nextBlock: 'bitcoin.fees.nextBlock'
    },
    network: {
      title: 'bitcoin.network.title',
      load: 'bitcoin.network.load'
    }
  },
  common: {
    yes: 'common.yes',
    no: 'common.no',
    ok: 'common.ok',
    cancel: 'common.cancel',
    close: 'common.close',
    back: 'common.back',
    next: 'common.next',
    previous: 'common.previous'
  }
} as const;

// Language configuration
export const supportedLanguages = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    rtl: false
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    rtl: false
  },
  he: {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    rtl: true
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    rtl: false
  }
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;
export type TranslationKey = typeof translationKeys;

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// RTL languages
export const RTL_LANGUAGES: SupportedLanguage[] = ['he'];

