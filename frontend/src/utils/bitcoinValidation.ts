/**
 * @fileoverview Bitcoin data validation utilities for the BlockSight.live application
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-19
 * @lastModified 2025-08-19
 * 
 * @description
 * Comprehensive validation utilities for Bitcoin blockchain data including
 * blocks, transactions, addresses, UTXOs, and network status. Implements validation schemas
 * defined in bitcoin types for runtime data integrity.
 * 
 * @dependencies
 * - TypeScript strict mode
 * - Bitcoin protocol specifications
 * - Bitcoin types and interfaces
 * - BIP standards validation
 * - Lightning Network validation
 * 
 * @usage
 * Provides runtime validation for all Bitcoin-related data structures
 * 
 * @state
 * 🔄 In Development - Core validation functions implemented
 * 
 * @bugs
 * - Need integration with runtime validation library (zod/joi)
 * - Address validation needs more comprehensive regex patterns
 * - Lightning validation needs real LN implementation testing
 * 
 * @todo
 * - [HIGH] Integrate with runtime validation library (zod/joi)
 * - [HIGH] Add comprehensive test suite for all validation functions
 * - [MEDIUM] Implement more sophisticated address validation patterns
 * - [MEDIUM] Add Lightning Network validation testing
 * - [LOW] Add performance optimization for bulk validation
 * - [LOW] Add validation result caching
 * 
 * @mockData
 * - No mock data - pure validation logic
 * 
 * @performance
 * - Efficient validation with early returns
 * - Optimized regex patterns
 * - Minimal memory allocation
 * 
 * @security
 * - Input sanitization and validation
 * - Safe regex patterns
 * - Type-safe validation results
 * 
 * @styling
 * - No styling needed (pure utility file)
 */

import {
  BitcoinValidationResult,
  BIP32Path,
  ScriptType,
  NetworkLoad,
  BlockStatus
} from '../types/bitcoin'

/**
 * Bitcoin address validation patterns
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
 * Bitcoin transaction ID validation pattern
 */
const TXID_PATTERN = /^[a-fA-F0-9]{64}$/

/**
 * Bitcoin block hash validation pattern
 */
const BLOCK_HASH_PATTERN = /^[a-fA-F0-9]{64}$/

/**
 * Bitcoin script validation patterns
 */
const SCRIPT_PATTERNS = {
  HEX: /^[a-fA-F0-9]*$/,
  ASM: /^[a-zA-Z0-9\s\(\)\[\]{}:;.,+\-*/<>=!&|~^%_]+$/
}

/**
 * BIP32 path validation pattern
 */
