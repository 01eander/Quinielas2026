import { Circle, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { PredictionUiStatus } from '../utils/matchHelpers';

interface PredictionStatusBadgeProps {
  status: PredictionUiStatus;
  compact?: boolean;
}

const config: Record<
  PredictionUiStatus,
  { label: string; className: string; Icon: typeof CheckCircle2 }
> = {
  saved: {
    label: 'Guardado',
    className: 'bg-mx-green/15 text-mx-green border-mx-green/30',
    Icon: CheckCircle2,
  },
  dirty: {
    label: 'Sin guardar',
    className: 'bg-gold-400/20 text-amber-700 border-gold-400/40',
    Icon: AlertCircle,
  },
  empty: {
    label: 'Pendiente',
    className: 'bg-gray-100 text-gray-500 border-gray-200',
    Icon: Circle,
  },
  locked: {
    label: 'Bloqueado',
    className: 'bg-gray-100 text-gray-400 border-gray-200',
    Icon: Lock,
  },
};

export default function PredictionStatusBadge({ status, compact }: PredictionStatusBadgeProps) {
  const { label, className, Icon } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${className}`}
    >
      <Icon className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {!compact && label}
    </span>
  );
}
