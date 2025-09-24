import React, { useState, useEffect } from 'react'
import { Theme, applyTheme, getStoredTheme } from '~/lib/theme'

interface ThemeSwitcherProps {
  className?: string
  showLabels?: boolean
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '', showLabels = true }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setCurrentTheme(getStoredTheme())
  }, [])

  const themes: Array<{ value: Theme; label: string; icon: string; description: string }> = [
    {
      value: 'light',
      label: 'Light',
      icon: '☀️',
      description: 'Clean, professional light theme',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: '🌙',
      description: 'Dark theme for low-light viewing',
    },
    {
      value: 'high-contrast',
      label: 'High Contrast',
      icon: '⚫',
      description: 'High contrast for accessibility',
    },
  ]

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    setIsOpen(false)
  }

  const currentThemeConfig = themes.find((t) => t.value === currentTheme)

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary flex items-center gap-2 min-w-[140px] justify-start"
        aria-label="Change theme"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-base" aria-hidden="true">
          {currentThemeConfig?.icon}
        </span>
        {showLabels && <span className="flex-1 text-left">{currentThemeConfig?.label}</span>}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div
            className="absolute top-full mt-1 left-0 min-w-[240px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50 overflow-hidden"
            role="listbox"
            aria-label="Theme options"
          >
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                className={`w-full px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-start gap-3 ${
                  currentTheme === theme.value
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}
                role="option"
                aria-selected={currentTheme === theme.value}
              >
                <span className="text-lg mt-0.5" aria-hidden="true">
                  {theme.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">
                    {theme.label}
                    {currentTheme === theme.value && (
                      <span className="ml-2 text-xs opacity-75">(Current)</span>
                    )}
                  </div>
                  <div className="text-xs opacity-75 mt-0.5">{theme.description}</div>
                </div>
                {currentTheme === theme.value && (
                  <div className="text-primary-500 mt-1" aria-hidden="true">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}

            {/* Theme preview section */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-800/50">
              <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                Design System Preview
              </div>
              <div className="space-y-2">
                {/* Color swatches */}
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 bg-primary rounded-sm border border-neutral-200"
                    title="Primary"
                  />
                  <div
                    className="w-4 h-4 bg-flash-500 rounded-sm border border-neutral-200"
                    title="Flash"
                  />
                  <div
                    className="w-4 h-4 bg-verified-500 rounded-sm border border-neutral-200"
                    title="Verified"
                  />
                  <div
                    className="w-4 h-4 bg-ink-500 rounded-sm border border-neutral-200"
                    title="Ink"
                  />
                </div>

                {/* Sample UI elements */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="badge-verified">Verified</div>
                  <div className="badge-flash">Flash</div>
                  <div className="price-display">€120</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ThemeSwitcher

/**
 * Compact theme switcher for mobile or space-constrained areas
 */
export const CompactThemeSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light')

  useEffect(() => {
    setCurrentTheme(getStoredTheme())
  }, [])

  const themeIcons: Record<Theme, string> = {
    'light': '☀️',
    'dark': '🌙',
    'high-contrast': '⚫',
  }

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'high-contrast']
    const currentIndex = themes.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]

    setCurrentTheme(nextTheme)
    applyTheme(nextTheme)
  }

  return (
    <button
      onClick={cycleTheme}
      className={`btn btn-secondary p-2 w-10 h-10 ${className}`}
      aria-label={`Switch theme (current: ${currentTheme})`}
      title={`Current theme: ${currentTheme}. Click to cycle through themes.`}
    >
      <span className="text-base" aria-hidden="true">
        {themeIcons[currentTheme]}
      </span>
    </button>
  )
}