const BIP32_PATH_PATTERN = /^m(\/[0-9]+'?)*$/

/**
 * Lightning Network validation patterns
 */
const LIGHTNING_PATTERNS = {
  NODE_PUBKEY: /^[a-fA-F0-9]{66}$/,
  CHANNEL_ID: /^[a-fA-F0-9]{64}$/,
  INVOICE: /^lnbc[a-z0-9]+$/,
  PAYMENT_REQUEST: /^[a-z0-9]+$/
}

/**
 * Validation result factory
 */
function createValidationResult(
  isValid: boolean,
  errors: string[] = [],
  warnings: string[] = [],
  confidence: number = isValid ? 1.0 : 0.0
): BitcoinValidationResult {
  return { isValid, errors, warnings, confidence }
}

/**
 * Bitcoin block validation
 */
export function validateBlock(data: any): BitcoinValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Type check
  if (!data || typeof data !== 'object') {
    return createValidationResult(false, ['Data must be an object'])
  }

  // Required fields validation
  const requiredFields = ['hash', 'height', 'timestamp', 'size', 'weight', 'transactionCount']
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (errors.length > 0) {
    return createValidationResult(false, errors)
  }

  // Hash validation
  if (!BLOCK_HASH_PATTERN.test(data.hash)) {
    errors.push('Invalid block hash format')
  }

  // Height validation
  if (typeof data.height !== 'number' || data.height < 0 || !Number.isInteger(data.height)) {
    errors.push('Block height must be a non-negative integer')
  }

  // Timestamp validation
  if (typeof data.timestamp !== 'number' || data.timestamp < 0) {
    errors.push('Timestamp must be a non-negative number')
  }

  // Size and weight validation
  if (typeof data.size !== 'number' || data.size <= 0) {
    errors.push('Block size must be a positive number')
  }
  if (typeof data.weight !== 'number' || data.weight <= 0) {
    errors.push('Block weight must be a positive number')
  }

  // Transaction count validation
  if (typeof data.transactionCount !== 'number' || data.transactionCount < 0 || !Number.isInteger(data.transactionCount)) {
    errors.push('Transaction count must be a non-negative integer')
  }

  // Fee range validation
  if (data.feeRange && typeof data.feeRange === 'object') {
    const { min, max, average } = data.feeRange
    if (typeof min !== 'number' || min < 0) warnings.push('Fee range min should be non-negative')
    if (typeof max !== 'number' || max < 0) warnings.push('Fee range max should be non-negative')
    if (typeof average !== 'number' || average < 0) warnings.push('Fee range average should be non-negative')
    if (min > max) errors.push('Fee range min cannot be greater than max')
  }

  // Script type breakdown validation
  if (data.scriptTypeBreakdown && typeof data.scriptTypeBreakdown === 'object') {
    for (const [scriptType, count] of Object.entries(data.scriptTypeBreakdown)) {
      if (!Object.values(ScriptType).includes(scriptType as ScriptType)) {
        warnings.push(`Unknown script type: ${scriptType}`)
      }
      if (typeof count !== 'number' || count < 0) {
        warnings.push(`Invalid count for script type ${scriptType}`)
      }
    }
  }

  // Status validation
  if (data.status && !Object.values(BlockStatus).includes(data.status)) {
    warnings.push(`Unknown block status: ${data.status}`)
  }

  // Confirmations validation
  if (data.confirmations !== undefined) {
    if (typeof data.confirmations !== 'number' || data.confirmations < 0 || !Number.isInteger(data.confirmations)) {
      warnings.push('Confirmations must be a non-negative integer')
    }
  }

  // Previous hash validation
  if (data.previousHash && !BLOCK_HASH_PATTERN.test(data.previousHash)) {
    errors.push('Invalid previous hash format')
  }

  // Merkle root validation
  if (data.merkleRoot && !BLOCK_HASH_PATTERN.test(data.merkleRoot)) {
    errors.push('Invalid merkle root format')
  }

  // Difficulty validation
  if (data.difficulty !== undefined) {
    if (typeof data.difficulty !== 'number' || data.difficulty <= 0) {
      warnings.push('Difficulty must be a positive number')
    }
  }

  // Nonce validation
  if (data.nonce !== undefined) {
    if (typeof data.nonce !== 'number' || data.nonce < 0 || !Number.isInteger(data.nonce)) {
      warnings.push('Nonce must be a non-negative integer')
    }
  }

  // Bits validation
  if (data.bits && typeof data.bits !== 'string') {
    warnings.push('Bits should be a string')
  }

  // Version validation
  if (data.version !== undefined) {
    if (typeof data.version !== 'number' || !Number.isInteger(data.version)) {
      warnings.push('Version must be an integer')
    }
  }

  const confidence = errors.length === 0 ? (warnings.length === 0 ? 1.0 : 0.8) : 0.0
  return createValidationResult(errors.length === 0, errors, warnings, confidence)
}

/**
 * Bitcoin transaction validation
 */
