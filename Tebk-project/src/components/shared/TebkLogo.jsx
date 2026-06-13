import { useId } from 'react'

// Cross path: 100x100 viewBox, 5px padding, arm width 36px, outer corners rx≈9
const CROSS = 'M41,5 H59 Q68,5 68,14 V32 H86 Q95,32 95,41 V59 Q95,68 86,68 H68 V86 Q68,95 59,95 H41 Q32,95 32,86 V68 H14 Q5,68 5,59 V41 Q5,32 14,32 H32 V14 Q32,5 41,5 Z'

export function TebkIcon({ className = 'w-8 h-8' }) {
  const raw = useId()
  const id  = raw.replace(/:/g, 'i')

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Clip to the cross/plus shape */}
        <clipPath id={`${id}x`}>
          <path d={CROSS} />
        </clipPath>
        {/* Upper-left triangle to color the teal half */}
        <clipPath id={`${id}t`}>
          <polygon points="-5,-5 105,-5 -5,105" />
        </clipPath>
      </defs>

      {/* Navy cross — full shape */}
      <g clipPath={`url(#${id}x)`}>
        <rect x="0" y="0" width="100" height="100" fill="#213360" />
      </g>

      {/* Teal cross — upper-left diagonal half */}
      <g clipPath={`url(#${id}x)`}>
        <g clipPath={`url(#${id}t)`}>
          <rect x="0" y="0" width="100" height="100" fill="#21cdc0" />
        </g>
      </g>

      {/* White swoosh arc — unclipped so it extends slightly beyond the cross on dark backgrounds */}
      <path
        d="M 5,82 C 30,62 62,35 88,14"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
