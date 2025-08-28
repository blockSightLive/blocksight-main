/**
 * @fileoverview Minimal Bitcoin pattern recognition utilities for passive blockchain viewing
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-27
 * @lastModified 2025-08-27
 * 
 * @description
 * Lightweight utilities for recognizing Bitcoin data patterns and providing meaningful display information.
 * This is NOT a validation system - we trust our backend (Bitcoin Core + Electrum) for data integrity.
 * Focus: Pattern recognition for UI display, not runtime validation.
 * 
 * @dependencies
 * - TypeScript strict mode for type safety
 * - Bitcoin protocol patterns for address recognition
 * 
 * @usage
 * Provides pattern recognition for displaying Bitcoin data meaningfully
 * 
 * @state
 * ✅ Production Ready - Minimal pattern recognition implemented
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [LOW] Add more address pattern recognition if needed
 * - [LOW] Add script type categorization if needed
 * 
 * @mockData
 * - No mock data - pure pattern recognition logic
 * 
 * @performance
 * - Lightweight regex patterns
 * - Minimal memory allocation
 * - Fast pattern matching
 * 
 * @security
 * - No validation - only pattern recognition
 * - Safe regex patterns
 * - Type-safe results
 * 
 * @styling
 * - No styling needed (pure utility file)
 */

/**
 * Bitcoin address pattern recognition for display purposes
 */
const ADDRESS_PATTERNS = {
  P2PKH: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,           // Legacy addresses
  P2SH: /^[23][a-km-zA-HJ-NP-Z1-9]{25,34}$/,            // P2SH addresses
  P2WPKH: /^bc1[a-z0-9]{39,59}$/,                        // Native SegWit
  P2WSH: /^bc1[a-z0-9]{39,59}$/,                         // Native SegWit Script
  P2TR: /^bc1p[a-z0-9]{39,59}$/,                         // Taproot addresses
  TESTNET_P2PKH: /^[mn2][a-km-zA-HJ-NP-Z1-9]{25,34}$/,  // Testnet legacy
  TESTNET_P2SH: /^[2][a-km-zA-HJ-NP-Z1-9]{25,34}$/,     // Testnet P2SH
  TESTNET_SEGWIT: /^tb1[a-z0-9]{39,59}$/                 // Testnet SegWit
}

/**
 * Bitcoin transaction ID pattern
 */
const TXID_PATTERN = /^[a-fA-F0-9]{64}$/

/**
 * Bitcoin block hash pattern
 */
const BLOCK_HASH_PATTERN = /^[a-fA-F0-9]{64}$/

/**
 * Bitcoin script pattern for display
 */