export function validateTransaction(data: any): BitcoinValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Type check
  if (!data || typeof data !== 'object') {
    return createValidationResult(false, ['Data must be an object'])
  }

  // Required fields validation
  const requiredFields = ['txid', 'timestamp', 'size', 'weight', 'fee', 'feeRate', 'inputs', 'outputs']
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (errors.length > 0) {
    return createValidationResult(false, errors)
  }

  // TXID validation
  if (!TXID_PATTERN.test(data.txid)) {
    errors.push('Invalid transaction ID format')
  }

  // Block hash validation (if present)
  if (data.blockHash && !BLOCK_HASH_PATTERN.test(data.blockHash)) {
    errors.push('Invalid block hash format')
  }

  // Block height validation (if present)
  if (data.blockHeight !== undefined) {
    if (typeof data.blockHeight !== 'number' || data.blockHeight < 0 || !Number.isInteger(data.blockHeight)) {
      warnings.push('Block height must be a non-negative integer')
    }
  }

  // Timestamp validation
  if (typeof data.timestamp !== 'number' || data.timestamp < 0) {
    errors.push('Timestamp must be a non-negative number')
  }

  // Confirmations validation
  if (data.confirmations !== undefined) {
    if (typeof data.confirmations !== 'number' || data.confirmations < 0 || !Number.isInteger(data.confirmations)) {
      warnings.push('Confirmations must be a non-negative integer')
    }
  }

  // Size and weight validation
  if (typeof data.size !== 'number' || data.size <= 0) {
    errors.push('Transaction size must be a positive number')
  }
  if (typeof data.weight !== 'number' || data.weight <= 0) {
    errors.push('Transaction weight must be a positive number')
  }

  // Fee validation
  if (typeof data.fee !== 'number' || data.fee < 0) {
    errors.push('Fee must be a non-negative number')
  }

  // Fee rate validation
  if (typeof data.feeRate !== 'number' || data.feeRate < 0) {
    errors.push('Fee rate must be a non-negative number')
  }

  // Inputs validation
  if (!Array.isArray(data.inputs) || data.inputs.length === 0) {
    errors.push('Transaction must have at least one input')
  } else {
    for (let i = 0; i < data.inputs.length; i++) {
      const input = data.inputs[i]
      if (!input || typeof input !== 'object') {
        errors.push(`Input ${i} must be an object`)
        continue
      }
      
      if (!input.txid || !TXID_PATTERN.test(input.txid)) {
        errors.push(`Input ${i} has invalid TXID`)
      }
      
      if (typeof input.vout !== 'number' || input.vout < 0 || !Number.isInteger(input.vout)) {
        errors.push(`Input ${i} vout must be a non-negative integer`)
      }
      
      if (typeof input.value !== 'number' || input.value < 0) {
        errors.push(`Input ${i} value must be a non-negative number`)
      }
    }
  }

  // Outputs validation
  if (!Array.isArray(data.outputs) || data.outputs.length === 0) {
    errors.push('Transaction must have at least one output')
  } else {
    for (let i = 0; i < data.outputs.length; i++) {
      const output = data.outputs[i]
      if (!output || typeof output !== 'object') {
        errors.push(`Output ${i} must be an object`)
        continue
      }
      
      if (typeof output.value !== 'number' || output.value < 0) {
        errors.push(`Output ${i} value must be a non-negative number`)
      }
      
      if (typeof output.n !== 'number' || output.n < 0 || !Number.isInteger(output.n)) {
        errors.push(`Output ${i} n must be a non-negative integer`)
      }
    }
  }

  // Boolean fields validation
  if (data.isRBF !== undefined && typeof data.isRBF !== 'boolean') {
    warnings.push('isRBF must be a boolean')
  }
  
  if (data.isCoinbase !== undefined && typeof data.isCoinbase !== 'boolean') {
    warnings.push('isCoinbase must be a boolean')
  }

  // Locktime validation
  if (data.locktime !== undefined) {
    if (typeof data.locktime !== 'number' || data.locktime < 0 || !Number.isInteger(data.locktime)) {
      warnings.push('Locktime must be a non-negative integer')
    }
  }

  // Version validation
  if (data.version !== undefined) {
    if (typeof data.version !== 'number' || !Number.isInteger(data.version)) {
      warnings.push('Version must be an integer')
    }
  }

  const confidence = errors.length === 0 ? (warnings.length === 0 ? 1.0 : 0.8) : 0.0
  return createValidationResult(errors.length === 0, errors, warnings, confidence)
}

/**
 * Bitcoin address validation
 */
