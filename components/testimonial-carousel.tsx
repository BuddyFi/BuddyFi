"use client"

import type React from "react"

import { useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

interface Testimonial {
  name: string
  role: string
  image: string
  quote: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)
    if ("touches" in e) {
      setStartX(e.touches[0].clientX)
      setCurrentX(e.touches[0].clientX)
    } else {
      setStartX(e.clientX)
      setCurrentX(e.clientX)
    }
  }

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    if ("touches" in e) {
      setCurrentX(e.touches[0].clientX)
    } else {
      setCurrentX(e.clientX)
    }
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    const diff = startX - currentX
    if (diff > 50) {
      handleNext()
    } else if (diff < -50) {
      handlePrev()
    }
  }

  return (
    <div className="relative">
      <div
        ref={carouselRef}
        className="relative overflow-hidden rounded-lg"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, i) => (
            <div key={i} className="min-w-full">
              <div className="mx-auto max-w-2xl rounded-lg border border-slate-800 bg-slate-900 p-8 shadow-lg shadow-cyan-500/5">
                <div className="mb-6 flex items-center">
                  <div className="mr-4 h-16 w-16 overflow-hidden rounded-full border-2 border-slate-800">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={100}
                      height={100}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-mono text-xl font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                  <Quote className="ml-auto h-8 w-8 text-cyan-500/30" />
                </div>
                <p className="text-lg italic text-slate-300">"{testimonial.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={handlePrev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:bg-slate-800 hover:text-cyan-400"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === activeIndex ? "w-6 bg-cyan-400" : "bg-slate-700 hover:bg-slate-600"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:bg-slate-800 hover:text-cyan-400"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
