import { useState, useCallback } from 'react'

/**
 * Custom hook for boolean toggle state
 */
export function useToggle(
  initialState: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [state, setState] = useState<boolean>(initialState)

  const toggle = useCallback(() => setState((prev) => !prev), [])

  const set = useCallback((value: boolean) => setState(value), [])

  return [state, toggle, set]
}