export function validateAddress(data: any): BitcoinValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Type check
  if (!data || typeof data !== 'object') {
    return createValidationResult(false, ['Data must be an object'])
  }

  // Required fields validation
  const requiredFields = ['address', 'scriptType', 'balance', 'transactionCount']
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (errors.length > 0) {
    return createValidationResult(false, errors)
  }

  // Address format validation
  const address = data.address
  let isValidAddress = false
  
  for (const [type, pattern] of Object.entries(ADDRESS_PATTERNS)) {
    if (pattern.test(address)) {
      isValidAddress = true
      break
    }
  }
  
  if (!isValidAddress) {
    errors.push('Invalid Bitcoin address format')
  }

  // Script type validation
  if (!Object.values(ScriptType).includes(data.scriptType)) {
    errors.push('Invalid script type')
  }

  // Balance validation
  if (data.balance && typeof data.balance === 'object') {
    const { confirmed, unconfirmed, total } = data.balance
    if (typeof confirmed !== 'number' || confirmed < 0) {
      errors.push('Confirmed balance must be a non-negative number')
    }
    if (typeof unconfirmed !== 'number' || unconfirmed < 0) {
      errors.push('Unconfirmed balance must be a non-negative number')
    }
    if (typeof total !== 'number' || total < 0) {
      errors.push('Total balance must be a non-negative number')
    }
    
    // Validate total = confirmed + unconfirmed
    if (Math.abs(total - (confirmed + unconfirmed)) > 0.00000001) { // Allow for floating point precision
      warnings.push('Total balance should equal confirmed + unconfirmed')
    }
  }

  // Transaction count validation
  if (typeof data.transactionCount !== 'number' || data.transactionCount < 0 || !Number.isInteger(data.transactionCount)) {
    errors.push('Transaction count must be a non-negative integer')
  }

  // Received/Sent validation
  if (data.received !== undefined) {
    if (typeof data.received !== 'number' || data.received < 0) {
      warnings.push('Received amount must be a non-negative number')
    }
  }
  
  if (data.sent !== undefined) {
    if (typeof data.sent !== 'number' || data.sent < 0) {
      warnings.push('Sent amount must be a non-negative number')
    }
  }

  // Timestamp validation
  if (data.firstSeen !== undefined) {
    if (typeof data.firstSeen !== 'number' || data.firstSeen < 0) {
      warnings.push('First seen timestamp must be a non-negative number')
    }
  }
  
  if (data.lastSeen !== undefined) {
    if (typeof data.lastSeen !== 'number' || data.lastSeen < 0) {
      warnings.push('Last seen timestamp must be a non-negative number')
    }
  }

  // UTXO count validation
  if (data.utxoCount !== undefined) {
    if (typeof data.utxoCount !== 'number' || data.utxoCount < 0 || !Number.isInteger(data.utxoCount)) {
      warnings.push('UTXO count must be a non-negative integer')
    }
  }

  // Confidence validation
  if (data.confidence !== undefined) {
    if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 1) {
      warnings.push('Confidence must be between 0 and 1')
    }
  }

  const confidence = errors.length === 0 ? (warnings.length === 0 ? 1.0 : 0.8) : 0.0
  return createValidationResult(errors.length === 0, errors, warnings, confidence)
}

/**
 * Bitcoin UTXO validation
 */
