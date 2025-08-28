/**
 * @fileoverview Error display component with retry functionality
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * 
 * @description
 * Reusable error display component that shows error messages with retry
 * functionality. Implements Bitcoin-specific error handling patterns.
 * 
 * @dependencies
 * - Error handling patterns
 * - Bitcoin error types
 * - Retry functionality
 * 
 * @usage
 * Display error states with retry options for Bitcoin operations
 * 
 * @state
 * 🔄 In Development - Basic error display with i18n support
 * 
 * @bugs
 * - i18n translations not fully implemented
 * - Bitcoin-specific error handling incomplete
 * 
 * @todo
 * - [HIGH] Add Bitcoin-specific error categorization
 * - [HIGH] Implement error reporting to external service
 * - [MEDIUM] Add Bitcoin-specific error messages and recovery
 * - [MEDIUM] Implement error analytics and monitoring
 * - [LOW] Add error history and debugging tools
 * 
 * @mockData
 * - i18n translations: Placeholder text (implement full i18n system)
 * - Error messages: Basic error display (add Bitcoin-specific error types)
 * - Retry functionality: Basic retry button (implement smart retry logic)
 * - Error suggestions: Static suggestion list (add dynamic Bitcoin-specific help)
 * 
 * @performance
 * - Efficient error rendering
 * - Minimal re-renders
 * 
 * @security
 * - Safe error message display
 * - No sensitive data exposure
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './ErrorDisplay.module.css'

interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
  className?: string
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  const { t } = useTranslation()

  return (
    <div className={`${styles.root} ${className}`}>
      <div className={styles.icon}>⚠️</div>
      <h3 className={styles.title}>{t('errors.title', { defaultValue: 'Error' })}</h3>
      <p className={styles.message}>{error.startsWith('errors.') ? t(error as string) : error}</p>
      
      {onRetry && (
        <button 
          className={styles.retry}
          onClick={onRetry}
          type="button"
        >
          {t('errors.retry')}
        </button>
      )}
      
      <div className={styles.help}>
        <p>{t('errors.help')}</p>
        <ul className={styles.suggestions}>
          <li>{t('errors.suggestion1')}</li>
          <li>{t('errors.suggestion2')}</li>
          <li>{t('errors.suggestion3')}</li>
        </ul>
      </div>
    </div>
  )
}
