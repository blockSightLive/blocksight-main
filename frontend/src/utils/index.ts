/**
 * @fileoverview Utils module exports for the BlockSight.live application
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-19
 * @lastModified 2025-08-19
 * 
 * @description
 * Central export file for all utility functions and modules
 * 
 * @dependencies
 * - All utility modules
 * 
 * @usage
 * Import utilities: import { validateBlock, validateTransaction } from '@/utils'
 * 
 * @state
 * 🔄 In Development - Core exports implemented
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Add more utility modules as they are created
 * - [LOW] Add utility function documentation
 * 
 * @mockData
 * - No mock data - pure exports
 * 
 * @performance
 * - Efficient module resolution
 * - Tree-shaking friendly
 * 
 * @security
 * - Safe exports
 * - No sensitive data
 * 
 * @styling
 * - No styling needed (pure export file)
 */

// Bitcoin validation utilities
export {
  validateBlock,
  validateTransaction,
  validateAddress,
  validateUTXO,
  validateFeeEstimates,
  validateNetworkStatus,
  validatePriceData,
  isValidBIP32Path,
  parseBIP32Path,
  formatBIP32Path,
  validateBIPPurpose,
  validateBIPCoinType,
  validateLightningNodePubkey,
  validateLightningChannelId,
  validateLightningInvoice,
  validateLightningPaymentRequest,
  bitcoinValidationSchema,
  bipPathValidation,
  lightningValidation
} from './bitcoinValidation'

// Re-export types for convenience
export type {
  BitcoinValidationResult,
  BIP32Path
} from '../types/bitcoin'
