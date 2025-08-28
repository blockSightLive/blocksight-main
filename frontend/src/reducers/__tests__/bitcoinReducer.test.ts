/**
 * @fileoverview Tests for Bitcoin reducer basic functionality
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-19
 * @lastModified 2025-08-19
 * 
 * @description
 * Basic tests for the simplified Bitcoin reducer to ensure core functionality works
 * 
 * @dependencies
 * - frontend/src/reducers/bitcoinReducer.ts
 * - frontend/src/types/bitcoin.ts
 * 
 * @state
 * ✅ Functional - Basic test coverage for core reducer actions
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Add more comprehensive test cases
 * - [MEDIUM] Test edge cases and error conditions
 * - [LOW] Add performance tests
 * 
 * @mockData
 * - Uses simple mock Bitcoin data for testing
 * - All test data is simplified for basic functionality verification
 * - Replace with more realistic data as features are added
 * 
 * @styling
 * - No styling needed (pure test file)
 * 
 * @performance
 * - Basic test execution
 * - No performance benchmarks yet
 * 
 * @security
 * - No security concerns for test files
 */

import { bitcoinReducer, initialState, bitcoinActions, bitcoinSelectors } from '../bitcoinReducer';
import { BitcoinBlock, BitcoinTransaction, BitcoinAddress, BlockStatus, ScriptType } from '../../types/bitcoin';

// ============================================================================
// TEST DATA
// ============================================================================

const mockBlock: BitcoinBlock = {
  hash: '0000000000000000001234567890abcdef1234567890abcdef1234567890abcdef',
  height: 800001,
  timestamp: Date.now(),
  size: 1234567,
  weight: 1234567,
  transactionCount: 2000,
  feeRange: {
    min: 0.001,
    max: 0.01,
    average: 0.005
  },
  scriptTypeBreakdown: {
    P2PKH: 1000,
    P2SH: 500,
    P2WPKH: 400,
    P2WSH: 50,
    P2TR: 30,
    MULTISIG: 15,
    OP_RETURN: 5,
    UNKNOWN: 0
  },
  status: BlockStatus.CONFIRMED,
  confirmations: 1,
  previousHash: '0000000000000000001234567890abcdef1234567890abcdef1234567890abcdef',
  nextHash: '0000000000000000001234567890abcdef1234567890abcdef1234567890abcdef',
  merkleRoot: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  difficulty: 123456789.123,
  nonce: 123456789,
  bits: '1a123456',
  version: 1
};

const mockTransaction: BitcoinTransaction = {
  txid: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  blockHash: '0000000000000000001234567890abcdef1234567890abcdef1234567890abcdef',
  blockHeight: 800001,
  timestamp: Date.now(),
  confirmations: 1,
  size: 1234,
  weight: 1234,
  fee: 0.001,
  feeRate: 1.5,
  inputs: [
    {
      txid: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      vout: 0,
      sequence: 4294967295,
      scriptSig: {
        asm: 'OP_DUP OP_HASH160 1234567890abcdef1234567890abcdef12345678 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a9141234567890abcdef1234567890abcdef1234567888ac'
      },
      witness: [],
      value: 0.001,
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      scriptType: ScriptType.P2PKH
    }
  ],
  outputs: [
    {
      value: 0.0009,
      n: 0,
      scriptPubKey: {
        asm: 'OP_DUP OP_HASH160 1234567890abcdef1234567890abcdef12345678 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a9141234567890abcdef1234567890abcdef1234567888ac',
        type: ScriptType.P2PKH,
        addresses: ['bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh']
      },
      spent: false
    }
  ],
  isRBF: false,
  isCoinbase: false,
  locktime: 0,
  version: 1
};

const mockAddress: BitcoinAddress = {
  address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  scriptType: ScriptType.P2WPKH,
  balance: {
    total: 0.001,
    confirmed: 0.001,
    unconfirmed: 0
  },
  transactionCount: 1,
  received: 0.001,
  sent: 0,
  firstSeen: Date.now(),
  lastSeen: Date.now(),
  utxoCount: 1,
  confidence: 0.95
};

// ============================================================================
// TEST SUITES
// ============================================================================

