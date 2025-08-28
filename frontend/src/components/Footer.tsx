/**
 * @fileoverview Footer component with Bitcoin-specific information and links
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * 
 * @description
 * Footer component that provides Bitcoin-specific information, links, and
 * application metadata. Implements the footer structure from the roadmap.
 * 
 * @dependencies
 * - Internationalization support
 * - Bitcoin context for status
 * - Footer navigation links
 * 
 * @usage
 * Application footer with Bitcoin information and navigation
 * 
 * @state
 * 🔄 In Development - Basic footer with navigation and links
 * 
 * @bugs
 * - i18n translations not fully implemented
 * - Bitcoin context integration incomplete
 * 
 * @todo
 * - [HIGH] Add Bitcoin network statistics and real-time data
 * - [HIGH] Implement social media links and sharing
 * - [MEDIUM] Add newsletter signup and updates
 * - [MEDIUM] Integrate with Bitcoin context for live status
 * - [LOW] Add footer analytics and tracking
 * 
 * @mockData
 * - i18n translations: Placeholder text (implement full i18n system)
 * - Network status: Basic online/offline indicator (integrate with real network monitoring)
 * - Network statistics: Static block height display (integrate with real blockchain data)
 * - Fee estimates: Placeholder fee display (integrate with real fee calculation)
 * - External links: Static Bitcoin resource links (add dynamic resource discovery)
 * 
 * @performance
 * - Efficient footer rendering
 * - Minimal re-renders
 * 
 * @security
 * - Safe external links
 * - No sensitive data exposure
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useBitcoin } from '../contexts/BitcoinContext'
import './Footer.css'

export const Footer: React.FC = () => {
  const { t } = useTranslation()
  const { state } = useBitcoin()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Main Footer Content */}
        <div className="footer__content">
          {/* Brand Section */}
          <div className="footer__section">
            <h3 className="footer__title">BlockSight.live</h3>
            <p className="footer__description">
              {t('footer.description')}
            </p>
            <div className="footer__status">
              <span className="status-indicator">
                {t('footer.networkStatus')}: {state.networkStatus.isOnline ? t('status.online') : t('status.offline')}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h4 className="footer__subtitle">{t('footer.quickLinks')}</h4>
            <ul className="footer__links">
              <li><a href="/" className="footer__link">{t('navigation.dashboard')}</a></li>
              <li><a href="/search" className="footer__link">{t('navigation.search')}</a></li>
              <li><a href="/calculator" className="footer__link">{t('navigation.calculator')}</a></li>
              <li><a href="/settings" className="footer__link">{t('navigation.settings')}</a></li>
            </ul>
          </div>

          {/* Bitcoin Resources */}
          <div className="footer__section">
            <h4 className="footer__subtitle">{t('footer.bitcoinResources')}</h4>
            <ul className="footer__links">
              <li><a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer" className="footer__link">Bitcoin.org</a></li>
              <li><a href="https://github.com/bitcoin/bitcoin" target="_blank" rel="noopener noreferrer" className="footer__link">Bitcoin Core</a></li>
              <li><a href="https://en.bitcoin.it" target="_blank" rel="noopener noreferrer" className="footer__link">Bitcoin Wiki</a></li>
              <li><a href="https://bitcoin.stackexchange.com" target="_blank" rel="noopener noreferrer" className="footer__link">Bitcoin Stack Exchange</a></li>
            </ul>
          </div>

          {/* Network Information */}
          <div className="footer__section">
            <h4 className="footer__subtitle">{t('footer.networkInfo')}</h4>
            <div className="footer__network-stats">
              {state.blocks.length > 0 && (
                <div className="network-stat">
                  <span className="stat-label">{t('footer.currentHeight')}</span>
                  <span className="stat-value">#{state.blocks[0]?.height}</span>
                </div>
              )}
              {state.feeEstimates && state.feeEstimates.fast && (
                <div className="network-stat">
                  <span className="stat-label">{t('footer.fastFee')}</span>
                  <span className="stat-value">{state.feeEstimates.fast} sats/vB</span>
                </div>
              )}
              {state.networkStatus && state.networkStatus.load && (
                <div className="network-stat">
                  <span className="stat-label">{t('footer.networkLoad')}</span>
                  <span className="stat-value">{state.networkStatus.load}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <div className="footer__legal">
            <p className="footer__copyright">
              © {currentYear} BlockSight.live. {t('footer.allRightsReserved')}
            </p>
            <div className="footer__legal-links">
              <a href="/privacy" className="footer__legal-link">{t('footer.privacy')}</a>
              <a href="/terms" className="footer__legal-link">{t('footer.terms')}</a>
              <a href="/disclaimer" className="footer__legal-link">{t('footer.disclaimer')}</a>
            </div>
          </div>
          
          <div className="footer__version">
            <span className="version-text">v1.0.0</span>
            <span className="version-label">{t('settings.version')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
