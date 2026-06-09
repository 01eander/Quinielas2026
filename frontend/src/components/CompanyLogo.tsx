import { COMPANY_LOGO, COMPANY_NAME } from '../constants/branding';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

const sizeClasses: Record<LogoSize, string> = {
  xs: 'h-6',
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-14',
  xl: 'h-20',
  '2xl': 'h-28 sm:h-32',
  '3xl': 'h-40 sm:h-48 md:h-56',
};

interface CompanyLogoProps {
  size?: LogoSize;
  className?: string;
}

export default function CompanyLogo({ size = 'sm', className = '' }: CompanyLogoProps) {
  return (
    <img
      src={COMPANY_LOGO}
      alt={COMPANY_NAME}
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
    />
  );
}
