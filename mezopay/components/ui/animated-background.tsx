"use client"

import { useEffect, useState } from "react"

export function SimpleAnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient - sabit */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      
      {/* Subtle animated overlays - daha az hareket */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-full h-full bg-gradient-to-r from-orange-500/10 via-transparent to-blue-500/10 opacity-50"
        />
        <div 
          className="absolute w-full h-full bg-gradient-to-b from-transparent via-purple-500/8 to-transparent opacity-60"
        />
      </div>
      
      {/* Sabit floating orbs - pozisyon değişmiyor */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-500/8 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-500/8 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-purple-500/8 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-bitcoin/6 rounded-full blur-2xl" />
      </div>
      
      {/* Subtle grid pattern - sabit */}
      <div 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Minimal twinkling particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${20 + Math.random() * 60}%`, // Merkeze daha yakın
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}