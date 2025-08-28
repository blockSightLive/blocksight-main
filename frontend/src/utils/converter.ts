/**
 * @fileoverview Bitcoin and currency conversion utilities using context values
 * @version 1.0.0
 * @since 2025-08-23
 * @lastModified 2025-08-23
 * 
 * @description
 * Comprehensive conversion utilities for Bitcoin units (BTC, sats) and fiat currencies.
 * Uses dynamic context values for real-time rates and supports user-selected fiat preferences.
 * All conversions are calculated using current market rates from the backend.
 * 
 * @dependencies
 * - BitcoinContext for current price and FX rates
 * - TypeScript strict mode for type safety
 * 
 * @usage
 * ```typescript
 * import { useBitcoin } from '../contexts/BitcoinContext'
 * import { btcToFiat, fiatToBtc, satsToBtc } from '../utils/converter'
 * 
 * const { state } = useBitcoin()
 * const usdValue = btcToFiat(1, 'USD', state)
 * const btcAmount = fiatToBtc(50000, 'USD', state)
 * const btcFromSats = satsToBtc(100000000, state)
 * ```
 * 
 * @state
 * ✅ Production Ready - Core conversion logic implemented
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Add historical rate support for time-based conversions
 * - [MEDIUM] Add precision controls for different use cases
 * - [LOW] Add unit tests for edge cases
 * 
 * @mockData
 * - No mock data - uses real context values
 * 
 * @performance
 * - Pure functions with no side effects
 * - Efficient calculations with minimal overhead
 * - Memoization-ready for expensive operations
 * 
 * @security
 * - Input validation for all conversion functions
 * - Safe number handling with fallbacks
 * - No external API calls or network requests
 * 
 * @styling
 * - No styling needed (pure utility file)
 */

import { BitcoinState, PriceUSD, FxRatesUSD } from '../types/bitcoin'

// ============================================================================
// CONSTANTS
// ============================================================================

export const SATS_PER_BTC = 100_000_000
export const SUPPORTED_FIAT_CURRENCIES = ['USD', 'EUR', 'BRL', 'ARS', 'ILS'] as const
export type SupportedFiat = typeof SUPPORTED_FIAT_CURRENCIES[number]

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates if a fiat currency is supported
 */
export const isValidFiat = (currency: string): currency is SupportedFiat => {
  return SUPPORTED_FIAT_CURRENCIES.includes(currency as SupportedFiat)
}

/**
 * Validates if context has valid price data
 */
export const hasValidPriceData = (state: BitcoinState): boolean => {
  const price = (state as any).priceUSD as PriceUSD | undefined
  return !!(price && typeof price.value === 'number' && price.value > 0)
}

/**
 * Validates if context has valid FX data
 */
export const hasValidFxData = (state: BitcoinState): boolean => {
  const fx = (state as any).fx as FxRatesUSD | undefined
  return !!(fx && fx.rates && Object.keys(fx.rates).length > 0)
}

/**
 * Gets the current USD price from context
 */
export const getCurrentUSDPrice = (state: BitcoinState): number | null => {
  if (!hasValidPriceData(state)) return null
  const price = (state as any).priceUSD as PriceUSD
  return price.value
}

/**
 * Gets the current FX rate for a specific currency
 */
export const getCurrentFxRate = (state: BitcoinState, targetFiat: SupportedFiat): number | null => {
  if (!hasValidFxData(state)) return null
  const fx = (state as any).fx as FxRatesUSD
  
  // USD is always 1.0 (base currency)
  if (targetFiat === 'USD') return 1.0
  
  const rate = fx.rates[targetFiat]
  return typeof rate === 'number' && rate > 0 ? rate : null
}

// ============================================================================
// BITCOIN UNIT CONVERSIONS
// ============================================================================

/**
 * Converts satoshis to Bitcoin (BTC)
 * @param sats - Amount in satoshis
 * @returns Amount in BTC
 */
export const satsToBtc = (sats: number): number => {
  if (typeof sats !== 'number' || sats < 0) return 0
  return sats / SATS_PER_BTC
}

/**
 * Converts Bitcoin (BTC) to satoshis
 * @param btc - Amount in BTC
 * @returns Amount in satoshis
 */
export const btcToSats = (btc: number): number => {
  if (typeof btc !== 'number' || btc < 0) return 0
  return Math.round(btc * SATS_PER_BTC)
}

