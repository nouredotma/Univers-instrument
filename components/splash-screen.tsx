"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    // Scroll is already locked by the "loading-lock" class in layout.tsx
    // to prevent the "flash" of scrollbar on initial load.

    const fadeTimer = setTimeout(() => {
      setFadingOut(true)
    }, 3000)

    const removeTimer = setTimeout(() => {
      document.documentElement.classList.remove("loading-lock")
      setVisible(false)
    }, 3600) // 3s display + 0.6s fade-out

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
      document.documentElement.classList.remove("loading-lock")
    }
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        height: "100svh",
        width: "100%",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 1,
        transform: fadingOut ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.6s ease-in",
        pointerEvents: fadingOut ? "none" : "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {/* Left column – logo image */}
        <Image
          className="splash-image"
          src="/loaderimage.png"
          alt="Univers Instrument Service"
          width={200}
          height={200}
          priority
          style={{ objectFit: "contain" }}
        />

        {/* Right column – three stacked words with flip-in animation */}
        <div
          className="splash-words"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            perspective: "600px",
          }}
        >
          {["UNIVERS", "INSTRUMENT", "SERVICE"].map((word, i) => (
            <div
              key={word}
              className="splash-word-row"
              style={{
                overflow: "hidden",
              }}
            >
              <span
                className="splash-flip-in splash-word"
                style={{
                  fontFamily: "'Fauna One', serif",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#1c1917",
                  letterSpacing: "0.15em",
                  lineHeight: 1.2,
                  display: "inline-block",
                  animationDelay: `${0.3 + i * 0.3}s`,
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