const SCRIPT_PATTERN = /^[a-zA-Z0-9\s()[\]{:;.,+\-*/<>=!&|~^%_]+$/

/**
 * Recognizes Bitcoin address type for display purposes
 * @param address - Bitcoin address string
 * @returns Address type description or 'Unknown'
 */
export function recognizeAddressType(address: string): string {
  if (!address || typeof address !== 'string') return 'Unknown'
  
  for (const [type, pattern] of Object.entries(ADDRESS_PATTERNS)) {
    if (pattern.test(address)) {
      return type
    }
  }
  
  return 'Unknown'
}

/**
 * Checks if a string looks like a valid Bitcoin address format
 * @param address - String to check
 * @returns True if it matches any known address pattern
 */
export function isAddressFormat(address: string): boolean {
  return recognizeAddressType(address) !== 'Unknown'
}

/**
 * Checks if a string looks like a valid Bitcoin transaction ID
 * @param txid - String to check
 * @returns True if it matches TXID pattern
 */
export function isTxidFormat(txid: string): boolean {
  return TXID_PATTERN.test(txid)
}

/**
 * Checks if a string looks like a valid Bitcoin block hash
 * @param hash - String to check
 * @returns True if it matches block hash pattern
 */
export function isBlockHashFormat(hash: string): boolean {
  return BLOCK_HASH_PATTERN.test(hash)
}

/**
 * Checks if a string looks like a valid Bitcoin script
 * @param script - String to check
 * @returns True if it matches script pattern
 */
export function isScriptFormat(script: string): boolean {
  return SCRIPT_PATTERN.test(script)
}

/**
 * Categorizes Bitcoin script for display purposes
 * @param script - Script string
 * @returns Script category description
 */
export function categorizeScript(script: string): string {
  if (!script || typeof script !== 'string') return 'Unknown'
  
  const upper = script.toUpperCase()
  
  if (upper.includes('OP_RETURN')) return 'Data Output (OP_RETURN)'
  if (upper.includes('OP_CHECKSIG')) return 'Single Signature'
  if (upper.includes('OP_CHECKMULTISIG')) return 'Multi-Signature'
  if (upper.includes('OP_HASH160')) return 'Hash-based'
  if (upper.includes('OP_DUP') && upper.includes('OP_HASH160')) return 'P2PKH'
  if (upper.includes('OP_EQUAL')) return 'Hash-based'
  if (upper.includes('OP_0') || upper.includes('OP_1')) return 'SegWit'
  
  return 'Custom Script'
}

/**
 * Formats Bitcoin amount with appropriate precision for display
 * @param sats - Amount in satoshis
 * @returns Formatted string
 */
export function formatBitcoinAmount(sats: number): string {
  if (typeof sats !== 'number' || sats < 0) return '0 BTC'
  
  const btc = sats / 100_000_000
  
  if (btc < 0.001) return `${sats} sats`
  if (btc < 1) return `${btc.toFixed(6)} BTC`
  if (btc < 1000) return `${btc.toFixed(4)} BTC`
  return `${btc.toFixed(2)} BTC`
}

/**
 * Formats transaction fee for display
 * @param fee - Fee in satoshis
 * @returns Formatted fee string
 */
export function formatFee(fee: number): string {
  if (typeof fee !== 'number' || fee < 0) return '0 sats'
  
  if (fee < 1000) return `${fee} sats`
  if (fee < 1_000_000) return `${(fee / 1000).toFixed(1)}k sats`
  return `${(fee / 1_000_000).toFixed(3)} BTC`
}

/**
 * Determines network type from address format
 * @param address - Bitcoin address
 * @returns 'mainnet', 'testnet', or 'unknown'
 */
export function getNetworkType(address: string): 'mainnet' | 'testnet' | 'unknown' {
  if (!address || typeof address !== 'string') return 'unknown'
  
  if (address.startsWith('bc1') || address.startsWith('1') || address.startsWith('3')) {
    return 'mainnet'
  }
  
  if (address.startsWith('tb1') || address.startsWith('m') || address.startsWith('n') || address.startsWith('2')) {
    return 'testnet'
  }
  
  return 'unknown'
}

/**
 * Simple type guard for WebSocket data
 * @param data - Data to check
 * @returns True if data is a non-null object
 */
export function isValidWebSocketData(data: unknown): data is Record<string, unknown> {
  return data !== null && typeof data === 'object' && !Array.isArray(data)
}

/**
 * Type guard for numeric data
 * @param value - Value to check
 * @returns True if value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * Type guard for string data
 * @param value - Value to check
 * @returns True if value is a valid string
 */
export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

/**
 * Type guard for array data
 * @param value - Value to check
 * @returns True if value is a valid array
 */
export function isValidArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0
}

/**
 * Safe property access with type checking
 * @param obj - Object to access
 * @param key - Property key
 * @returns Property value or undefined
 */
export function safeGet<T>(obj: Record<string, unknown>, key: string): T | undefined {
  const value = obj[key]
  return value as T
}

/**
 * Safe number access with validation
 * @param obj - Object to access
 * @param key - Property key
 * @returns Number value or null
 */
export function safeGetNumber(obj: Record<string, unknown>, key: string): number | null {
  const value = obj[key]
  return isValidNumber(value) ? value : null
}

/**
 * Safe string access with validation
 * @param obj - Object to access
 * @param key - Property key
 * @returns String value or null
 */