/**
 * Converts satoshis to a specific fiat currency using current rates
 * @param sats - Amount in satoshis
 * @param targetFiat - Target fiat currency
 * @param state - Bitcoin context state
 * @returns Amount in target fiat currency, or null if conversion not possible
 */
export const satsToFiat = (sats: number, targetFiat: SupportedFiat, state: BitcoinState): number | null => {
  if (!hasValidPriceData(state) || !hasValidFxData(state)) return null
  
  const btc = satsToBtc(sats)
  return btcToFiat(btc, targetFiat, state)
}

/**
 * Converts fiat currency to satoshis using current rates
 * @param fiatAmount - Amount in fiat currency
 * @param sourceFiat - Source fiat currency
 * @param state - Bitcoin context state
 * @returns Amount in satoshis, or null if conversion not possible
 */
export const fiatToSats = (fiatAmount: number, sourceFiat: SupportedFiat, state: BitcoinState): number | null => {
  if (!hasValidPriceData(state) || !hasValidFxData(state)) return null
  
  const btc = fiatToBtc(fiatAmount, sourceFiat, state)
  if (btc === null) return null
  
  return btcToSats(btc)
}

// ============================================================================
// FIAT CONVERSIONS
// ============================================================================

/**
 * Converts Bitcoin (BTC) to a specific fiat currency using current rates
 * @param btc - Amount in BTC
 * @param targetFiat - Target fiat currency
 * @param state - Bitcoin context state
 * @returns Amount in target fiat currency, or null if conversion not possible
 */
export const btcToFiat = (btc: number, targetFiat: SupportedFiat, state: BitcoinState): number | null => {
  if (typeof btc !== 'number' || btc < 0) return null
  if (!hasValidPriceData(state)) return null
  
  const usdPrice = getCurrentUSDPrice(state)
  if (usdPrice === null) return null
  
  // Convert BTC to USD first
  const usdValue = btc * usdPrice
  
  // If target is USD, return directly
  if (targetFiat === 'USD') return usdValue
  
  // Convert USD to target fiat
  const fxRate = getCurrentFxRate(state, targetFiat)
  if (fxRate === null) return null
  
  return usdValue * fxRate
}

/**
 * Converts fiat currency to Bitcoin (BTC) using current rates
 * @param fiatAmount - Amount in fiat currency
 * @param sourceFiat - Source fiat currency
 * @param state - Bitcoin context state
 * @returns Amount in BTC, or null if conversion not possible
 */
export const fiatToBtc = (fiatAmount: number, sourceFiat: SupportedFiat, state: BitcoinState): number | null => {
  if (typeof fiatAmount !== 'number' || fiatAmount < 0) return null
  if (!hasValidPriceData(state) || !hasValidFxData(state)) return null
  
  const usdPrice = getCurrentUSDPrice(state)
  if (usdPrice === null) return null
  
  let usdValue: number
  
  // If source is USD, use directly
  if (sourceFiat === 'USD') {
    usdValue = fiatAmount
  } else {
    // Convert source fiat to USD
    const fxRate = getCurrentFxRate(state, sourceFiat)
    if (fxRate === null) return null
    usdValue = fiatAmount / fxRate
  }
  
  // Convert USD to BTC
  return usdValue / usdPrice
}

/**
 * Converts between two fiat currencies using USD as base
 * @param amount - Amount in source currency
 * @param sourceFiat - Source fiat currency
 * @param targetFiat - Target fiat currency
 * @param state - Bitcoin context state
 * @returns Amount in target fiat currency, or null if conversion not possible
 */
