'use client'

import { useEffect, useRef } from 'react'

/**
 * ObsidianBackground - Premium animated background for Obsidian theme
 * Features:
 * - Animated gradient orbs
 * - Floating particles
 * - Subtle grid pattern
 * - Noise texture overlay
 */
export function ObsidianBackground() {
  return (
    <>
      {/* Animated gradient background */}
      <div className="obsidian-bg" />

      {/* Animated grid overlay */}
      <div className="obsidian-grid" />

      {/* Floating orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div
          className="orb orb-blue"
          style={{
            width: '400px',
            height: '400px',
            top: '-10%',
            right: '10%',
            animationDelay: '0s',
          }}
        />
        <div
          className="orb orb-cyan"
          style={{
            width: '300px',
            height: '300px',
            bottom: '10%',
            left: '-5%',
            animationDelay: '-5s',
          }}
        />
        <div
          className="orb orb-purple"
          style={{
            width: '250px',
            height: '250px',
            top: '40%',
            right: '-5%',
            animationDelay: '-10s',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="obsidian-particles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Noise texture for film grain effect */}
      <div className="noise-overlay" />
    </>
  )
}

/**
 * Canvas-based particle system for more sophisticated effects
 */
export function ObsidianParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: Particle[] = []
    const particleCount = 50

    // Store dimensions
    let canvasWidth = window.innerWidth
    let canvasHeight = window.innerHeight

    // Set canvas size
    const resize = () => {
      canvasWidth = window.innerWidth
      canvasHeight = window.innerHeight
      canvas.width = canvasWidth
      canvas.height = canvasHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string

      constructor() {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.2
        this.color = Math.random() > 0.5 ? '#3B82F6' : '#22D3EE'
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0) this.x = canvasWidth
        if (this.x > canvasWidth) this.x = 0
        if (this.y < 0) this.y = canvasHeight
        if (this.y > canvasHeight) this.y = 0
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Draw connections between nearby particles
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = '#3B82F6'
            ctx.globalAlpha = 0.1 * (1 - distance / 150)
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      drawConnections()

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}
