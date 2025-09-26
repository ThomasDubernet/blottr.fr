import React, { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

interface MasonryGridProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  columnCount?: number
  gap?: number
  className?: string
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
  minColumnWidth?: number
}

export function MasonryGrid<T extends { id: string | number }>({
  items,
  renderItem,
  columnCount: fixedColumnCount,
  gap = 16,
  className,
  onLoadMore,
  hasMore = false,
  loading = false,
  minColumnWidth = 250,
}: MasonryGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState<T[][]>([])
  const [columnCount, setColumnCount] = useState(fixedColumnCount || 3)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Calculate optimal column count based on container width
  useEffect(() => {
    if (fixedColumnCount) return

    const updateColumnCount = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const calculatedColumns = Math.max(1, Math.floor(containerWidth / minColumnWidth))
      setColumnCount(calculatedColumns)
    }

    updateColumnCount()
    window.addEventListener('resize', updateColumnCount)
    return () => window.removeEventListener('resize', updateColumnCount)
  }, [fixedColumnCount, minColumnWidth])

  // Distribute items across columns
  useEffect(() => {
    const newColumns: T[][] = Array.from({ length: columnCount }, () => [])
    const columnHeights = new Array(columnCount).fill(0)

    items.forEach((item) => {
      // Find column with minimum height
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
      newColumns[shortestColumnIndex].push(item)

      // Estimate height increase (since we can't measure actual height here)
      // This is a rough estimation - in a real implementation, you might want
      // to measure actual rendered heights for better distribution
      columnHeights[shortestColumnIndex] += 200 + Math.random() * 100
    })

    setColumns(newColumns)
  }, [items, columnCount])

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!onLoadMore || !hasMore) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [onLoadMore, hasMore, loading])

  return (
    <div className={cn('w-full', className)}>
      <div ref={containerRef} className="flex" style={{ gap: `${gap}px` }}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
            {column.map((item, itemIndex) => (
              <div key={item.id} className="w-full">
                {renderItem(item, itemIndex)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      )}

      {/* Load more trigger */}
      {hasMore && !loading && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Chargement de plus d'éléments...</span>
        </div>
      )}

      {/* End of results */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Vous avez vu tous les résultats</p>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64A7.962 7.962 0 014 9c0-1.18.24-2.304.673-3.326A7.962 7.962 0 0112 3c2.34 0 4.29 1.009 5.674 2.64A7.962 7.962 0 0120 9c0 1.18-.24 2.304-.673 3.326z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
          <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
        </div>
      )}
    </div>
  )
}

// Hook for managing masonry grid state
export const useMasonryGrid = <T extends { id: string | number }>(
  initialItems: T[] = [],
  pageSize: number = 20
) => {
  const [items, setItems] = useState<T[]>(initialItems)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const loadMore = async (loadFunction?: (page: number, pageSize: number) => Promise<T[]>) => {
    if (loading || !hasMore || !loadFunction) return

    setLoading(true)
    try {
      const newItems = await loadFunction(page + 1, pageSize)

      if (newItems.length === 0) {
        setHasMore(false)
      } else {
        setItems((prev) => [...prev, ...newItems])
        setPage((prev) => prev + 1)

        if (newItems.length < pageSize) {
          setHasMore(false)
        }
      }
    } catch (error) {
      console.error('Error loading more items:', error)
    } finally {
      setLoading(false)
    }
  }

  const reset = (newItems: T[] = []) => {
    setItems(newItems)
    setPage(1)
    setHasMore(true)
    setLoading(false)
  }

  return {
    items,
    loading,
    hasMore,
    loadMore,
    reset,
    setItems,
  }
}

export type { MasonryGridProps }
