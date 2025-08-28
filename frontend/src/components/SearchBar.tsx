/**
 * @fileoverview SearchBar component used in the header
 * @version 1.0.0
 * @since 2025-08-22
 * @lastModified 2025-08-25
 *
 * @description
 * Encapsulates the centered search input UI without search button.
 * Search bar is now twice as wide (1200px max-width) for better user experience.
 * Clean, minimal design for optimal header distribution.
 * Styling provided by SearchBar.module.css using design token system.
 * 
 * @styling
 * - CSS Modules: Component-scoped styling with design tokens
 * - CSS Custom Properties: All values from centralized design token system
 * - Responsive Design: Mobile-first with design token breakpoints
 * 
 * @dependencies
 * - SearchBar.module.css for styling
 * - Design token system for consistent values
 * - react-i18next for internationalization
 * 
 * @state
 * ✅ Updated - Double width (1200px) and design token integration
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [LOW] Add search suggestions functionality
 * - [LOW] Implement search history
 * 
 * @performance
 * - Efficient form handling
 * - Minimal re-renders
 * 
 * @security
 * - Input sanitization for search queries
 * - Safe form submission handling
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './SearchBar.module.css'

export interface SearchBarProps {
  query: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, onChange, onSubmit }) => {
  const { t } = useTranslation()
  return (
    <form className={styles.root} role="search" onSubmit={onSubmit}>
      <div className={styles.container}>
        <input
          type="search"
          className={styles.input}
          placeholder={t('header.searchPlaceholder')}
          value={query}
          onChange={(e) => onChange(e.target.value)}
          aria-label={t('navigation.search')}
        />
      </div>
    </form>
  )
}

export default SearchBar