describe('Bitcoin Reducer', () => {
  describe('Initial State', () => {
    it('should return initial state when no action is provided', () => {
      const result = bitcoinReducer(undefined, { type: 'UNKNOWN' } as any);
      expect(result).toEqual(initialState);
    });

    it('should return initial state when unknown action is provided', () => {
      const result = bitcoinReducer(initialState, { type: 'UNKNOWN' } as any);
      expect(result).toEqual(initialState);
    });
  });

  describe('Block Actions', () => {
    it('should handle SET_BLOCKS action', () => {
      const blocks = [mockBlock];
      const action = bitcoinActions.updateBlocks(blocks);
      const result = bitcoinReducer(initialState, action);

      expect(result.blocks).toEqual(blocks);
      expect(result.ui.error).toBeNull();
    });

    it('should handle ADD_BLOCK action', () => {
      const action = bitcoinActions.newBlock(mockBlock);
      const result = bitcoinReducer(initialState, action);

      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0]).toEqual(mockBlock);
      expect(result.ui.error).toBeNull();
    });

    it('should add multiple blocks correctly', () => {
      const block1 = { ...mockBlock, hash: 'block1', height: 800001 };
      const block2 = { ...mockBlock, hash: 'block2', height: 800002 };
      
      let state = bitcoinReducer(initialState, bitcoinActions.newBlock(block1));
      state = bitcoinReducer(state, bitcoinActions.newBlock(block2));

      expect(state.blocks).toHaveLength(2);
      expect(state.blocks[0]).toEqual(block2); // Newest first
      expect(state.blocks[1]).toEqual(block1);
    });
  });

  describe('Transaction Actions', () => {
    it('should handle SET_TRANSACTIONS action', () => {
      const transactions = [mockTransaction];
      const action = bitcoinActions.updateTransactions(transactions);
      const result = bitcoinReducer(initialState, action);

      expect(result.transactions).toEqual(transactions);
      expect(result.ui.error).toBeNull();
    });

    it('should handle ADD_TRANSACTION action', () => {
      const action = bitcoinActions.newTransaction(mockTransaction);
      const result = bitcoinReducer(initialState, action);

      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0]).toEqual(mockTransaction);
      expect(result.ui.error).toBeNull();
    });
  });

  describe('Address Actions', () => {
    it('should handle SET_ADDRESSES action', () => {
      const addresses = [mockAddress];
      const action = bitcoinActions.updateAddresses(addresses);
      const result = bitcoinReducer(initialState, action);

      expect(result.addresses).toEqual(addresses);
      expect(result.ui.error).toBeNull();
    });

    it('should handle ADD_ADDRESS action', () => {
      const action = bitcoinActions.newAddress(mockAddress);
      const result = bitcoinReducer(initialState, action);

      expect(result.addresses).toHaveLength(1);
      expect(result.addresses[0]).toEqual(mockAddress);
      expect(result.ui.error).toBeNull();
    });
  });

  describe('UI Actions', () => {
    it('should handle SET_LOADING action', () => {
      const action = bitcoinActions.setLoading(true);
      const result = bitcoinReducer(initialState, action);

      expect(result.ui.isLoading).toBe(true);
    });

    it('should handle SET_ERROR action', () => {
      const errorMessage = 'Test error message';
      const action = bitcoinActions.setError(errorMessage);
      const result = bitcoinReducer(initialState, action);

      expect(result.ui.error).toBe(errorMessage);
    });

    it('should handle CLEAR_ERROR action', () => {
      // First set an error
      let state = bitcoinReducer(initialState, bitcoinActions.setError('Test error'));
      expect(state.ui.error).toBe('Test error');

      // Then clear it
      state = bitcoinReducer(state, bitcoinActions.clearError());
      expect(state.ui.error).toBeNull();
    });
  });

  describe('Reset Action', () => {
    it('should handle RESET_STATE action', () => {
      // First add some data
      let state = bitcoinReducer(initialState, bitcoinActions.newBlock(mockBlock));
      state = bitcoinReducer(state, bitcoinActions.newTransaction(mockTransaction));
      state = bitcoinReducer(state, bitcoinActions.setLoading(true));
      state = bitcoinReducer(state, bitcoinActions.setError('Test error'));

      // Verify state has data
      expect(state.blocks).toHaveLength(1);
      expect(state.transactions).toHaveLength(1);
      expect(state.ui.isLoading).toBe(true);
      expect(state.ui.error).toBe('Test error');

      // Reset state
      const resetAction = bitcoinActions.resetState();
      const result = bitcoinReducer(state, resetAction);

      // Verify reset
      expect(result.blocks).toHaveLength(0);
      expect(result.transactions).toHaveLength(0);
      expect(result.ui.isLoading).toBe(false);
      expect(result.ui.error).toBeNull();
      expect(result.metrics.lastMetricsReset).toBeGreaterThan(initialState.metrics.lastMetricsReset);
    });
  });
});

describe('Bitcoin Selectors', () => {
  let state: any;

  beforeEach(() => {
    state = {
      ...initialState,
      blocks: [mockBlock],
      transactions: [mockTransaction],
      addresses: [mockAddress]
    };
  });

  describe('Block Selectors', () => {
    it('should get block by hash', () => {
      const result = bitcoinSelectors.getBlockByHash(state, mockBlock.hash);
      expect(result).toEqual(mockBlock);
    });

    it('should get latest blocks', () => {
      const result = bitcoinSelectors.getLatestBlocks(state, 5);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockBlock);
    });
  });

  describe('Transaction Selectors', () => {
    it('should get transaction by id', () => {
      const result = bitcoinSelectors.getTransactionById(state, mockTransaction.txid);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('Address Selectors', () => {
    it('should get address by hash', () => {
      const result = bitcoinSelectors.getAddressByHash(state, mockAddress.address);
      expect(result).toEqual(mockAddress);
    });
  });

  describe('UI Selectors', () => {
    it('should get loading state', () => {
      const result = bitcoinSelectors.getLoadingState(state);
      expect(result).toBe(false);
    });

    it('should get error state', () => {
      const result = bitcoinSelectors.getError(state);
      expect(result).toBeNull();
    });
  });
});
