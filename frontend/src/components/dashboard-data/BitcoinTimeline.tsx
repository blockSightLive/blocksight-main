/**
 * @fileoverview Bitcoin Timeline component for block timeline visualization
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * 
 * @description
 * Component that provides Bitcoin timeline with horizontal block timeline,
 * interval highlighting, and delay detection. Implements the Bitcoin
 * Timeline MVP feature from the roadmap.
 * 
 * @dependencies
 * - Bitcoin block data
 * - Timeline visualization
 * - Block interval analysis
 * 
 * @usage
 * Displays Bitcoin block timeline with interval analysis
 * 
 * @state
 * 🔄 In Development - Basic timeline display with mock data
 * 
 * @bugs
 * - No real-time block updates
 * - Mock block data used for development
 * 
 * @todo
 * - [HIGH] Implement real-time block timeline updates from Bitcoin API
 * - [HIGH] Add interval highlighting with color coding
 * - [HIGH] Add delay detection and alerts
 * - [MEDIUM] Add block visualization with details
 * - [MEDIUM] Implement timeline navigation and zoom
 * - [LOW] Add historical timeline analysis
 * 
 * @mockData
 * - Block data: Currently using mock BitcoinBlock objects (integrate with Electrum API)
 * - Timestamps: Static timestamp values (integrate with real blockchain data)
 * - Interval calculations: Basic interval logic (implement real-time analysis)
 * - Block heights: Static height values (integrate with real blockchain data)
 * - Timeline navigation: Basic block selection (implement advanced navigation)
 * 
 * @performance
 * - Efficient timeline rendering
 * - Fast interval analysis
 * 
 * @security
 * - Safe timeline display
 * - Data validation
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { BitcoinBlock } from '../../types/bitcoin'
import './BitcoinTimeline.css'

interface BitcoinTimelineProps {
  blocks: BitcoinBlock[]
  onBlockSelect: (block: BitcoinBlock) => void
}

export const BitcoinTimeline: React.FC<BitcoinTimelineProps> = ({
  blocks,
  onBlockSelect
}) => {
  const { t } = useTranslation()
  if (blocks.length === 0) {
    return (
      <div className="bitcoin-timeline bitcoin-timeline--empty">
        <p>{t('bitcoin.timeline.noBlocks')}</p>
      </div>
    )
  }

  const getIntervalColor = (timestamp: number, previousTimestamp: number) => {
    const interval = (timestamp - previousTimestamp) / 60 // Convert to minutes
    if (interval < 9) return 'light-green'
    if (interval < 11) return 'green'
    if (interval < 13) return 'yellow'
    if (interval < 16) return 'orange'
    return 'red'
  }

  return (
    <div className="bitcoin-timeline">
      <div className="timeline__header">
        <h3>{t('bitcoin.timeline.title')}</h3>
        <span className="timeline-count">{blocks.length} {t('bitcoin.timeline.blocksLabel')}</span>
      </div>

      <div className="timeline__container">
        {blocks.slice(0, 20).map((block, index) => {
          const previousBlock = index > 0 ? blocks[index - 1] : null
          const intervalColor = previousBlock 
            ? getIntervalColor(block.timestamp, previousBlock.timestamp)
            : 'default'

          return (
            <div
              key={block.hash}
              className={`timeline-block timeline-block--${intervalColor}`}
              onClick={() => onBlockSelect(block)}
            >
              <div className="block-icon">₿</div>
              <div className="block-info">
                <span className="block-height">#{block.height}</span>
                <span className="block-time">
                  {new Date(block.timestamp * 1000).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="timeline__legend">
        <div className="legend-item">
          <span className="legend-color legend-color--light-green"></span>
          <span className="legend-label">&lt; 9 {t('common.minutesShort')}</span>
        </div>
        <div className="legend-item">
          <span className="legend-color legend-color--green"></span>
          <span className="legend-label">9-11 {t('common.minutesShort')}</span>
        </div>
        <div className="legend-item">
          <span className="legend-color legend-color--yellow"></span>
          <span className="legend-label">11-13 {t('common.minutesShort')}</span>
        </div>
        <div className="legend-item">
          <span className="legend-color legend-color--orange"></span>
          <span className="legend-label">13-16 {t('common.minutesShort')}</span>
        </div>
        <div className="legend-item">
          <span className="legend-color legend-color--red"></span>
          <span className="legend-label">&gt; 16 {t('common.minutesShort')}</span>
        </div>
      </div>
    </div>
  )
}
