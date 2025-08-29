/**
 * @fileoverview Test suite for Bitcoin validation utilities
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-19
 * @lastModified 2025-08-11
 * 
 * @description
 * Comprehensive test suite for Bitcoin data validation utilities including
 * blocks, transactions, addresses, UTXOs, and network status validation.
 * 
 * @dependencies
 * - Jest testing framework
 * - Bitcoin validation utilities
 * - Bitcoin types and interfaces
 * 
 * @usage
 * Run with: npm test bitcoinValidation
 * 
 * @state
 * 🔄 In Development - Core test cases implemented
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [HIGH] Add more edge case test scenarios
 * - [HIGH] Add performance benchmarking tests
 * - [MEDIUM] Add integration tests with real Bitcoin data
 * - [LOW] Add stress tests for large datasets
 * 
 * @mockData
 * - Test fixtures for various Bitcoin data structures
 * - Mock data for edge cases and error conditions
 * 
 * @performance
 * - Fast test execution
 * - Minimal memory usage
 * - Efficient test data setup
 * 
 * @security
 * - Safe test data
 * - No real Bitcoin addresses or keys
 * - Isolated test environment
 * 
 * @styling
 * - No styling needed (pure test file)
 */

import {
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
  validateLightningPaymentRequest
} from '../bitcoinValidation'

import {
  ScriptType,
  NetworkLoad,
  BlockStatus,
  BIP32Path
} from '../../types/bitcoin'

// Test fixtures
const validBlock = {
  hash: '0000000000000000000000000000000000000000000000000000000000000000',
  height: 800000,
  timestamp: 1640995200,
  size: 1234567,
  weight: 2345678,
  transactionCount: 2500,
  feeRange: {
    min: 1,
    max: 100,
    average: 25
  },
  scriptTypeBreakdown: {
    [ScriptType.P2PKH]: 1000,
    [ScriptType.P2SH]: 800,
    [ScriptType.P2WPKH]: 500,
    [ScriptType.P2WSH]: 200
  },
  status: BlockStatus.CONFIRMED,
  confirmations: 6,
  previousHash: '1111111111111111111111111111111111111111111111111111111111111111',
  merkleRoot: '2222222222222222222222222222222222222222222222222222222222222222',
  difficulty: 123456789,
  nonce: 123456789,
  bits: '1700abcd',
  version: 1
}

const validTransaction = {
  txid: '3333333333333333333333333333333333333333333333333333333333333333',
  timestamp: 1640995200,
  size: 250,
  weight: 500,
  fee: 1000,
  feeRate: 4,
  inputs: [
    {
      txid: '4444444444444444444444444444444444444444444444444444444444444444',
      vout: 0,
      value: 1000000
    }
  ],
  outputs: [
    {
      value: 999000,
      n: 0
    }
  ]
}

const validAddress = {
  address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  scriptType: ScriptType.P2PKH,
  balance: {
    confirmed: 1000000,
    unconfirmed: 0,
    total: 1000000
  },
  transactionCount: 1
}

const validUTXO = {
  txid: '5555555555555555555555555555555555555555555555555555555555555555',
  vout: 0,
  value: 1000000,
  scriptPubKey: {
    asm: 'OP_DUP OP_HASH160 62e907b15cbf27d5425399ebf6f0fb50ebb88e18 OP_EQUALVERIFY OP_CHECKSIG',
    hex: '76a91462e907b15cbf27d5425399ebf6f0fb50ebb88e1888ac',
    type: ScriptType.P2PKH,
    addresses: ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa']
  },
  confirmations: 6,
  blockHeight: 800000,
  blockHash: '0000000000000000000000000000000000000000000000000000000000000000'
}

const validFeeEstimates = {
  fast: 10,
  medium: 25,
  slow: 50,
  timestamp: 1640995200
}

const validNetworkStatus = {
  load: NetworkLoad.NEUTRAL,
  pendingTransactions: 5000,
  mempoolSize: 1000000,
  timestamp: 1640995200
}

const validPriceData = {
  usd: 50000,
  timestamp: 1640995200
}