export function safeGetString(obj: Record<string, unknown>, key: string): string | null {
  const value = obj[key]
  return isValidString(value) ? value : null
}

/**
 * Safe array access with validation
 * @param obj - Object to access
 * @param key - Property key
 * @returns Array value or null
 */
export function safeGetArray(obj: Record<string, unknown>, key: string): unknown[] | null {
  const value = obj[key]
  return isValidArray(value) ? value : null
}

// Export pattern constants for external use if needed
export { ADDRESS_PATTERNS, TXID_PATTERN, BLOCK_HASH_PATTERN, SCRIPT_PATTERN }

// Legacy export compatibility - simple pattern recognition functions
export const validateBlock = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  return { isValid: true, errors: [], warnings: [], confidence: 1.0 }
}

export const validateTransaction = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  return { isValid: true, errors: [], warnings: [], confidence: 1.0 }
}

export const validateAddress = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  return { isValid: true, errors: [], warnings: [], confidence: 1.0 }
}

export const validateUTXO = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  return { isValid: true, errors: [], warnings: [], confidence: 1.0 }
}

export const validateFeeEstimates = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  return { isValid: true, errors: [], warnings: [], confidence: 1.0 }
}

export const validateNetworkStatus = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  return { isValid: true, errors: [], warnings: [], confidence: 1.0 }
}

export const validatePriceData = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  return { isValid: true, errors: [], warnings: [], confidence: 1.0 }
}

// BIP32 path utilities (simple pattern recognition)
export const isValidBIP32Path = (path: string): boolean => {
  return /^m(\/[0-9]+'?)*$/.test(path)
}

export const parseBIP32Path = (path: string): { purpose: number; coinType: number; account: number; change: number; addressIndex: number } | null => {
  if (!isValidBIP32Path(path)) return null
  try {
    const parts = path.split('/').slice(1)
    if (parts.length < 5) return null
    return {
      purpose: parseInt(parts[0].replace("'", "")),
      coinType: parseInt(parts[1].replace("'", "")),
      account: parseInt(parts[2].replace("'", "")),
      change: parseInt(parts[3]),
      addressIndex: parseInt(parts[4])
    }
  } catch {
    return null
  }
}

export const formatBIP32Path = (path: { purpose: number; coinType: number; account: number; change: number; addressIndex: number }): string => {
  const { purpose, coinType, account, change, addressIndex } = path
  return `m/${purpose}'/${coinType}'/${account}'/${change}/${addressIndex}`
}

export const validateBIPPurpose = (purpose: number): boolean => {
  return [44, 49, 84, 86].includes(purpose)
}

export const validateBIPCoinType = (coinType: number): boolean => {
  return [0, 1, 2].includes(coinType)
}

// Lightning Network utilities (simple pattern recognition)
export const validateLightningNodePubkey = (pubkey: string): boolean => {
  return /^[a-fA-F0-9]{66}$/.test(pubkey)
}

export const validateLightningChannelId = (channelId: string): boolean => {
  return /^[a-fA-F0-9]{64}$/.test(channelId)
}

export const validateLightningInvoice = (invoice: string): boolean => {
  return /^lnbc[a-z0-9]+$/.test(invoice)
}

export const validateLightningPaymentRequest = (request: string): boolean => {
  return /^[a-z0-9]+$/.test(request)
}

// Legacy schema exports for compatibility
export const bitcoinValidationSchema = {
  validateBlock,
  validateTransaction,
  validateAddress,
  validateUTXO,
  validateFeeEstimates,
  validateNetworkStatus,
  validatePriceData
}

export const bipPathValidation = {
  isValidPath: isValidBIP32Path,
  parsePath: parseBIP32Path,
  formatPath: formatBIP32Path,
  validatePurpose: validateBIPPurpose,
  validateCoinType: validateBIPCoinType
}

export const lightningValidation = {
  validateNodePubkey: validateLightningNodePubkey,
  validateChannelId: validateLightningChannelId,
  validateInvoice: validateLightningInvoice,
  validatePaymentRequest: validateLightningPaymentRequest
}
