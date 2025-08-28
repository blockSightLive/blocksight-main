/**
 * @fileoverview Theme Context - Dynamic theme switching for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-19
 * @lastModified 2025-08-23
 * 
 * @description
 * React context for managing dynamic theme switching between light, and dark themes.
 * Uses CSS Custom Properties for efficient theme switching without page reloads.
 * 
 * @dependencies
 * - React Context API
 * - CSS Custom Properties from design-tokens.css
 * - Local storage for theme persistence
 * 
 * @usage
 * Wrap app with ThemeProvider and use useTheme hook for theme switching
 * 
 * @state
 * ✅ Functional - Complete theme switching system
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Add system theme detection
 * - [MEDIUM] Implement theme transition animations
 * - [LOW] Add theme-specific component overrides
 * 
 * @styling
 * - CSS Custom Properties: Dynamic theme switching
 * - CSS Animations: Theme transition effects
 * - CSS Themes: Multiple theme support
 * 
 * @performance
 * - Efficient theme switching with CSS variables
 * - Local storage persistence
 * - No page reloads required
 * 
 * @security
 * - Safe theme switching only
 * - Local storage validation
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// ========================================
//   THEME TYPES & INTERFACES
// ========================================

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLight: boolean;
  isDark: boolean;
}

// ========================================
//   THEME CONTEXT CREATION
// ========================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ========================================
//   THEME PROVIDER COMPONENT
// ========================================

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'dark' 
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // ========================================
  //   THEME SWITCHING LOGIC
  // ========================================

  const setTheme = (newTheme: Theme) => {
    // Update state
    setThemeState(newTheme);
    
    // Update document attribute for CSS selectors
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Store in local storage
    try {
      localStorage.setItem('blocksight-theme', newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
  };

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // ========================================
  //   THEME INITIALIZATION
  // ========================================

  useEffect(() => {
    // Try to load theme from localStorage
    try {
      const savedTheme = localStorage.getItem('blocksight-theme') as Theme;
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        setTheme(savedTheme);
      } else {
        // Set default theme
        setTheme(defaultTheme);
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      setTheme(defaultTheme);
    }
  }, [defaultTheme]);

  // ========================================
  //   THEME EFFECTS
  // ========================================

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Add theme-specific body class for additional styling
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .trim();
    document.body.classList.add(`theme-${theme}`);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const themeColors = {
        light: '#f8fafc',  // neutral-50
        dark: '#0f172a'    // neutral-900
      };
      metaThemeColor.setAttribute('content', themeColors[theme]);
    }
  }, [theme]);

  // ========================================
  //   THEME VALIDATION
  // ========================================

  const validateTheme = (themeToValidate: string): themeToValidate is Theme => {
    return ['light', 'dark'].includes(themeToValidate);
  };

  // ========================================
  //   CONTEXT VALUE
  // ========================================

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isLight: theme === 'light',
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// ========================================
//   THEME HOOK
// ========================================

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// ========================================
//   THEME UTILITIES
// ========================================

export const getThemeColor = (theme: Theme, colorType: 'background' | 'text' | 'accent'): string => {
  const themeColors = {
    light: {
      background: 'var(--color-neutral-50)',
      text: 'var(--color-neutral-900)',
      accent: 'var(--color-bitcoin-600)'
    },
    dark: {
      background: 'var(--color-neutral-900)',
      text: 'var(--color-neutral-50)',
      accent: 'var(--color-bitcoin-400)'
    }
  };
  
  return themeColors[theme][colorType];
};

export const getThemeGradient = (theme: Theme): string => {
  const gradients = {
    light: 'var(--gradient-light)',
    dark: 'var(--gradient-dark)'
  };
  
  return gradients[theme];
};

// ========================================
//   THEME COMPONENT WRAPPERS
// ========================================

export const withTheme = <P extends object>(
  Component: React.ComponentType<P & { theme: Theme }>
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const { theme } = useTheme();
    const componentProps = { ...props, theme } as P & { theme: Theme };
    return <Component {...componentProps} ref={ref} />;
  });
};

// ========================================
//   THEME SWITCHER COMPONENT
// ========================================

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="theme-switcher flex items-center gap-2">
      <button
        onClick={() => setTheme('light')}
        className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
        aria-label="Switch to Light theme"
      >
        ☀️
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
        aria-label="Switch to Dark theme"
      >
        🌙
      </button>
      
      <button
        onClick={toggleTheme}
        className="btn btn-ghost btn-sm"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        🔄
      </button>
    </div>
  );
};

// ========================================
//   THEME INITIALIZER
// ========================================

export const initializeTheme = (): void => {
  // Set default theme if none exists
  if (!document.documentElement.hasAttribute('data-theme')) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  // Add theme class to body
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  document.body.classList.add(`theme-${currentTheme}`);
};

// ========================================
//   EXPORT DEFAULT
// ========================================

export default ThemeContext;
