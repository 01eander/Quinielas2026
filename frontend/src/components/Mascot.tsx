import { MASCOT, MASCOT_NAME } from '../constants/branding';

type MascotSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<MascotSize, string> = {
  sm: 'h-24',
  md: 'h-32',
  lg: 'h-40 sm:h-44',
  xl: 'h-44 sm:h-52',
};

interface MascotProps {
  size?: MascotSize;
  className?: string;
}

export default function Mascot({ size = 'md', className = '' }: MascotProps) {
  if (!MASCOT) return null;
  return (
    <img
      src={MASCOT}
      alt={MASCOT_NAME}
      className={`${sizeClasses[size]} w-auto object-contain drop-shadow-2xl ${className}`}
    />
  );
}