describe('Bitcoin Validation Utilities', () => {
  describe('validateBlock', () => {
    it('should validate a valid block', () => {
      const result = validateBlock(validBlock)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.confidence).toBe(1.0)
    })

    it('should reject invalid block hash', () => {
      const invalidBlock = { ...validBlock, hash: 'invalid-hash' }
      const result = validateBlock(invalidBlock)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid block hash format')
    })

    it('should reject negative block height', () => {
      const invalidBlock = { ...validBlock, height: -1 }
      const result = validateBlock(invalidBlock)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Block height must be a non-negative integer')
    })

    it('should reject missing required fields', () => {
      const invalidBlock = { hash: '0000000000000000000000000000000000000000000000000000000000000000' }
      const result = validateBlock(invalidBlock)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Missing required field: height')
    })

    it('should reject invalid fee range', () => {
      const invalidBlock = { 
        ...validBlock, 
        feeRange: { min: 100, max: 50, average: 75 } 
      }
      const result = validateBlock(invalidBlock)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Fee range min cannot be greater than max')
    })
  })

  describe('validateTransaction', () => {
    it('should validate a valid transaction', () => {
      const result = validateTransaction(validTransaction)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.confidence).toBe(1.0)
    })

    it('should reject invalid TXID', () => {
      const invalidTransaction = { ...validTransaction, txid: 'invalid-txid' }
      const result = validateTransaction(invalidTransaction)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid transaction ID format')
    })

    it('should reject transaction without inputs', () => {
      const invalidTransaction = { ...validTransaction, inputs: [] }
      const result = validateTransaction(invalidTransaction)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Transaction must have at least one input')
    })

    it('should reject transaction without outputs', () => {
      const invalidTransaction = { ...validTransaction, outputs: [] }
      const result = validateTransaction(invalidTransaction)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Transaction must have at least one output')
    })

    it('should validate block hash if present', () => {
      const transactionWithBlock = { 
        ...validTransaction, 
        blockHash: '6666666666666666666666666666666666666666666666666666666666666666' 
      }
      const result = validateTransaction(transactionWithBlock)
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateAddress', () => {
    it('should validate a valid P2PKH address', () => {
      const result = validateAddress(validAddress)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.confidence).toBe(1.0)
    })

    it('should validate a valid P2SH address', () => {
      const p2shAddress = { 
        ...validAddress, 
        address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
        scriptType: ScriptType.P2SH 
      }
      const result = validateAddress(p2shAddress)
      expect(result.isValid).toBe(true)
    })

    it('should validate a valid SegWit address', () => {
      const segwitAddress = { 
        ...validAddress, 
        address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
        scriptType: ScriptType.P2WPKH 
      }
      const result = validateAddress(segwitAddress)
      expect(result.isValid).toBe(true)
    })

    it('should reject invalid address format', () => {
      const invalidAddress = { ...validAddress, address: 'invalid-address' }
      const result = validateAddress(invalidAddress)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid Bitcoin address format')
    })

    it('should warn about balance mismatch', () => {
      const invalidAddress = { 
        ...validAddress, 
        balance: { confirmed: 1000000, unconfirmed: 0, total: 999999 } 
      }
      const result = validateAddress(invalidAddress)
      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('Total balance should equal confirmed + unconfirmed')
    })
  })

  describe('validateUTXO', () => {
    it('should validate a valid UTXO', () => {
      const result = validateUTXO(validUTXO)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.confidence).toBe(1.0)
    })

    it('should reject invalid TXID', () => {
      const invalidUTXO = { ...validUTXO, txid: 'invalid-txid' }
      const result = validateUTXO(invalidUTXO)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid transaction ID format')
    })

    it('should reject negative vout', () => {
      const invalidUTXO = { ...validUTXO, vout: -1 }
      const result = validateUTXO(invalidUTXO)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Vout must be a non-negative integer')
    })

    it('should reject zero value', () => {
      const invalidUTXO = { ...validUTXO, value: 0 }
      const result = validateUTXO(invalidUTXO)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('UTXO value must be a positive number')
    })
  })

  describe('validateFeeEstimates', () => {
    it('should validate valid fee estimates', () => {
      const result = validateFeeEstimates(validFeeEstimates)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.confidence).toBe(1.0)
    })

    it('should reject negative fees', () => {
      const invalidFees = { ...validFeeEstimates, fast: -1 }
      const result = validateFeeEstimates(invalidFees)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Fast fee must be a non-negative number')
    })

    it('should warn about fee hierarchy issues', () => {
      const invalidFees = { ...validFeeEstimates, fast: 100, medium: 50, slow: 75 }
      const result = validateFeeEstimates(invalidFees)
      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('Fast fee should be less than or equal to medium fee')
      // medium (50) is not greater than slow (75), so no warning for that
    })
  })

  describe('validateNetworkStatus', () => {
    it('should validate valid network status', () => {
      const result = validateNetworkStatus(validNetworkStatus)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.confidence).toBe(1.0)
    })

    it('should reject invalid network load', () => {
      const invalidStatus = { ...validNetworkStatus, load: 'Invalid Load' }
      const result = validateNetworkStatus(invalidStatus)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid network load value')
    })

    it('should reject negative pending transactions', () => {
      const invalidStatus = { ...validNetworkStatus, pendingTransactions: -1 }
      const result = validateNetworkStatus(invalidStatus)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Pending transactions must be a non-negative integer')
    })
  })

  describe('validatePriceData', () => {
    it('should validate valid price data', () => {
      const result = validatePriceData(validPriceData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.confidence).toBe(1.0)
    })

    it('should reject zero USD price', () => {
      const invalidPrice = { ...validPriceData, usd: 0 }
      const result = validatePriceData(invalidPrice)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('USD price must be a positive number')
    })

    it('should warn about invalid currency prices', () => {
      const invalidPrice = { ...validPriceData, eur: -1 }
      const result = validatePriceData(invalidPrice)
      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('EUR price must be a positive number')
    })
  })

  describe('BIP32 Path Validation', () => {
    it('should validate correct BIP32 paths', () => {
      expect(isValidBIP32Path('m/44\'/0\'/0\'/0/0')).toBe(true)
      expect(isValidBIP32Path('m/84\'/0\'/0\'/0/0')).toBe(true)
      expect(isValidBIP32Path('m/86\'/0\'/0\'/0/0')).toBe(true)
    })

    it('should reject invalid BIP32 paths', () => {
      expect(isValidBIP32Path('invalid-path')).toBe(false)
      expect(isValidBIP32Path('m/44/0/0/0/0')).toBe(false)
      expect(isValidBIP32Path('44\'/0\'/0\'/0/0')).toBe(false)
    })

    it('should parse valid BIP32 paths', () => {
      const path = parseBIP32Path('m/44\'/0\'/0\'/0/0')
      expect(path).toEqual({
        purpose: 44,
        coinType: 0,
        account: 0,
        change: 0,
        addressIndex: 0
      })
    })

    it('should format BIP32 path components', () => {
      const path: BIP32Path = {
        purpose: 84,
        coinType: 0,
        account: 0,
        change: 0,
        addressIndex: 0
      }
      expect(formatBIP32Path(path)).toBe('m/84\'/0\'/0\'/0/0')
    })

    it('should validate BIP purposes', () => {
      expect(validateBIPPurpose(44)).toBe(true)
      expect(validateBIPPurpose(84)).toBe(true)
      expect(validateBIPPurpose(86)).toBe(true)
      expect(validateBIPPurpose(42)).toBe(false)
    })

    it('should validate BIP coin types', () => {
      expect(validateBIPCoinType(0)).toBe(true)  // Bitcoin
      expect(validateBIPCoinType(1)).toBe(true)  // Testnet
      expect(validateBIPCoinType(2)).toBe(true)  // Regtest
      expect(validateBIPCoinType(3)).toBe(false)
    })
  })

  describe('Lightning Network Validation', () => {
    it('should validate Lightning node pubkeys', () => {
      const validPubkey = '02eec7245d6b7d2ccb30380bfbe2a3648cd7a942653f5aa340edcea1f283686619'
      expect(validateLightningNodePubkey(validPubkey)).toBe(true)
      expect(validateLightningNodePubkey('invalid-pubkey')).toBe(false)
    })

    it('should validate Lightning channel IDs', () => {
      const validChannelId = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      expect(validateLightningChannelId(validChannelId)).toBe(true)
      expect(validateLightningChannelId('invalid-channel')).toBe(false)
    })

    it('should validate Lightning invoices', () => {
      const validInvoice = 'lnbc1234567890abcdef'
      expect(validateLightningInvoice(validInvoice)).toBe(true)
      expect(validateLightningInvoice('invalid-invoice')).toBe(false)
    })

    it('should validate Lightning payment requests', () => {
      const validRequest = '1234567890abcdef'
      expect(validateLightningPaymentRequest(validRequest)).toBe(true)
      expect(validateLightningPaymentRequest('invalid-request')).toBe(false)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle null/undefined input gracefully', () => {
      expect(validateBlock(null).isValid).toBe(false)
      expect(validateBlock(undefined).isValid).toBe(false)
      expect(validateTransaction({}).isValid).toBe(false)
    })

    it('should handle empty objects appropriately', () => {
      const result = validateBlock({})
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Missing required field: hash')
    })

    it('should handle malformed data gracefully', () => {
      const malformedBlock = { hash: 123, height: 'invalid' }
      const result = validateBlock(malformedBlock)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('Performance and Memory', () => {
    it('should handle large datasets efficiently', () => {
      const largeBlock = {
        ...validBlock,
        scriptTypeBreakdown: Object.fromEntries(
          Object.values(ScriptType).map(type => [type, Math.floor(Math.random() * 1000)])
        )
      }
      
      const startTime = performance.now()
      const result = validateBlock(largeBlock)
      const endTime = performance.now()
      
      expect(result.isValid).toBe(true)
      expect(endTime - startTime).toBeLessThan(100) // Should complete in under 100ms
    })

    it('should not leak memory on repeated validation', () => {
      const initialMemory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0
      
      for (let i = 0; i < 1000; i++) {
        validateBlock(validBlock)
        validateTransaction(validTransaction)
        validateAddress(validAddress)
      }
      
      const finalMemory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be reasonable (less than 1MB)
      expect(memoryIncrease).toBeLessThan(1024 * 1024)
    })
  })
})
