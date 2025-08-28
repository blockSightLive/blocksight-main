/**
 * @fileoverview Search Results panel component for the dashboard left column
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-22
 * @lastModified 2025-08-22
 * 
 * @description
 * Lightweight, read-only panel that displays search results or helpful tips.
 * Designed to live inside the dashboard's left column. The actual search input
 * lives in the header; this component focuses on rendering results/empty state.
 * 
 * @styling
 * - Uses a co-located stylesheet `SearchResults.css` to avoid coupling with page CSS
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './SearchResults.module.css'

export interface SearchResultsProps {
  isLoading?: boolean
  hasError?: boolean
  // Placeholder for future results data structure
  resultsCount?: number
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  isLoading,
  hasError,
  resultsCount,
}) => {
  const { t } = useTranslation()

  if (hasError) {
    return (
      <div className={styles.root}>
        <p className={`${styles.message} ${styles.error}`}>
          {t('errors.general')}
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.root}>
        <p className={styles.message}>
          {t('loading.searching')}
        </p>
      </div>
    )
  }

  if (resultsCount && resultsCount > 0) {
    return (
      <div className={styles.root}>
        {/* Results list placeholder – will be wired to real data later */}
        <p className={styles.message}>
          {t('bitcoin.search.results.totalResults')}: {resultsCount}
        </p>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <p className={styles.placeholder}>
        {t('dashboard.leftPanel.placeholder')}
      </p>
    </div>
  )
}

export default SearchResults


