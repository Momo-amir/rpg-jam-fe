export function D20Icon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" className={className} aria-hidden="true">
      <polygon points="256,36 447,146 447,366 256,476 65,366 65,146" />
      <line x1="256" y1="36" x2="65" y2="366" />
      <line x1="256" y1="36" x2="447" y2="366" />
      <line x1="65" y1="366" x2="447" y2="366" />
      <line x1="256" y1="476" x2="256" y2="366" />
      <line x1="65" y1="146" x2="160" y2="201" />
      <line x1="447" y1="146" x2="352" y2="201" />
      <line x1="160" y1="201" x2="352" y2="201" />
      <line x1="256" y1="366" x2="160" y2="201" />
      <line x1="256" y1="366" x2="352" y2="201" />
    </svg>
  )
}