export const fiatToFiat = (amount: number, sourceFiat: SupportedFiat, targetFiat: SupportedFiat, state: BitcoinState): number | null => {
  if (typeof amount !== 'number' || amount < 0) return null
  if (!hasValidFxData(state)) return null
  
  // Same currency, return amount
  if (sourceFiat === targetFiat) return amount
  
  // Convert source to USD first
  let usdValue: number
  if (sourceFiat === 'USD') {
    usdValue = amount
  } else {
    const sourceRate = getCurrentFxRate(state, sourceFiat)
    if (sourceRate === null) return null
    usdValue = amount / sourceRate
  }
  
  // Convert USD to target
  if (targetFiat === 'USD') {
    return usdValue
  } else {
    const targetRate = getCurrentFxRate(state, targetFiat)
    if (targetRate === null) return null
    return usdValue * targetRate
  }
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Formats a Bitcoin amount with appropriate precision
 * @param btc - Amount in BTC
 * @param precision - Number of decimal places (default: 8)
 * @returns Formatted string
 */
export const formatBtc = (btc: number, precision: number = 8): string => {
  if (typeof btc !== 'number' || btc < 0) return '0.00000000'
  
  // For very small amounts, show more precision
  if (btc < 0.000001) precision = 8
  else if (btc < 0.001) precision = 6
  else if (btc < 1) precision = 4
  else precision = 2
  
  return btc.toFixed(precision)
}

/**
 * Formats a satoshi amount with appropriate precision
 * @param sats - Amount in satoshis
 * @returns Formatted string
 */
export const formatSats = (sats: number): string => {
  if (typeof sats !== 'number' || sats < 0) return '0'
  
  if (sats >= SATS_PER_BTC) {
    const btc = satsToBtc(sats)
    return `${formatBtc(btc)} BTC`
  } else if (sats >= 1000) {
    return `${(sats / 1000).toFixed(1)}k sats`
  } else {
    return `${sats} sats`
  }
}

/**
 * Formats a fiat amount with appropriate currency symbol
 * @param amount - Amount in fiat currency
 * @param currency - Currency code
 * @returns Formatted string
 */
export const formatFiat = (amount: number, currency: SupportedFiat): string => {
  if (typeof amount !== 'number' || amount < 0) return '0'
  
  const symbols: Record<SupportedFiat, string> = {
    USD: '$',
    EUR: '€',
    BRL: 'R$',
    ARS: '$',
    ILS: '₪'
  }
  
  const symbol = symbols[currency]
  const precision = amount < 1 ? 4 : 2
  
  return `${symbol}${amount.toFixed(precision)}`
}

// ============================================================================
// BULK CONVERSION HELPERS
// ============================================================================

/**
 * Converts BTC to all supported fiat currencies
 * @param btc - Amount in BTC
 * @param state - Bitcoin context state
 * @returns Object with conversions for all supported currencies
 */
export const btcToAllFiat = (btc: number, state: BitcoinState): Partial<Record<SupportedFiat, number>> => {
  const result: Partial<Record<SupportedFiat, number>> = {}
  
  SUPPORTED_FIAT_CURRENCIES.forEach(currency => {
    const converted = btcToFiat(btc, currency, state)
    if (converted !== null) {
      result[currency] = converted
    }
  })
  
  return result
}

/**
 * Gets current rates for all supported fiat currencies
 * @param state - Bitcoin context state
 * @returns Object with current rates for all supported currencies
 */
export const getAllCurrentRates = (state: BitcoinState): Partial<Record<SupportedFiat, number>> => {
  const result: Partial<Record<SupportedFiat, number>> = {}
  
  SUPPORTED_FIAT_CURRENCIES.forEach(currency => {
    if (currency === 'USD') {
      result[currency] = 1.0
    } else {
      const rate = getCurrentFxRate(state, currency)
      if (rate !== null) {
        result[currency] = rate
      }
    }
  })
  
  return result
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets the timestamp of the most recent price/FX update
 * @param state - Bitcoin context state
 * @returns Timestamp in milliseconds, or null if no data
 */
export const getLastUpdateTimestamp = (state: BitcoinState): number | null => {
  const price = (state as any).priceUSD as PriceUSD | undefined
  const fx = (state as any).fx as FxRatesUSD | undefined
  
  if (!price && !fx) return null
  
  const timestamps = []
  if (price?.asOfMs) timestamps.push(price.asOfMs)
  if (fx?.asOfMs) timestamps.push(fx.asOfMs)
  
  return timestamps.length > 0 ? Math.max(...timestamps) : null
}

/**
 * Checks if the current price/FX data is stale (older than threshold)
 * @param state - Bitcoin context state
 * @param thresholdMs - Threshold in milliseconds (default: 5 minutes)
 * @returns True if data is stale
 */
export const isDataStale = (state: BitcoinState, thresholdMs: number = 5 * 60 * 1000): boolean => {
  const lastUpdate = getLastUpdateTimestamp(state)
  if (lastUpdate === null) return true
  
  return Date.now() - lastUpdate > thresholdMs
}

/**
 * Gets the data provider information
 * @param state - Bitcoin context state
 * @returns Object with provider information
 */
export const getDataProviders = (state: BitcoinState): { price?: string; fx?: string } => {
  const price = (state as any).priceUSD as PriceUSD | undefined
  const fx = (state as any).fx as FxRatesUSD | undefined
  
  return {
    price: price?.provider,
    fx: fx?.provider
  }
}
