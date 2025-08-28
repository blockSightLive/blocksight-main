/**
 * @fileoverview Hook for managing user fiat currency preferences
 * @version 1.0.0
 * @since 2025-08-23
 * @lastModified 2025-08-23
 * 
 * @description
 * Manages user's preferred fiat currency for display purposes.
 * Integrates with the converter utility to show prices in user's preferred currency.
 * 
 * @dependencies
 * - React hooks
 * - Local storage for persistence
 * - Converter utility types
 * 
 * @usage
 * ```typescript
 * const { preferredFiat, setPreferredFiat, isSupported } = useFiatPreference()
 * ```
 * 
 * @state
 * ✅ Production Ready - Basic preference management implemented
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Add validation for supported currencies
 * - [MEDIUM] Add fallback to USD if preference is invalid
 * - [LOW] Add currency symbol and formatting preferences
 * 
 * @mockData
 * - No mock data - uses real user preferences
 * 
 * @performance
 * - Minimal overhead
 * - Local storage access only on preference change
 * 
 * @security
 * - No external data
 * - Local storage only
 * 
 * @styling
 * - No styling needed (pure hook file)
 */

import { useState, useEffect, useCallback } from 'react'
import { SupportedFiat, SUPPORTED_FIAT_CURRENCIES } from '../utils/converter'

const STORAGE_KEY = 'blocksight.preferredFiat'
const DEFAULT_FIAT: SupportedFiat = 'USD'

export const useFiatPreference = () => {
  const [preferredFiat, setPreferredFiatState] = useState<SupportedFiat>(DEFAULT_FIAT)

  // Load preference from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && SUPPORTED_FIAT_CURRENCIES.includes(stored as SupportedFiat)) {
        setPreferredFiatState(stored as SupportedFiat)
      }
    } catch (error) {
      console.warn('Failed to load fiat preference from localStorage:', error)
    }
  }, [])

  // Set preference and persist to localStorage
  const setPreferredFiat = useCallback((fiat: SupportedFiat) => {
    if (SUPPORTED_FIAT_CURRENCIES.includes(fiat)) {
      setPreferredFiatState(fiat)
      try {
        localStorage.setItem(STORAGE_KEY, fiat)
      } catch (error) {
        console.warn('Failed to save fiat preference to localStorage:', error)
      }
    }
  }, [])

  // Check if a currency is supported
  const isSupported = useCallback((currency: string): currency is SupportedFiat => {
    return SUPPORTED_FIAT_CURRENCIES.includes(currency as SupportedFiat)
  }, [])

  // Reset to default
  const resetToDefault = useCallback(() => {
    setPreferredFiat(DEFAULT_FIAT)
  }, [])

  return {
    preferredFiat,
    setPreferredFiat,
    isSupported,
    resetToDefault,
    supportedCurrencies: SUPPORTED_FIAT_CURRENCIES,
    defaultFiat: DEFAULT_FIAT
  }
}
