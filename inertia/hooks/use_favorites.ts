import { useState, useEffect, useCallback } from 'react'

export interface FavoriteItem {
  id: string
  type: 'artist' | 'tattoo'
  title: string
  imageUrl?: string
  artistName?: string
  location?: string
  addedAt: string
}

const FAVORITES_STORAGE_KEY = 'blottr_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as FavoriteItem[]
        setFavorites(parsed)
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error)
      }
    }
  }, [favorites, loading])

  const addToFavorites = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    setFavorites((prev) => {
      // Check if already exists
      if (prev.some((fav) => fav.id === item.id && fav.type === item.type)) {
        return prev
      }

      const newFavorite: FavoriteItem = {
        ...item,
        addedAt: new Date().toISOString(),
      }

      return [newFavorite, ...prev]
    })
  }, [])

  const removeFromFavorites = useCallback((id: string, type: 'artist' | 'tattoo') => {
    setFavorites((prev) => prev.filter((fav) => !(fav.id === id && fav.type === type)))
  }, [])

  const isFavorite = useCallback(
    (id: string, type: 'artist' | 'tattoo') => {
      return favorites.some((fav) => fav.id === id && fav.type === type)
    },
    [favorites]
  )

  const toggleFavorite = useCallback(
    (item: Omit<FavoriteItem, 'addedAt'>) => {
      if (isFavorite(item.id, item.type)) {
        removeFromFavorites(item.id, item.type)
        return false // Removed
      } else {
        addToFavorites(item)
        return true // Added
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  )

  const getFavoritesByType = useCallback(
    (type: 'artist' | 'tattoo') => {
      return favorites.filter((fav) => fav.type === type)
    },
    [favorites]
  )

  const clearAllFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  const getFavoritesCount = useCallback(() => {
    return {
      total: favorites.length,
      artists: favorites.filter((fav) => fav.type === 'artist').length,
      tattoos: favorites.filter((fav) => fav.type === 'tattoo').length,
    }
  }, [favorites])

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    getFavoritesByType,
    clearAllFavorites,
    getFavoritesCount,
  }
}