export function validateUTXO(data: any): BitcoinValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Type check
  if (!data || typeof data !== 'object') {
    return createValidationResult(false, ['Data must be an object'])
  }

  // Required fields validation
  const requiredFields = ['txid', 'vout', 'value', 'scriptPubKey', 'confirmations', 'blockHeight', 'blockHash']
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (errors.length > 0) {
    return createValidationResult(false, errors)
  }

  // TXID validation
  if (!TXID_PATTERN.test(data.txid)) {
    errors.push('Invalid transaction ID format')
  }

  // Vout validation
  if (typeof data.vout !== 'number' || data.vout < 0 || !Number.isInteger(data.vout)) {
    errors.push('Vout must be a non-negative integer')
  }

  // Value validation
  if (typeof data.value !== 'number' || data.value <= 0) {
    errors.push('UTXO value must be a positive number')
  }

  // ScriptPubKey validation
  if (data.scriptPubKey && typeof data.scriptPubKey === 'object') {
    const { hex, type, addresses } = data.scriptPubKey
    
    if (hex && !SCRIPT_PATTERNS.HEX.test(hex)) {
      warnings.push('Invalid script hex format')
    }
    
    if (type && !Object.values(ScriptType).includes(type)) {
      warnings.push('Invalid script type')
    }
    
    if (addresses && Array.isArray(addresses)) {
      for (const address of addresses) {
        if (typeof address !== 'string') {
          warnings.push('Address in scriptPubKey must be a string')
        }
      }
    }
  }

  // Confirmations validation
  if (typeof data.confirmations !== 'number' || data.confirmations < 0 || !Number.isInteger(data.confirmations)) {
    errors.push('Confirmations must be a non-negative integer')
  }

  // Block height validation
  if (typeof data.blockHeight !== 'number' || data.blockHeight < 0 || !Number.isInteger(data.blockHeight)) {
    errors.push('Block height must be a non-negative integer')
  }

  // Block hash validation
  if (!BLOCK_HASH_PATTERN.test(data.blockHash)) {
    errors.push('Invalid block hash format')
  }

  // Boolean fields validation
  if (data.spendable !== undefined && typeof data.spendable !== 'boolean') {
    warnings.push('Spendable must be a boolean')
  }
  
  if (data.solvable !== undefined && typeof data.solvable !== 'boolean') {
    warnings.push('Solvable must be a boolean')
  }
  
  if (data.safe !== undefined && typeof data.safe !== 'boolean') {
    warnings.push('Safe must be a boolean')
  }

  const confidence = errors.length === 0 ? (warnings.length === 0 ? 1.0 : 0.8) : 0.0
  return createValidationResult(errors.length === 0, errors, warnings, confidence)
}

/**
 * Bitcoin fee estimates validation
 */
export function validateFeeEstimates(data: any): BitcoinValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Type check
  if (!data || typeof data !== 'object') {
    return createValidationResult(false, ['Data must be an object'])
  }

  // Required fields validation
  const requiredFields = ['fast', 'medium', 'slow', 'timestamp']
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (errors.length > 0) {
    return createValidationResult(false, errors)
  }

  // Fee validation
  if (typeof data.fast !== 'number' || data.fast < 0) {
    errors.push('Fast fee must be a non-negative number')
  }
  
  if (typeof data.medium !== 'number' || data.medium < 0) {
    errors.push('Medium fee must be a non-negative number')
  }
  
  if (typeof data.slow !== 'number' || data.slow < 0) {
    errors.push('Slow fee must be a non-negative number')
  }

  // Fee hierarchy validation
  if (data.fast > data.medium) {
    warnings.push('Fast fee should be less than or equal to medium fee')
  }
  
  if (data.medium > data.slow) {
    warnings.push('Medium fee should be less than or equal to slow fee')
  }

  // Timestamp validation
  if (typeof data.timestamp !== 'number' || data.timestamp < 0) {
    errors.push('Timestamp must be a non-negative number')
  }

  // Mempool size validation
  if (data.mempoolSize !== undefined) {
    if (typeof data.mempoolSize !== 'number' || data.mempoolSize < 0) {
      warnings.push('Mempool size must be a non-negative number')
    }
  }

  // Pending count validation
  if (data.pendingCount !== undefined) {
    if (typeof data.pendingCount !== 'number' || data.pendingCount < 0 || !Number.isInteger(data.pendingCount)) {
      warnings.push('Pending count must be a non-negative integer')
    }
  }

  // Confirmation times validation
  if (data.confirmationTimes && typeof data.confirmationTimes === 'object') {
    const { fast, medium, slow } = data.confirmationTimes
    
    if (fast !== undefined) {
      if (typeof fast !== 'number' || fast < 0) {
        warnings.push('Fast confirmation time must be a non-negative number')
      }
    }
    
    if (medium !== undefined) {
      if (typeof medium !== 'number' || medium < 0) {
        warnings.push('Medium confirmation time must be a non-negative number')
      }
    }
    
    if (slow !== undefined) {
      if (typeof slow !== 'number' || slow < 0) {
        warnings.push('Slow confirmation time must be a non-negative number')
      }
    }
  }

  const confidence = errors.length === 0 ? (warnings.length === 0 ? 1.0 : 0.8) : 0.0
  return createValidationResult(errors.length === 0, errors, warnings, confidence)
}

