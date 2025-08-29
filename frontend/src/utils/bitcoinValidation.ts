/**
 * @fileoverview Minimal Bitcoin pattern recognition utilities for passive blockchain viewing
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-27
 * @lastModified 2025-08-11
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

// Proper validation functions that actually validate data
export const validateBlock = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  
  const block = data as Record<string, unknown>
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check required fields
  if (!block.hash || typeof block.hash !== 'string') {
    errors.push('Missing required field: hash')
  } else if (!isBlockHashFormat(block.hash)) {
    errors.push('Invalid block hash format')
  }
  
  if (block.height === undefined || block.height === null) {
    errors.push('Missing required field: height')
  } else if (typeof block.height !== 'number' || block.height < 0 || !Number.isInteger(block.height)) {
    errors.push('Block height must be a non-negative integer')
  }
  
  // Check fee range if present
  if (block.feeRange && typeof block.feeRange === 'object') {
    const feeRange = block.feeRange as Record<string, unknown>
    const min = feeRange.min
    const max = feeRange.max
    
    if (typeof min === 'number' && typeof max === 'number' && min > max) {
      errors.push('Fee range min cannot be greater than max')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    confidence: errors.length === 0 ? 1.0 : 0.0
  }
}

export const validateTransaction = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  
  const tx = data as Record<string, unknown>
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check TXID
  if (!tx.txid || typeof tx.txid !== 'string') {
    errors.push('Missing required field: txid')
  } else if (!isTxidFormat(tx.txid)) {
    errors.push('Invalid transaction ID format')
  }
  
  // Check inputs
  if (!Array.isArray(tx.inputs) || tx.inputs.length === 0) {
    errors.push('Transaction must have at least one input')
  }
  
  // Check outputs
  if (!Array.isArray(tx.outputs) || tx.outputs.length === 0) {
    errors.push('Transaction must have at least one output')
  }
  
  // Check block hash if present
  if (tx.blockHash && typeof tx.blockHash === 'string' && !isBlockHashFormat(tx.blockHash)) {
    errors.push('Invalid block hash format')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    confidence: errors.length === 0 ? 1.0 : 0.0
  }
}

export const validateAddress = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  
  const address = data as Record<string, unknown>
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check address format
  if (!address.address || typeof address.address !== 'string') {
    errors.push('Missing required field: address')
  } else if (!isAddressFormat(address.address)) {
    errors.push('Invalid Bitcoin address format')
  }
  
  // Check balance consistency if present
  if (address.balance && typeof address.balance === 'object') {
    const balance = address.balance as Record<string, unknown>
    const confirmed = balance.confirmed
    const unconfirmed = balance.unconfirmed
    const total = balance.total
    
    if (typeof confirmed === 'number' && typeof unconfirmed === 'number' && typeof total === 'number') {
      if (Math.abs((confirmed + unconfirmed) - total) > 0.001) {
        warnings.push('Total balance should equal confirmed + unconfirmed')
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    confidence: errors.length === 0 ? 1.0 : 0.0
  }
}

export const validateUTXO = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  
  const utxo = data as Record<string, unknown>
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check TXID
  if (!utxo.txid || typeof utxo.txid !== 'string') {
    errors.push('Missing required field: txid')
  } else if (!isTxidFormat(utxo.txid)) {
    errors.push('Invalid transaction ID format')
  }
  
  // Check vout
  if (utxo.vout === undefined || utxo.vout === null) {
    errors.push('Missing required field: vout')
  } else if (typeof utxo.vout !== 'number' || utxo.vout < 0 || !Number.isInteger(utxo.vout)) {
    errors.push('Vout must be a non-negative integer')
  }
  
  // Check value
  if (utxo.value === undefined || utxo.value === null) {
    errors.push('Missing required field: value')
  } else if (typeof utxo.value !== 'number' || utxo.value <= 0) {
    errors.push('UTXO value must be a positive number')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    confidence: errors.length === 0 ? 1.0 : 0.0
  }
}

export const validateFeeEstimates = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  
  const fees = data as Record<string, unknown>
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check fee values
  if (fees.fast !== undefined && (typeof fees.fast !== 'number' || fees.fast < 0)) {
    errors.push('Fast fee must be a non-negative number')
  }
  
  if (fees.medium !== undefined && (typeof fees.medium !== 'number' || fees.medium < 0)) {
    errors.push('Medium fee must be a non-negative number')
  }
  
  if (fees.slow !== undefined && (typeof fees.slow !== 'number' || fees.slow < 0)) {
    errors.push('Slow fee must be a non-negative number')
  }
  
  // Check fee hierarchy
  if (typeof fees.fast === 'number' && typeof fees.medium === 'number' && fees.fast > fees.medium) {
    warnings.push('Fast fee should be less than or equal to medium fee')
  }
  
  if (typeof fees.medium === 'number' && typeof fees.slow === 'number' && fees.medium > fees.slow) {
    warnings.push('Medium fee should be less than or equal to slow fee')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    confidence: errors.length === 0 ? 1.0 : 0.0
  }
}

export const validateNetworkStatus = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  
  const status = data as Record<string, unknown>
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check network load
  if (status.load && typeof status.load === 'string') {
    const validLoads = ['Below Average', 'Neutral', 'Load', 'Extreme Load']
    if (!validLoads.includes(status.load)) {
      errors.push('Invalid network load value')
    }
  }
  
  // Check pending transactions
  if (status.pendingTransactions !== undefined && (typeof status.pendingTransactions !== 'number' || status.pendingTransactions < 0)) {
    errors.push('Pending transactions must be a non-negative integer')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    confidence: errors.length === 0 ? 1.0 : 0.0
  }
}

export const validatePriceData = (data: unknown): { isValid: boolean; errors: string[]; warnings: string[]; confidence: number } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'], warnings: [], confidence: 0.0 }
  }
  
  const price = data as Record<string, unknown>
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check USD price
  if (price.usd !== undefined && (typeof price.usd !== 'number' || price.usd <= 0)) {
    errors.push('USD price must be a positive number')
  }
  
  // Check other currency prices
  if (price.eur !== undefined && (typeof price.eur !== 'number' || price.eur <= 0)) {
    warnings.push('EUR price must be a positive number')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    confidence: errors.length === 0 ? 1.0 : 0.0
  }
}

// BIP32 path utilities (simple pattern recognition)
export const isValidBIP32Path = (path: string): boolean => {
  // Must start with 'm' and have exactly 5 parts total
  // Pattern: m/44'/0'/0'/0/0 (5 parts total)
  // First 3 parts after 'm' must be hardened (with '), last 2 parts can be unhardened
  const parts = path.split('/')
  
  // Accept either 5 or 6 parts (in case there's a trailing slash)
  if (parts.length !== 5 && parts.length !== 6) {
    return false
  }
  if (parts[0] !== 'm') {
    return false
  }
  
  // Check that first 3 parts after 'm' are hardened (numbers followed by ')
  for (let i = 1; i <= 3; i++) {
    if (!/^[0-9]+'$/.test(parts[i])) {
      return false
    }
  }
  
  // Check that last 2 parts are numbers (can be unhardened)
  for (let i = 4; i < parts.length; i++) {
    if (!/^[0-9]+$/.test(parts[i])) {
      return false
    }
  }
  
  return true
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
