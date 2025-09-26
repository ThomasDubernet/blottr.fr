import { useCallback } from 'react'

export interface ShareableItem {
  id: string
  type: 'artist' | 'tattoo'
  title: string
  description?: string
  imageUrl?: string
  url?: string
}

interface ShareOptions {
  title: string
  text: string
  url: string
}

export function useSocialShare() {
  const generateShareUrl = useCallback((item: ShareableItem) => {
    const baseUrl = window.location.origin
    const path = item.type === 'artist' ? `/artists/${item.id}` : `/tattoos/${item.id}`
    return `${baseUrl}${path}`
  }, [])

  const generateShareText = useCallback((item: ShareableItem) => {
    switch (item.type) {
      case 'artist':
        return `Découvrez le travail incroyable de ${item.title} sur Blottr ! ${item.description || 'Un artiste tatoueur talentueux à découvrir.'}`
      case 'tattoo':
        return `Regardez ce magnifique tatouage "${item.title}" sur Blottr ! Trouvez l'inspiration pour votre prochain tatouage.`
      default:
        return `Découvrez ${item.title} sur Blottr - La plateforme de découverte de tatouages !`
    }
  }, [])

  const shareViaWebShare = useCallback(
    async (item: ShareableItem): Promise<boolean> => {
      if (!navigator.share) {
        return false
      }

      try {
        const shareOptions: ShareOptions = {
          title: `${item.title} | Blottr`,
          text: generateShareText(item),
          url: item.url || generateShareUrl(item),
        }

        await navigator.share(shareOptions)
        return true
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
        return false
      }
    },
    [generateShareUrl, generateShareText]
  )

  const shareViaFacebook = useCallback(
    (item: ShareableItem) => {
      const url = encodeURIComponent(item.url || generateShareUrl(item))
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
      window.open(shareUrl, '_blank', 'width=600,height=400')
    },
    [generateShareUrl]
  )

  const shareViaTwitter = useCallback(
    (item: ShareableItem) => {
      const text = encodeURIComponent(generateShareText(item))
      const url = encodeURIComponent(item.url || generateShareUrl(item))
      const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=blottr,tatouage,inspiration`
      window.open(shareUrl, '_blank', 'width=600,height=400')
    },
    [generateShareUrl, generateShareText]
  )

  const shareViaLinkedIn = useCallback(
    (item: ShareableItem) => {
      const url = encodeURIComponent(item.url || generateShareUrl(item))
      const title = encodeURIComponent(`${item.title} | Blottr`)
      const summary = encodeURIComponent(generateShareText(item))
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`
      window.open(shareUrl, '_blank', 'width=600,height=400')
    },
    [generateShareUrl, generateShareText]
  )

  const shareViaWhatsApp = useCallback(
    (item: ShareableItem) => {
      const text = encodeURIComponent(
        `${generateShareText(item)} ${item.url || generateShareUrl(item)}`
      )
      const shareUrl = `https://wa.me/?text=${text}`
      window.open(shareUrl, '_blank')
    },
    [generateShareUrl, generateShareText]
  )

  const shareViaTelegram = useCallback(
    (item: ShareableItem) => {
      const text = encodeURIComponent(generateShareText(item))
      const url = encodeURIComponent(item.url || generateShareUrl(item))
      const shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
      window.open(shareUrl, '_blank')
    },
    [generateShareUrl, generateShareText]
  )

  const copyToClipboard = useCallback(
    async (item: ShareableItem): Promise<boolean> => {
      try {
        const url = item.url || generateShareUrl(item)
        await navigator.clipboard.writeText(url)
        return true
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        return false
      }
    },
    [generateShareUrl]
  )

  const shareViaEmail = useCallback(
    (item: ShareableItem) => {
      const subject = encodeURIComponent(`Découvrez ${item.title} sur Blottr`)
      const body = encodeURIComponent(
        `${generateShareText(item)}\n\nVoir plus : ${item.url || generateShareUrl(item)}\n\nBlottr - Trouvez votre artiste tatoueur idéal`
      )
      const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
      window.location.href = mailtoUrl
    },
    [generateShareUrl, generateShareText]
  )

  const isWebShareSupported = useCallback(() => {
    return typeof navigator !== 'undefined' && 'share' in navigator
  }, [])

  const generateMetaTags = useCallback(
    (item: ShareableItem) => {
      const url = item.url || generateShareUrl(item)
      const title = `${item.title} | Blottr`
      const description = generateShareText(item)
      const imageUrl = item.imageUrl || `${window.location.origin}/og-image.jpg`

      return {
        // Open Graph
        'og:type': 'website',
        'og:title': title,
        'og:description': description,
        'og:url': url,
        'og:image': imageUrl,
        'og:site_name': 'Blottr',

        // Twitter Card
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': imageUrl,
        'twitter:site': '@blottr_fr',

        // General Meta
        'description': description,
        'image': imageUrl,
      }
    },
    [generateShareUrl, generateShareText]
  )

  return {
    shareViaWebShare,
    shareViaFacebook,
    shareViaTwitter,
    shareViaLinkedIn,
    shareViaWhatsApp,
    shareViaTelegram,
    shareViaEmail,
    copyToClipboard,
    isWebShareSupported,
    generateShareUrl,
    generateShareText,
    generateMetaTags,
  }
}