/**
 * Bitcoin network status validation
 */
export function validateNetworkStatus(data: any): BitcoinValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Type check
  if (!data || typeof data !== 'object') {
    return createValidationResult(false, ['Data must be an object'])
  }

  // Required fields validation
  const requiredFields = ['load', 'pendingTransactions', 'mempoolSize', 'timestamp']
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (errors.length > 0) {
    return createValidationResult(false, errors)
  }

  // Load validation
  if (!Object.values(NetworkLoad).includes(data.load)) {
    errors.push('Invalid network load value')
  }

  // Pending transactions validation
  if (typeof data.pendingTransactions !== 'number' || data.pendingTransactions < 0 || !Number.isInteger(data.pendingTransactions)) {
    errors.push('Pending transactions must be a non-negative integer')
  }

  // Mempool size validation
  if (typeof data.mempoolSize !== 'number' || data.mempoolSize < 0) {
    errors.push('Mempool size must be a non-negative number')
  }

  // Timestamp validation
  if (typeof data.timestamp !== 'number' || data.timestamp < 0) {
    errors.push('Timestamp must be a non-negative number')
  }

  // Average block time validation
  if (data.averageBlockTime !== undefined) {
    if (typeof data.averageBlockTime !== 'number' || data.averageBlockTime <= 0) {
      warnings.push('Average block time must be a positive number')
    }
  }

  // Difficulty validation
  if (data.difficulty !== undefined) {
    if (typeof data.difficulty !== 'number' || data.difficulty <= 0) {
      warnings.push('Difficulty must be a positive number')
    }
  }

  // Hashrate validation
  if (data.hashrate !== undefined) {
    if (typeof data.hashrate !== 'number' || data.hashrate < 0) {
      warnings.push('Hashrate must be a non-negative number')
    }
  }

  // Last block time validation
  if (data.lastBlockTime !== undefined) {
    if (typeof data.lastBlockTime !== 'number' || data.lastBlockTime < 0) {
      warnings.push('Last block time must be a non-negative number')
    }
  }

  // Next difficulty adjustment validation
  if (data.nextDifficultyAdjustment !== undefined) {
    if (typeof data.nextDifficultyAdjustment !== 'number' || data.nextDifficultyAdjustment < 0) {
      warnings.push('Next difficulty adjustment must be a non-negative number')
    }
  }

  // SegWit adoption validation
  if (data.segwitAdoption !== undefined) {
    if (typeof data.segwitAdoption !== 'number' || data.segwitAdoption < 0 || data.segwitAdoption > 1) {
      warnings.push('SegWit adoption must be between 0 and 1')
    }
  }

  // RBF usage validation
  if (data.rbfUsage !== undefined) {
    if (typeof data.rbfUsage !== 'number' || data.rbfUsage < 0 || data.rbfUsage > 1) {
      warnings.push('RBF usage must be between 0 and 1')
    }
  }

  const confidence = errors.length === 0 ? (warnings.length === 0 ? 1.0 : 0.8) : 0.0
  return createValidationResult(errors.length === 0, errors, warnings, confidence)
}

/**
 * Bitcoin price data validation
 */
export function validatePriceData(data: any): BitcoinValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Type check
  if (!data || typeof data !== 'object') {
    return createValidationResult(false, ['Data must be an object'])
  }

  // Required fields validation
  const requiredFields = ['usd', 'timestamp']
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (errors.length > 0) {
    return createValidationResult(false, errors)
  }

  // USD price validation
  if (typeof data.usd !== 'number' || data.usd <= 0) {
    errors.push('USD price must be a positive number')
  }

  // Timestamp validation
  if (typeof data.timestamp !== 'number' || data.timestamp < 0) {
    errors.push('Timestamp must be a non-negative number')
  }

  // Currency validation (all should be positive numbers if present)
  const currencies = ['eur', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'cny', 'inr', 'brl', 'ars', 'ils']
  for (const currency of currencies) {
    if (data[currency] !== undefined) {
      if (typeof data[currency] !== 'number' || data[currency] <= 0) {
        warnings.push(`${currency.toUpperCase()} price must be a positive number`)
      }
    }
  }

  // Change validation (can be negative)
  if (data.change24h !== undefined) {
    if (typeof data.change24h !== 'number') {
      warnings.push('24h change must be a number')
    }
  }
  
  if (data.change7d !== undefined) {
    if (typeof data.change7d !== 'number') {
      warnings.push('7d change must be a number')
    }
  }
  
  if (data.change30d !== undefined) {
    if (typeof data.change30d !== 'number') {
      warnings.push('30d change must be a number')
    }
  }

  const confidence = errors.length === 0 ? (warnings.length === 0 ? 1.0 : 0.8) : 0.0
  return createValidationResult(errors.length === 0, errors, warnings, confidence)
}

