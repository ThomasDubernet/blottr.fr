import React, { useState, useMemo, useCallback } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'

interface TimeSlot {
  id: string
  start_time: string
  end_time: string
  available: boolean
  price?: number
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  hasSlots: boolean
  availableSlots: number
}

interface BookingCalendarProps {
  artistId: string
  availableSlots: Record<string, TimeSlot[]> // Date string (YYYY-MM-DD) -> TimeSlots
  selectedDate?: Date
  selectedTimeSlot?: TimeSlot
  onDateSelect: (date: Date) => void
  onTimeSlotSelect: (timeSlot: TimeSlot) => void
  onBookingConfirm: (date: Date, timeSlot: TimeSlot) => void
  minDate?: Date
  maxDate?: Date
  excludeDates?: Date[]
  workingDays?: number[] // 0 = Sunday, 1 = Monday, etc.
  className?: string
  loading?: boolean
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default function BookingCalendar({
  artistId,
  availableSlots,
  selectedDate,
  selectedTimeSlot,
  onDateSelect,
  onTimeSlotSelect,
  onBookingConfirm,
  minDate = new Date(),
  maxDate,
  excludeDates = [],
  workingDays = [1, 2, 3, 4, 5, 6], // Default: Monday to Saturday
  className = '',
  loading = false,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())
  const [view, setView] = useState<'calendar' | 'times'>('calendar')

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days: CalendarDay[] = []
    let day = startDate

    while (day <= endDate) {
      const dateKey = format(day, 'yyyy-MM-dd')
      const daySlots = availableSlots[dateKey] || []
      const availableSlots_count = daySlots.filter((slot) => slot.available).length

      days.push({
        date: day,
        isCurrentMonth: isSameMonth(day, monthStart),
        isToday: isToday(day),
        isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
        hasSlots: daySlots.length > 0,
        availableSlots: availableSlots_count,
      })

      day = addDays(day, 1)
    }

    return days
  }, [currentMonth, availableSlots, selectedDate])

  // Get available time slots for selected date
  const dayTimeSlots = useMemo(() => {
    if (!selectedDate) return []
    const dateKey = format(selectedDate, 'yyyy-MM-dd')
    return availableSlots[dateKey] || []
  }, [selectedDate, availableSlots])

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1))
  }, [])

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1))
  }, [])

  const handleDateClick = useCallback(
    (date: Date) => {
      // Check if date is valid for booking
      const dayOfWeek = date.getDay()
      const isWorkingDay = workingDays.includes(dayOfWeek)
      const isExcluded = excludeDates.some((excludeDate) => isSameDay(date, excludeDate))
      const isBeforeMin = minDate && date < minDate
      const isAfterMax = maxDate && date > maxDate

      if (!isWorkingDay || isExcluded || isBeforeMin || isAfterMax) {
        return
      }

      const dateKey = format(date, 'yyyy-MM-dd')
      const daySlots = availableSlots[dateKey] || []

      if (daySlots.length === 0) {
        return
      }

      onDateSelect(date)
      setView('times')
    },
    [workingDays, excludeDates, minDate, maxDate, availableSlots, onDateSelect]
  )

  const handleTimeSlotClick = useCallback(
    (timeSlot: TimeSlot) => {
      if (!timeSlot.available) return
      onTimeSlotSelect(timeSlot)
    },
    [onTimeSlotSelect]
  )

  const handleBookingConfirm = useCallback(() => {
    if (selectedDate && selectedTimeSlot) {
      onBookingConfirm(selectedDate, selectedTimeSlot)
    }
  }, [selectedDate, selectedTimeSlot, onBookingConfirm])

  const isDayDisabled = useCallback(
    (date: Date) => {
      const dayOfWeek = date.getDay()
      const isWorkingDay = workingDays.includes(dayOfWeek)
      const isExcluded = excludeDates.some((excludeDate) => isSameDay(date, excludeDate))
      const isBeforeMin = minDate && date < minDate
      const isAfterMax = maxDate && date > maxDate

      return !isWorkingDay || isExcluded || isBeforeMin || isAfterMax
    },
    [workingDays, excludeDates, minDate, maxDate]
  )

  return (
    <div className={`bg-white rounded-lg shadow-soft border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {view === 'calendar' ? 'Select Date' : 'Select Time'}
            </h3>
            {selectedDate && view === 'times' && (
              <p className="text-sm text-gray-600 mt-1">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </p>
            )}
          </div>

          {view === 'times' && (
            <button
              type="button"
              onClick={() => setView('calendar')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Calendar
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-gray-600">Loading availability...</span>
        </div>
      ) : (
        <div className="p-6">
          {view === 'calendar' ? (
            <CalendarView
              currentMonth={currentMonth}
              calendarDays={calendarDays}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onDateClick={handleDateClick}
              isDayDisabled={isDayDisabled}
            />
          ) : (
            <TimeSlotsView
              date={selectedDate!}
              timeSlots={dayTimeSlots}
              selectedTimeSlot={selectedTimeSlot}
              onTimeSlotClick={handleTimeSlotClick}
              onBookingConfirm={handleBookingConfirm}
            />
          )}
        </div>
      )}
    </div>
  )
}

// Calendar View Component
interface CalendarViewProps {
  currentMonth: Date
  calendarDays: CalendarDay[]
  onPrevMonth: () => void
  onNextMonth: () => void
  onDateClick: (date: Date) => void
  isDayDisabled: (date: Date) => boolean
}

function CalendarView({
  currentMonth,
  calendarDays,
  onPrevMonth,
  onNextMonth,
  onDateClick,
  isDayDisabled,
}: CalendarViewProps) {
  return (
    <>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</h2>

        <button
          type="button"
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="p-2 text-center">
            <span className="text-sm font-medium text-gray-500">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isDisabled = isDayDisabled(day.date)
          const hasAvailableSlots = day.hasSlots && day.availableSlots > 0

          return (
            <button
              key={index}
              type="button"
              onClick={() => onDateClick(day.date)}
              disabled={isDisabled || !hasAvailableSlots}
              className={`
                relative p-2 h-12 rounded-md text-sm font-medium transition-all duration-200
                ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                ${day.isToday ? 'ring-2 ring-primary-200' : ''}
                ${day.isSelected ? 'bg-primary-500 text-white' : ''}
                ${
                  isDisabled || !hasAvailableSlots
                    ? 'cursor-not-allowed text-gray-300'
                    : 'hover:bg-primary-50 hover:text-primary-700'
                }
                ${hasAvailableSlots && !day.isSelected ? 'bg-success-50 text-success-700' : ''}
              `}
              aria-label={`${format(day.date, 'MMMM d, yyyy')}${hasAvailableSlots ? ` - ${day.availableSlots} slots available` : ''}`}
            >
              {format(day.date, 'd')}

              {/* Available slots indicator */}
              {hasAvailableSlots && !day.isSelected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1.5 h-1.5 bg-success-500 rounded-full"></div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success-50 border border-success-200 rounded mr-2"></div>
            Available
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-2"></div>
            Unavailable
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-500 rounded mr-2"></div>
            Selected
          </div>
        </div>
      </div>
    </>
  )
}

// Time Slots View Component
interface TimeSlotsViewProps {
  date: Date
  timeSlots: TimeSlot[]
  selectedTimeSlot?: TimeSlot
  onTimeSlotClick: (timeSlot: TimeSlot) => void
  onBookingConfirm: () => void
}

function TimeSlotsView({
  date,
  timeSlots,
  selectedTimeSlot,
  onTimeSlotClick,
  onBookingConfirm,
}: TimeSlotsViewProps) {
  const availableSlots = timeSlots.filter((slot) => slot.available)
  const unavailableSlots = timeSlots.filter((slot) => !slot.available)

  const formatTime = (timeString: string) => {
    try {
      const time = parseISO(`1970-01-01T${timeString}`)
      return format(time, 'h:mm a')
    } catch {
      return timeString
    }
  }

  const formatDuration = (startTime: string, endTime: string) => {
    try {
      const start = parseISO(`1970-01-01T${startTime}`)
      const end = parseISO(`1970-01-01T${endTime}`)
      const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
      const hours = Math.floor(diffMinutes / 60)
      const minutes = diffMinutes % 60

      if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
      }
      return `${minutes}m`
    } catch {
      return ''
    }
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments available</h3>
        <p className="text-gray-600">Please select a different date</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Available Time Slots */}
      {availableSlots.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Available Times</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => onTimeSlotClick(slot)}
                className={`
                  p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                  ${
                    selectedTimeSlot?.id === slot.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700'
                  }
                `}
              >
                <div className="text-center">
                  <div className="font-semibold">
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDuration(slot.start_time, slot.end_time)}
                  </div>
                  {slot.price && (
                    <div className="text-xs text-primary-600 mt-1 font-medium">${slot.price}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Unavailable Time Slots */}
      {unavailableSlots.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Unavailable</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {unavailableSlots.map((slot) => (
              <div
                key={slot.id}
                className="p-3 rounded-lg border-2 border-gray-100 bg-gray-50 text-sm font-medium text-gray-400 cursor-not-allowed"
              >
                <div className="text-center">
                  <div className="line-through">
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </div>
                  <div className="text-xs mt-1">Booked</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Confirmation */}
      {selectedTimeSlot && (
        <div className="pt-6 border-t border-gray-200">
          <div className="bg-primary-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-primary-900 mb-2">Selected Appointment</h4>
            <div className="text-sm text-primary-700">
              <div className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</div>
              <div>
                {formatTime(selectedTimeSlot.start_time)} - {formatTime(selectedTimeSlot.end_time)}
                <span className="ml-2 text-primary-600">
                  ({formatDuration(selectedTimeSlot.start_time, selectedTimeSlot.end_time)})
                </span>
              </div>
              {selectedTimeSlot.price && (
                <div className="font-medium mt-1">${selectedTimeSlot.price}</div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onBookingConfirm}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  )
}
