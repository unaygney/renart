'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { type CarouselApi } from '@/components/ui/carousel'

interface CustomScrollbarProps {
  api: CarouselApi | undefined
  className?: string
}

export function CustomScrollbar({ api, className = '' }: CustomScrollbarProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [thumbSize, setThumbSize] = useState(100)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isCarouselDragging, setIsCarouselDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const updateScrollbar = useCallback(
    (api: CarouselApi) => {
      if (!api) return

      // Update scroll progress - this returns 0 to 1
      const progress = Math.max(0, Math.min(1, api.scrollProgress()))
      setScrollProgress(progress)

      // Calculate thumb size based on visible content
      const slides = api.slideNodes().length
      const slidesInView = api.slidesInView().length
      const ratio = slidesInView / slides

      // Use a more stable thumb size calculation
      // On mobile, use a fixed percentage to prevent size changes
      const thumbPercentage = isMobile
        ? 15 // Fixed 15% on mobile for stability
        : Math.max(8, Math.min(25, ratio * 60)) // Dynamic sizing on desktop

      setThumbSize(thumbPercentage)
    },
    [isMobile]
  )

  const scrollToProgress = useCallback(
    (clientX: number) => {
      if (!api || !scrollbarRef.current) return

      const rect = scrollbarRef.current.getBoundingClientRect()
      const clickX = clientX - rect.left
      const trackWidth = rect.width

      // Calculate where the click is as a percentage
      const clickRatio = Math.max(0, Math.min(1, clickX / trackWidth))

      // Get scroll snaps and find target
      const scrollSnaps = api.scrollSnapList()
      if (scrollSnaps.length === 0) return

      // Map progress to snap index
      const targetIndex = Math.round(clickRatio * (scrollSnaps.length - 1))
      const clampedIndex = Math.max(
        0,
        Math.min(scrollSnaps.length - 1, targetIndex)
      )

      api.scrollTo(clampedIndex, false)
    },
    [api, thumbSize]
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(true)
      scrollToProgress(e.clientX)
    },
    [scrollToProgress]
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return
      scrollToProgress(e.clientX)
    },
    [isDragging, scrollToProgress]
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Legacy mouse events for desktop compatibility
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true)
      scrollToProgress(e.clientX)
    },
    [scrollToProgress]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      scrollToProgress(e.clientX)
    },
    [isDragging, scrollToProgress]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Handle screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640) // sm breakpoint
    }

    // Initial check
    checkScreenSize()

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  useEffect(() => {
    if (!api) return

    // Initial update
    updateScrollbar(api)

    // Listen to all scroll-related events with immediate updates
    const onScrollHandler = () => {
      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => updateScrollbar(api))
    }

    const onPointerDown = () => {
      setIsCarouselDragging(true)
      onScrollHandler()
    }

    const onPointerUp = () => {
      setIsCarouselDragging(false)
      onScrollHandler()
    }

    // Add more granular scroll events for better real-time updates
    api.on('scroll', onScrollHandler)
    api.on('reInit', onScrollHandler)
    api.on('select', onScrollHandler)
    api.on('pointerDown', onPointerDown)
    api.on('pointerUp', onPointerUp)

    return () => {
      api?.off('scroll', onScrollHandler)
      api?.off('reInit', onScrollHandler)
      api?.off('select', onScrollHandler)
      api?.off('pointerDown', onPointerDown)
      api?.off('pointerUp', onPointerUp)
    }
  }, [api, updateScrollbar])

  useEffect(() => {
    if (isDragging) {
      // Add both pointer and mouse events for cross-platform compatibility
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)

      return () => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [
    isDragging,
    handlePointerMove,
    handlePointerUp,
    handleMouseMove,
    handleMouseUp,
  ])

  return (
    <div className={`mt-6 sm:mt-8 px-2 md:px-4 ${className}`}>
      <div
        ref={scrollbarRef}
        className="relative h-4 sm:h-3 w-full cursor-pointer group touch-manipulation"
        onMouseDown={handleMouseDown}
        onPointerDown={handlePointerDown}
        style={{ touchAction: 'none' }}
      >
        {/* Track with subtle 3D embossed effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 rounded-full shadow-inner border border-gray-300"></div>

        {/* Thumb with custom color and rounded corners */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 sm:h-2 rounded-full transition-all ease-linear shadow-sm hover:shadow-md active:shadow-lg"
          style={{
            backgroundColor: '#b8b8b8',
            left: `${scrollProgress * (100 - thumbSize)}%`,
            width: `${thumbSize}%`,
            transitionDuration:
              isDragging || isCarouselDragging ? '0ms' : '50ms',
            minWidth: '20px', // Ensure minimum touch target size
          }}
        />

        {/* Mobile touch indicator */}
        <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-20 bg-gray-400 transition-opacity duration-150 sm:hidden"></div>
      </div>
    </div>
  )
}
