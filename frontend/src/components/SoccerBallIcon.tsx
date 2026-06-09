interface SoccerBallIconProps {
  className?: string;
}

export default function SoccerBallIcon({ className = 'w-16 h-16' }: SoccerBallIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`soccer-ball ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="32" cy="32" r="30" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
      <path
        d="M32 8 L38 18 L32 22 L26 18 Z"
        fill="#1e293b"
      />
      <path
        d="M32 56 L26 46 L32 42 L38 46 Z"
        fill="#1e293b"
      />
      <path
        d="M8 32 L18 26 L22 32 L18 38 Z"
        fill="#1e293b"
      />
      <path
        d="M56 32 L46 38 L42 32 L46 26 Z"
        fill="#1e293b"
      />
      <path
        d="M14 14 L24 20 L22 28 L14 24 Z"
        fill="#334155"
      />
      <path
        d="M50 14 L46 24 L38 22 L42 14 Z"
        fill="#334155"
      />
      <path
        d="M14 50 L24 44 L22 36 L14 40 Z"
        fill="#334155"
      />
      <path
        d="M50 50 L46 40 L38 42 L42 50 Z"
        fill="#334155"
      />
      <circle cx="32" cy="32" r="6" fill="#006847" opacity="0.9" />
    </svg>
  );
}
