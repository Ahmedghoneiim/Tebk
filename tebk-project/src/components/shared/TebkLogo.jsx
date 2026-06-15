import { useId } from 'react'

export function TebkLogo({ className = 'w-8 h-8', variant = 'light' }) {
  const uid    = useId()
  const maskId = `tm${uid.replace(/:/g, '')}`

  const lowerSquare = variant === 'dark' ? 'rgba(255,255,255,0.90)' : '#1E3A6E'
  const tailColor   = variant === 'dark' ? 'rgba(255,255,255,0.40)' : '#1E3A6E'
  const arcColor    = variant === 'dark' ? 'rgba(255,255,255,0.85)' : '#ffffff'

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TEBK"
    >
      <defs>
        {/* Hides the white arc inside the navy square so it looks like it passes behind */}
        <mask id={maskId}>
          <rect width="100" height="100" fill="white" />
          <rect x="40" y="40" width="56" height="56" rx="13" fill="black" />
        </mask>
      </defs>

      {/* ① Dark swoosh tail — drawn first, behind both squares */}
      <path
        d="M5,92 C-2,80 -2,62 6,48"
        stroke={tailColor}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />

      {/* ② Navy / white lower-right square */}
      <rect x="40" y="40" width="56" height="56" rx="13" fill={lowerSquare} />

      {/* ③ Teal upper-left square — overlaps center of navy, covers part of dark tail */}
      <rect x="4" y="4" width="56" height="56" rx="13" fill="#17C3CE" />

      {/* ④ White swoosh arc — sweeps over teal, masked inside navy (appears to go behind) */}
      <path
        d="M5,76 C-1,52 24,8 86,42"
        stroke={arcColor}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        mask={`url(#${maskId})`}
      />
    </svg>
  )
}
