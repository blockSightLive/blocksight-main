/**
 * @fileoverview Bitcoin Network Load Gauge component for network congestion display
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * 
 * @description
 * Component that provides Bitcoin network load gauge with congestion level analysis,
 * pending transaction count, and confirmation time estimation. Implements the Bitcoin
 * Network Load Gauge MVP feature from the roadmap.
 * 
 * @dependencies
 * - Bitcoin network status
 * - Network load analysis
 * - Confirmation time estimation
 * 
 * @usage
 * Displays Bitcoin network congestion and load information
 * 
 * @state
 * 🔄 In Development - Basic network load display with mock data
 * 
 * @bugs
 * - No real-time network updates
 * - Mock network data used for development
 * 
 * @todo
 * - [HIGH] Implement real-time network load updates from Bitcoin API
 * - [HIGH] Add congestion analysis with visual indicators
 * - [HIGH] Add confirmation time estimation with charts
 * - [MEDIUM] Add network history and trends
 * - [MEDIUM] Implement network alerts and notifications
 * - [LOW] Add network comparison with historical data
 * 
 * @mockData
 * - Network status: Currently using mock BitcoinNetworkStatus objects (integrate with Electrum API)
 * - Load indicators: Static NetworkLoad enum values (implement real-time calculation)
 * - Pending transactions: Static count values (integrate with real mempool data)
 * - Mempool size: Static transaction count (integrate with real mempool data)
 * - Refresh functionality: Placeholder refresh button (implement real API calls)
 * 
 * @performance
 * - Efficient network updates
 * - Fast load analysis
 * 
 * @security
 * - Safe network display
 * - Data validation
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { BitcoinNetworkStatus, NetworkLoad } from '../../types/bitcoin'
import styles from './BitcoinNetworkLoadGauge.module.css'

interface BitcoinNetworkLoadGaugeProps {
  networkStatus: BitcoinNetworkStatus | null
  onRefresh: () => void
}

export const BitcoinNetworkLoadGauge: React.FC<BitcoinNetworkLoadGaugeProps> = ({
  networkStatus,
  onRefresh
}) => {
  const { t } = useTranslation()
  if (!networkStatus) {
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
        <h3>{t('bitcoin.network.load')}</h3>
        <button onClick={onRefresh} className={styles.refreshBtn} aria-label={t('common.refresh')}>
          ↻
        </button>
      </div>

      <div className={styles.load}>
        <div>
          <span>{
            (networkStatus.load === NetworkLoad.BELOW_AVERAGE && t('bitcoin.network.healthy')) ||
            (networkStatus.load === NetworkLoad.NEUTRAL && t('bitcoin.network.moderate')) ||
            (networkStatus.load === NetworkLoad.LOAD && t('bitcoin.network.high')) ||
            (networkStatus.load === NetworkLoad.EXTREME_LOAD && t('bitcoin.network.extreme')) ||
            t('bitcoin.network.load')
          }</span>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.label}>{t('bitcoin.network.unconfirmedTransactions')}:</span>
          <span className={styles.value}>{networkStatus.pendingTransactions?.toLocaleString() || 'N/A'}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.label}>{t('bitcoin.fees.mempoolSize')}:</span>
          <span className={styles.value}>{networkStatus.mempoolSize.toLocaleString()} tx</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.label}>{t('bitcoin.network.averageBlockTime')}:</span>
          <span className={styles.value}>{networkStatus.averageBlockTime.toFixed(1)} min</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.label}>{t('bitcoin.network.difficulty')}:</span>
          <span className={styles.value}>{networkStatus.difficulty?.toLocaleString() || 'N/A'}</span>
        </div>
      </div>

      <div className={styles.timestamp}>
        {t('bitcoin.price.lastUpdated')}: {networkStatus.lastUpdated ? new Date(networkStatus.lastUpdated).toLocaleTimeString() : 'N/A'}
      </div>
    </div>
  )
}
