/**
 * @fileoverview Header component for BlockSight.live with navigation and controls
 * @version 1.0.0
 * @since 2025-08-22
 * @lastModified 2025-08-25
 *
 * @description
 * Main header component with brand, centered search, and right-side controls.
 * Features dropdown navigation and language selection with state management.
 * Implements proper spacing and distribution for optimal visual balance.
 * Dropdowns are mutually exclusive - opening one closes the other.
 * 
 * @styling
 * - CSS Custom Properties: Theme integration and design tokens
 * - Responsive Design: Mobile-first approach with dropdown navigation
 * - Glassmorphism: Transparent backgrounds with backdrop blur
 * 
 * @dependencies
 * - ThemeContext for theme switching
 * - MainOrchestrator for network status and blockchain data
 * - React Router for navigation
 * - i18n for internationalization
 * 
 * @state
 * ✅ Clean - Simplified structure for design token control
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - None currently identified
 * 
 * @performance
 * - Efficient state management
 * - Minimal re-renders with proper useEffect dependencies
 * 
 * @security
 * - Safe event handling
 * - Proper cleanup of event listeners
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMainOrchestrator } from '../contexts/MainOrchestrator'
import { SearchBar } from './SearchBar'
import { ErrorBoundary } from './error-handling'
import './Header.css'
import { useTheme } from '../contexts/ThemeContext'
import { useBlockchainVisualization } from '../contexts/BlockchainVisualizationContext'

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { mode: blockchainMode, toggleMode: toggleBlockchainMode } = useBlockchainVisualization()
  const { state } = useMainOrchestrator()
  
  // Dropdown state management
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
  
  const toggleNavDropdown = () => {
    setIsNavDropdownOpen(!isNavDropdownOpen)
    setIsLangDropdownOpen(false) // Close language dropdown when opening nav
  }
  
  const toggleLangDropdown = () => {
    setIsLangDropdownOpen(!isLangDropdownOpen)
    setIsNavDropdownOpen(false) // Close nav dropdown when opening language
  }
  
  const closeAllDropdowns = () => {
    setIsNavDropdownOpen(false)
    setIsLangDropdownOpen(false)
  }
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.nav-dropdown') && !target.closest('.lang-dropdown-container')) {
        closeAllDropdowns()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Close dropdowns on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAllDropdowns()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const [query, setQuery] = useState('')

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: route to /search with query string when search page is wired
    if (query.trim().length > 0) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <ErrorBoundary componentName="Header" maxRetries={2} enableAutoRecovery={true}>
      <header className="header">
      {/* Brand Section - Left Side */}
      <div className="header__brand">
        <Link to="/" className="header__logo">
          <span className="logo-text">BlockSight.live</span>
        </Link>
      </div>

      {/* Search Container - Center Section */}
      <div className="header__search-container">
        <SearchBar
          query={query}
          onChange={setQuery}
          onSubmit={onSubmitSearch}
        />
      </div>

      {/* Aside Section - Right Side Controls */}
      <aside className="header__aside">
        {/* Language Selector */}
        <div className="lang-dropdown-container">
          <button 
            className="lang-select"
            onClick={toggleLangDropdown}
            aria-label="Select language"
            title="Select language"
          >
            {i18n.language === 'en' && 'us EN'}
            {i18n.language === 'es' && 'es ES'}
            {i18n.language === 'he' && 'he IL'}
            {i18n.language === 'pt' && 'pt BR'}
          </button>
          
          {/* Language Dropdown Menu */}
          {isLangDropdownOpen && (
            <div className="lang-dropdown">
              <button 
                className={`lang-dropdown__item ${i18n.language === 'en' ? 'lang-dropdown__item--active' : ''}`}
                onClick={() => { i18n.changeLanguage('en'); closeAllDropdowns(); }}
              >
                English (US)
              </button>
              <button 
                className={`lang-dropdown__item ${i18n.language === 'es' ? 'lang-dropdown__item--active' : ''}`}
                onClick={() => { i18n.changeLanguage('es'); closeAllDropdowns(); }}
              >
                Español
              </button>
              <button 
                className={`lang-dropdown__item ${i18n.language === 'he' ? 'lang-dropdown__item--active' : ''}`}
                onClick={() => { i18n.changeLanguage('he'); closeAllDropdowns(); }}
              >
                עברית
              </button>
              <button 
                className={`lang-dropdown__item ${i18n.language === 'pt' ? 'lang-dropdown__item--active' : ''}`}
                onClick={() => { i18n.changeLanguage('pt'); closeAllDropdowns(); }}
              >
                Português
              </button>
            </div>
          )}
        </div>
        
        {/* Navigation Dropdown */}
        <div className="nav-dropdown">
          <button 
            className="nav-dropdown__toggle"
            onClick={toggleNavDropdown}
            aria-label={t('header.navigation')}
            title={t('header.navigation')}
          >
            <span className="nav-dropdown__text">{t('header.navigation')}</span>
          </button>
          
          {isNavDropdownOpen && (
            <div className="nav-dropdown__menu">
              <Link 
                to="/" 
                className="nav-dropdown__item"
                onClick={closeAllDropdowns}
              >
                {t('navigation.dashboard')}
              </Link>
              <Link 
                to="/search" 
                className="nav-dropdown__item"
                onClick={closeAllDropdowns}
              >
                {t('navigation.search')}
              </Link>
              <Link 
                to="/calculator" 
                className="nav-dropdown__item"
                onClick={closeAllDropdowns}
              >
                {t('navigation.calculator')}
              </Link>
              <Link 
                to="/settings" 
                className="nav-dropdown__item"
                onClick={closeAllDropdowns}
              >
                {t('navigation.settings')}
              </Link>
            </div>
          )}
        </div>
        
        {/* Theme Toggle */}
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={t('header.themeToggle')}
          title={t('header.themeToggle')}
        >
          <span className="theme-toggle__icon">
            {theme === 'light' ? '🌙' : '☀️'}
          </span>
          <span className="theme-toggle__text">
            {theme === 'light' ? t('header.darkMode') : t('header.lightMode')}
          </span>
        </button>
        
        {/* Blockchain Visualization Toggle */}
        <button 
          className="blockchain-toggle"
          onClick={toggleBlockchainMode}
          aria-label="Toggle blockchain visualization"
          title="Toggle between 2D and 3D blockchain visualization"
        >
          <span className="blockchain-toggle__text">
            {blockchainMode === '3d' ? '3D' : '2D'}
          </span>
        </button>
        
        {/* Status Dots */}
        <div className="status-dots">
          <span className={`dot ${state.websocket.connected ? 'dot--ok' : 'dot--down'}`}></span>
          <span className="dot dot--ok"></span>
        </div>
      </aside>
    </header>
    </ErrorBoundary>
  )
}
