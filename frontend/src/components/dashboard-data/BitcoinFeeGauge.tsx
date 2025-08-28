/**
 * @fileoverview Bitcoin Fee Gauge component for real-time fee estimation
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * 
 * @description
 * Component that provides Bitcoin fee gauge with real-time sats/vB recommendations,
 * memory pool analysis, and confirmation time estimation. Implements the Bitcoin
 * Fee Gauge MVP feature from the roadmap.
 * 
 * @dependencies
 * - Bitcoin fee estimates
 * - Memory pool data
 * - Confirmation time estimation
 * 
 * @usage
 * Displays real-time Bitcoin fee recommendations and estimates
 * 
 * @state
 * 🔄 In Development - Basic fee display with mock data
 * 
 * @bugs
 * - No real-time fee updates
 * - Mock fee data used for development
 * 
 * @todo
 * - [HIGH] Implement real-time fee updates from Bitcoin API
 * - [HIGH] Add memory pool analysis and visualization
 * - [HIGH] Add confirmation time estimation with charts
 * - [MEDIUM] Add fee history and trends
 * - [MEDIUM] Implement fee alerts and notifications
 * - [LOW] Add fee comparison with historical data
 * 
 * @mockData
 * - Fee estimates: Currently using mock BitcoinFeeEstimates objects (integrate with Electrum API)
 * - Confirmation times: Static minute values (implement real-time calculation)
 * - Mempool size: Static transaction count (integrate with real mempool data)
 * - Refresh functionality: Placeholder refresh button (implement real API calls)
 * - Loading states: Basic loading text (add proper loading spinners)
 * 
 * @performance
 * - Efficient fee updates
 * - Fast calculations
 * 
 * @security
 * - Safe fee display
 * - Data validation
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { BitcoinFeeEstimates } from '../../types/bitcoin'
import styles from './BitcoinFeeGauge.module.css'

interface BitcoinFeeGaugeProps {
  feeEstimates: BitcoinFeeEstimates | null
  onRefresh: () => void
}

export const BitcoinFeeGauge: React.FC<BitcoinFeeGaugeProps> = ({
  feeEstimates,
  onRefresh
}) => {
  const { t } = useTranslation()
  if (!feeEstimates) {
    return (
      <div className={`${styles.root} ${styles.loading}`}>
        <p>{t('loading.fetching')}</p>
        <button onClick={onRefresh} className={styles.refreshBtn}>
          {t('common.refresh')}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h3>{t('bitcoin.fees.title')}</h3>
        <button onClick={onRefresh} className={styles.refreshBtn} aria-label={t('common.refresh')}>
          ↻
        </button>
      </div>

      <div className={styles.estimates}>
        <div className={styles.feeItem}>
          <div className={styles.label}>{t('bitcoin.fees.fast')}</div>
          <div className={styles.value}>{feeEstimates.fast} {t('bitcoin.fees.satPerVByte')}</div>
          <div className={styles.time}>{feeEstimates.confirmationTimes?.fast || 'N/A'} {t('common.minutesShort')}</div>
        </div>

        <div className={styles.feeItem}>
          <div className={styles.label}>{t('bitcoin.fees.medium')}</div>
          <div className={styles.value}>{feeEstimates.medium} {t('bitcoin.fees.satPerVByte')}</div>
          <div className={styles.time}>{feeEstimates.confirmationTimes?.medium || 'N/A'} {t('common.minutesShort')}</div>
        </div>

        <div className={styles.feeItem}>
          <div className={styles.label}>{t('bitcoin.fees.slow')}</div>
          <div className={styles.value}>{feeEstimates.slow} {t('bitcoin.fees.satPerVByte')}</div>
          <div className={styles.time}>{feeEstimates.confirmationTimes?.slow || 'N/A'} {t('common.minutesShort')}</div>
        </div>
      </div>

      <div className={styles.mempool}>
        <div className={styles.mempoolItem}>
          <span className={styles.label}>{t('bitcoin.fees.mempoolSize')}:</span>
          <span className={styles.value}>{feeEstimates.mempoolSize?.toLocaleString() || 'N/A'} tx</span>
        </div>
        <div className={styles.mempoolItem}>
          <span className={styles.label}>{t('bitcoin.fees.pendingTransactions')}:</span>
          <span className={styles.value}>{feeEstimates.pendingCount?.toLocaleString() || 'N/A'}</span>
        </div>
      </div>

      <div className={styles.timestamp}>
        {t('bitcoin.price.lastUpdated')}: {feeEstimates.timestamp ? new Date(feeEstimates.timestamp).toLocaleTimeString() : 'N/A'}
      </div>
    </div>
  )
}
