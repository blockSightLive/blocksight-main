/**
 * @fileoverview Site Settings component for user preferences and configuration
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * 
 * @description
 * Component that provides site settings with language support, theme toggle,
 * currency preferences, and Bitcoin unit preferences. Implements the Site
 * Settings MVP feature from the roadmap.
 * 
 * @dependencies
 * - User preferences
 * - Language support
 * - Theme management
 * - Currency settings
 * 
 * @usage
 * Manages user preferences and site configuration
 * 
 * @state
 * 🔄 In Development - Basic settings interface with mock functionality
 * 
 * @bugs
 * - No real settings persistence
 * - Mock language and theme support
 * 
 * @todo
 * - [HIGH] Implement real settings persistence and storage
 * - [HIGH] Add comprehensive language support with i18n
 * - [HIGH] Add theme toggle with dark/light mode
 * - [MEDIUM] Add currency preferences and conversion
 * - [MEDIUM] Implement Bitcoin unit preferences (BTC, sats, mBTC)
 * - [LOW] Add settings import/export functionality
 * 
 * @mockData
 * - Language options: Static language list (implement full i18n system)
 * - Theme options: Basic light/dark toggle (implement comprehensive theme system)
 * - Currency options: Static currency list (implement live currency API)
 * - Bitcoin units: Basic BTC/sats options (add comprehensive unit support)
 * - Settings persistence: No persistence yet (implement localStorage/backend storage)
 * 
 * @performance
 * - Efficient settings management
 * - Fast preference updates
 * 
 * @security
 * - Safe settings storage
 * - Input validation
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './SiteSettings.css'

interface SiteSettingsProps {
  onLanguageChange: (language: string) => void
  onThemeChange: (theme: string) => void
  onCurrencyChange: (currency: string) => void
}

export const SiteSettings: React.FC<SiteSettingsProps> = ({
  onLanguageChange,
  onThemeChange,
  onCurrencyChange
}) => {
  const { t } = useTranslation()
  const [language, setLanguage] = useState('en')
  const [theme, setTheme] = useState('light')
  const [currency, setCurrency] = useState('USD')
  const [bitcoinUnit, setBitcoinUnit] = useState('BTC')

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    onLanguageChange(newLanguage)
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    onThemeChange(newTheme)
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
    onCurrencyChange(newCurrency)
  }

  return (
    <div className="site-settings">
      <div className="settings__header">
        <h3>{t('settings.title')}</h3>
      </div>

      <div className="settings__section">
        <h4>{t('settings.language')}</h4>
        <div className="setting-item">
          <label htmlFor="language-select">{t('settings.language')}:</label>
          <select
            id="language-select"
            className="setting-select"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="en">{t('header.english')}</option>
            <option value="es">{t('header.spanish')}</option>
            <option value="he">{t('header.hebrew')}</option>
            <option value="pt">{t('header.portuguese')}</option>
          </select>
        </div>
      </div>

      <div className="settings__section">
        <h4>{t('settings.theme')}</h4>
        <div className="setting-item">
          <label htmlFor="theme-select">{t('settings.theme')}:</label>
          <select
            id="theme-select"
            className="setting-select"
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            <option value="light">{t('settings.light')}</option>
            <option value="dark">{t('settings.dark')}</option>
            <option value="auto">{t('settings.auto')}</option>
          </select>
        </div>
      </div>

      <div className="settings__section">
        <h4>{t('settings.currency')}</h4>
        <div className="setting-item">
          <label htmlFor="currency-select">{t('settings.currency')}:</label>
          <select
            id="currency-select"
            className="setting-select"
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>
      </div>

      <div className="settings__section">
        <h4>{t('settings.units')}</h4>
        <div className="setting-item">
          <label htmlFor="bitcoin-unit-select">{t('settings.units')}:</label>
          <select
            id="bitcoin-unit-select"
            className="setting-select"
            value={bitcoinUnit}
            onChange={(e) => setBitcoinUnit(e.target.value)}
          >
            <option value="BTC">BTC</option>
            <option value="sats">sats</option>
            <option value="mBTC">mBTC</option>
            <option value="μBTC">μBTC</option>
          </select>
        </div>
      </div>

      <div className="settings__info">
        <p>{t('settingsPage.localStorage', { defaultValue: "Your preferences are automatically saved to your browser's local storage." })}</p>
        <p>{t('settingsPage.languageImmediate', { defaultValue: 'Language changes will take effect immediately.' })}</p>
        <button className="setting-button" onClick={() => {
          try {
            localStorage.removeItem('blocksight.bitcoin.network')
          } catch { /* Ignore localStorage errors */ }
          window.location.reload()
        }}>{t('settingsPage.resetNetworkState', { defaultValue: 'Reset persisted network state' })}</button>
      </div>
    </div>
  )
}
