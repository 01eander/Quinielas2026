import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'mx' | 'us' | 'ca' | 'gold';
}

const colorMap = {
  mx: 'bg-mx-green/15 text-mx-green border-mx-green/20',
  us: 'bg-us-blue/15 text-us-blue border-us-blue/20',
  ca: 'bg-ca-red/15 text-ca-red border-ca-red/20',
  gold: 'bg-gold-400/15 text-gold-600 border-gold-400/20',
};

export default function KpiCard({ title, value, icon: Icon, color = 'us' }: KpiCardProps) {
  return (
    <div className="card flex items-center gap-4 border-t-4 border-t-transparent bg-gradient-to-br from-white to-gray-50/80"
      style={{
        borderTopColor: color === 'mx' ? '#006847' : color === 'us' ? '#002868' : color === 'ca' ? '#FF0000' : '#f59e0b',
      }}
    >
      <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}
