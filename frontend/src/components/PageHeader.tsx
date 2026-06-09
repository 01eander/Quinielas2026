import { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

export default function PageHeader({ title, subtitle, icon, className = '' }: PageHeaderProps) {
  return (
    <div className={`mb-8 relative ${className}`}>      <div className="flex items-start gap-4">
        {icon && (
          <div className="p-3 rounded-2xl bg-gradient-to-br from-mx-green/30 to-us-blue/30 border border-white/10 backdrop-blur-sm shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="page-title flex items-center gap-2">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-mx-green via-us-blue to-ca-red" />
    </div>
  );
}