/**
 * BIP32 path validation
 */
export function isValidBIP32Path(path: string): boolean {
  if (!BIP32_PATH_PATTERN.test(path)) {
    return false
  }
  
  // BIP32 paths must have at least 5 levels: m/purpose'/coin_type'/account'/change/address_index
  const parts = path.split('/')
  if (parts.length < 6) { // m + 5 levels
    return false
  }
  
  // First three levels must be hardened (have ')
  for (let i = 1; i <= 3; i++) {
    if (!parts[i].endsWith("'")) {
      return false
    }
  }
  
  return true
}

/**
 * Parse BIP32 path string into components
 */
export function parseBIP32Path(path: string): BIP32Path | null {
  if (!isValidBIP32Path(path)) {
    return null
  }

  const parts = path.split('/').slice(1) // Remove 'm' prefix
  if (parts.length < 5) {
    return null
  }

  try {
    const purpose = parseInt(parts[0].replace("'", ""))
    const coinType = parseInt(parts[1].replace("'", ""))
    const account = parseInt(parts[2].replace("'", ""))
    const change = parseInt(parts[3])
    const addressIndex = parseInt(parts[4])

    return { purpose, coinType, account, change, addressIndex }
  } catch {
    return null
  }
}

/**
 * Format BIP32 path components into string
 */
export function formatBIP32Path(path: BIP32Path): string {
  const { purpose, coinType, account, change, addressIndex } = path
  return `m/${purpose}'/${coinType}'/${account}'/${change}/${addressIndex}`
}

/**
 * Validate BIP purpose value
 */
export function validateBIPPurpose(purpose: number): boolean {
  return [44, 49, 84, 86].includes(purpose)
}

/**
 * Validate BIP coin type value
 */
export function validateBIPCoinType(coinType: number): boolean {
  return [0, 1, 2].includes(coinType) // 0=Bitcoin, 1=Testnet, 2=Regtest
}

/**
 * Lightning Network validation functions
 */
export function validateLightningNodePubkey(pubkey: string): boolean {
  return LIGHTNING_PATTERNS.NODE_PUBKEY.test(pubkey)
}

export function validateLightningChannelId(channelId: string): boolean {
  return LIGHTNING_PATTERNS.CHANNEL_ID.test(channelId)
}

export function validateLightningInvoice(invoice: string): boolean {
  return LIGHTNING_PATTERNS.INVOICE.test(invoice)
}

export function validateLightningPaymentRequest(request: string): boolean {
  return LIGHTNING_PATTERNS.PAYMENT_REQUEST.test(request)
}

/**
 * Export validation schema interface implementation
 */
export const bitcoinValidationSchema = {
  validateBlock,
  validateTransaction,
  validateAddress,
  validateUTXO,
  validateFeeEstimates,
  validateNetworkStatus,
  validatePriceData
}

/**
 * Export BIP path validation interface implementation
 */
export const bipPathValidation = {
  isValidPath: isValidBIP32Path,
  parsePath: parseBIP32Path,
  formatPath: formatBIP32Path,
  validatePurpose: validateBIPPurpose,
  validateCoinType: validateBIPCoinType
}

/**
 * Export Lightning validation interface implementation
 */
export const lightningValidation = {
  validateNodePubkey: validateLightningNodePubkey,
  validateChannelId: validateLightningChannelId,
  validateInvoice: validateLightningInvoice,
  validatePaymentRequest: validateLightningPaymentRequest
}
