import React, { useState, useCallback, useRef, useEffect } from 'react'
import { router } from '@inertiajs/react'

interface UploadedFile {
  id: string
  file: File
  preview: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  tattoo_id?: string
}

interface TattooData {
  description?: string
  is_flash: boolean
  price?: number
  tags: string[]
}

interface PortfolioUploaderProps {
  artistId: string
  existingTattoos?: Array<{
    id: string
    photo?: string
    alt_text?: string
    description?: string
    is_flash: boolean
    price?: number
    tags?: Array<{ name: string }>
  }>
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
  onUploadComplete?: (uploadedFiles: UploadedFile[]) => void
  onError?: (error: string) => void
}

const DEFAULT_ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const DEFAULT_MAX_SIZE = 10 // MB

export default function PortfolioUploader({
  artistId,
  existingTattoos = [],
  maxFiles = 10,
  maxFileSize = DEFAULT_MAX_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  className = '',
  onUploadComplete,
  onError,
}: PortfolioUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate unique ID for files
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Handle file validation
  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use: ${acceptedTypes.join(', ')}`
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`
    }

    return null
  }

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  // Process selected files
  const handleFiles = (fileList: FileList) => {
    const remainingSlots = maxFiles - files.length
    const filesToProcess = Array.from(fileList).slice(0, remainingSlots)

    const newFiles: UploadedFile[] = filesToProcess
      .map((file) => {
        const error = validateFile(file)
        if (error) {
          if (onError) onError(error)
          return null
        }

        return {
          id: generateId(),
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: 'pending' as const,
        }
      })
      .filter(Boolean) as UploadedFile[]

    setFiles((prev) => [...prev, ...newFiles])
  }

  // Remove file
  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((f) => f.id !== fileId)
    })
  }

  // Update tattoo metadata
  const updateTattooData = (fileId: string, data: Partial<TattooData>) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, tattooData: { ...file.tattooData, ...data } } : file
      )
    )
  }

  // Upload single file
  const uploadFile = async (fileData: UploadedFile): Promise<void> => {
    const formData = new FormData()
    formData.append('photo', fileData.file)
    formData.append('artist_id', artistId)

    if (fileData.tattooData) {
      formData.append('description', fileData.tattooData.description || '')
      formData.append('is_flash', String(fileData.tattooData.is_flash))
      if (fileData.tattooData.price) {
        formData.append('price', String(fileData.tattooData.price))
      }
      formData.append('tags', JSON.stringify(fileData.tattooData.tags))
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100)
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileData.id ? { ...f, progress: percentComplete, status: 'uploading' } : f
            )
          )
        }
      })

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText)
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileData.id ? { ...f, status: 'success', tattoo_id: response.id } : f
            )
          )
          resolve()
        } else {
          const error = xhr.responseText || 'Upload failed'
          setFiles((prev) =>
            prev.map((f) => (f.id === fileData.id ? { ...f, status: 'error', error } : f))
          )
          reject(new Error(error))
        }
      }

      xhr.onerror = () => {
        const error = 'Network error during upload'
        setFiles((prev) =>
          prev.map((f) => (f.id === fileData.id ? { ...f, status: 'error', error } : f))
        )
        reject(new Error(error))
      }

      xhr.open('POST', '/api/tattoos', true)
      xhr.send(formData)
    })
  }

  // Upload all files
  const uploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending')
    if (pendingFiles.length === 0) return

    setUploading(true)

    try {
      await Promise.all(pendingFiles.map((file) => uploadFile(file)))

      const successfulUploads = files.filter((f) => f.status === 'success')
      if (onUploadComplete) {
        onUploadComplete(successfulUploads)
      }
    } catch (error) {
      if (onError) {
        onError('Some uploads failed. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [])

  const pendingCount = files.filter((f) => f.status === 'pending').length
  const canUpload = pendingCount > 0 && !uploading

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200
          ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-400'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => files.length < maxFiles && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          className="sr-only"
          disabled={files.length >= maxFiles}
        />

        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {acceptedTypes
                .map((type) => type.split('/')[1])
                .join(', ')
                .toUpperCase()}{' '}
              up to {maxFileSize}MB
            </p>
            <p className="text-xs text-gray-500">
              {files.length} of {maxFiles} files selected
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Uploaded Files ({files.length})</h3>

            {canUpload && (
              <button
                type="button"
                onClick={uploadAll}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Upload All ({pendingCount})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onRemove={() => removeFile(file.id)}
                onUpdateData={(data) => updateTattooData(file.id, data)}
                onSelect={() => setSelectedFile(file.id === selectedFile ? null : file.id)}
                isSelected={selectedFile === file.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Existing Tattoos */}
      {existingTattoos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Existing Portfolio ({existingTattoos.length})
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingTattoos.map((tattoo) => (
              <ExistingTattooCard key={tattoo.id} tattoo={tattoo} />
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 text-blue-600 mr-3"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm text-blue-800">Uploading your tattoos...</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Individual file card component
interface FileCardProps {
  file: UploadedFile
  onRemove: () => void
  onUpdateData: (data: Partial<TattooData>) => void
  onSelect: () => void
  isSelected: boolean
}

function FileCard({ file, onRemove, onUpdateData, onSelect, isSelected }: FileCardProps) {
  const [tattooData, setTattooData] = useState<TattooData>({
    description: '',
    is_flash: false,
    tags: [],
  })

  const [tagInput, setTagInput] = useState('')

  const handleDataChange = (field: keyof TattooData, value: any) => {
    const newData = { ...tattooData, [field]: value }
    setTattooData(newData)
    onUpdateData(newData)
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tattooData.tags.includes(tagInput.trim())) {
      handleDataChange('tags', [...tattooData.tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    handleDataChange(
      'tags',
      tattooData.tags.filter((tag) => tag !== tagToRemove)
    )
  }

  const getStatusColor = () => {
    switch (file.status) {
      case 'pending':
        return 'border-gray-300'
      case 'uploading':
        return 'border-blue-500'
      case 'success':
        return 'border-green-500'
      case 'error':
        return 'border-red-500'
      default:
        return 'border-gray-300'
    }
  }

  const getStatusIcon = () => {
    switch (file.status) {
      case 'pending':
        return (
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case 'uploading':
        return (
          <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )
    }
  }

  return (
    <div
      className={`border-2 rounded-lg p-4 ${getStatusColor()} ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
    >
      {/* Image Preview */}
      <div className="relative aspect-square mb-3">
        <img
          src={file.preview}
          alt="Tattoo preview"
          className="w-full h-full object-cover rounded-md cursor-pointer"
          onClick={onSelect}
        />

        {/* Status Indicator */}
        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
          {getStatusIcon()}
        </div>

        {/* Progress Bar */}
        {file.status === 'uploading' && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 rounded-b-md p-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${file.progress}%` }}
              />
            </div>
            <p className="text-xs text-white mt-1">{file.progress}%</p>
          </div>
        )}

        {/* Remove Button */}
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
          aria-label="Remove file"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* File Info */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-900 truncate">{file.file.name}</p>
        <p className="text-xs text-gray-500">{(file.file.size / (1024 * 1024)).toFixed(1)} MB</p>

        {file.status === 'error' && file.error && (
          <p className="text-xs text-red-600">{file.error}</p>
        )}
      </div>

      {/* Metadata Form (expanded when selected) */}
      {isSelected && file.status === 'pending' && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={2}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe this tattoo..."
              value={tattooData.description}
              onChange={(e) => handleDataChange('description', e.target.value)}
            />
          </div>

          {/* Flash Tattoo */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`flash-${file.id}`}
              checked={tattooData.is_flash}
              onChange={(e) => handleDataChange('is_flash', e.target.checked)}
              className="h-3 w-3 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor={`flash-${file.id}`} className="ml-2 text-xs text-gray-700">
              Flash tattoo
            </label>
          </div>

          {/* Price (if flash) */}
          {tattooData.is_flash && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                value={tattooData.price || ''}
                onChange={(e) => handleDataChange('price', parseFloat(e.target.value) || undefined)}
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {tattooData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-2 py-1 text-sm bg-primary-600 text-white rounded-r hover:bg-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Existing tattoo card component
interface ExistingTattooCardProps {
  tattoo: {
    id: string
    photo?: string
    alt_text?: string
    description?: string
    is_flash: boolean
    price?: number
    tags?: Array<{ name: string }>
  }
}

function ExistingTattooCard({ tattoo }: ExistingTattooCardProps) {
  return (
    <div className="group relative aspect-square border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      {tattoo.photo ? (
        <img
          src={tattoo.photo}
          alt={tattoo.alt_text || 'Existing tattoo'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200">
        <div className="absolute inset-0 p-2 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Badges */}
          <div className="flex justify-end">
            {tattoo.is_flash && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800 border border-warning-200">
                Flash{tattoo.price && ` $${tattoo.price}`}
              </span>
            )}
          </div>

          {/* Description */}
          {tattoo.description && (
            <div className="bg-black bg-opacity-60 rounded p-2">
              <p className="text-white text-xs line-clamp-2">{tattoo.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
