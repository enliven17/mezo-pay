"use client"

import { useEffect, useState } from "react"

export function SimpleAnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Modern gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
      
      {/* Neural network style connections */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-20" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Animated connection lines */}
          <g className="animate-neural-pulse">
            <line x1="100" y1="200" x2="300" y2="150" stroke="url(#connectionGradient)" strokeWidth="1" />
            <line x1="300" y1="150" x2="500" y2="250" stroke="url(#connectionGradient)" strokeWidth="1" />
            <line x1="500" y1="250" x2="700" y2="180" stroke="url(#connectionGradient)" strokeWidth="1" />
            <line x1="200" y1="400" x2="400" y2="350" stroke="url(#connectionGradient)" strokeWidth="1" />
            <line x1="400" y1="350" x2="600" y2="450" stroke="url(#connectionGradient)" strokeWidth="1" />
            <line x1="600" y1="450" x2="800" y2="380" stroke="url(#connectionGradient)" strokeWidth="1" />
            <line x1="150" y1="600" x2="350" y2="550" stroke="url(#connectionGradient)" strokeWidth="1" />
            <line x1="350" y1="550" x2="550" y2="650" stroke="url(#connectionGradient)" strokeWidth="1" />
            <line x1="550" y1="650" x2="750" y2="580" stroke="url(#connectionGradient)" strokeWidth="1" />
          </g>
          
          {/* Network nodes */}
          <g className="animate-node-glow">
            <circle cx="100" cy="200" r="4" fill="#f97316" opacity="0.8" />
            <circle cx="300" cy="150" r="3" fill="#3b82f6" opacity="0.7" />
            <circle cx="500" cy="250" r="5" fill="#8b5cf6" opacity="0.6" />
            <circle cx="700" cy="180" r="3" fill="#10b981" opacity="0.8" />
            <circle cx="200" cy="400" r="4" fill="#f59e0b" opacity="0.7" />
            <circle cx="400" cy="350" r="3" fill="#ef4444" opacity="0.6" />
            <circle cx="600" cy="450" r="5" fill="#06b6d4" opacity="0.8" />
            <circle cx="800" cy="380" r="4" fill="#8b5cf6" opacity="0.7" />
            <circle cx="150" cy="600" r="3" fill="#f97316" opacity="0.6" />
            <circle cx="350" cy="550" r="4" fill="#3b82f6" opacity="0.8" />
            <circle cx="550" cy="650" r="5" fill="#10b981" opacity="0.7" />
            <circle cx="750" cy="580" r="3" fill="#f59e0b" opacity="0.6" />
          </g>
        </svg>
      </div>
      
      {/* Modern geometric shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 border border-orange-500/20 rotate-45 animate-geometric-spin" />
        <div className="absolute top-40 right-32 w-24 h-24 border border-blue-500/20 animate-geometric-float" />
        <div className="absolute bottom-32 left-40 w-28 h-28 border border-purple-500/20 rotate-12 animate-geometric-pulse" />
        <div className="absolute bottom-20 right-20 w-20 h-20 border border-green-500/20 rotate-45 animate-geometric-spin-reverse" />
      </div>
      
      {/* Matrix-style digital rain */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-green-400 to-transparent animate-matrix-rain"
            style={{
              left: `${(i * 8.33)}%`,
              height: '200px',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Floating data particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/40 rounded-full animate-data-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      
      {/* Scanning lines effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-scan-horizontal" />
        <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-orange-400/30 to-transparent animate-scan-vertical" />
      </div>
      
      {/* Holographic overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/5 to-transparent animate-hologram" />
    </div>
  )
}