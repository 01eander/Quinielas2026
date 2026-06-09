import { Save, CheckCircle2, Loader2 } from 'lucide-react';

interface QuinielaSaveBarProps {
  dirtyCount: number;
  saving: boolean;
  saveMessage: string | null;
  onSaveAll: () => void;
}

export default function QuinielaSaveBar({
  dirtyCount,
  saving,
  saveMessage,
  onSaveAll,
}: QuinielaSaveBarProps) {
  const allSaved = dirtyCount === 0 && !saveMessage;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-pitch-deepest/95 backdrop-blur-lg shadow-[0_-8px_30px_rgba(0,0,0,0.35)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-center sm:text-left">
          {saveMessage ? (
            <span className="text-mx-green font-medium flex items-center gap-2 justify-center sm:justify-start">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {saveMessage}
            </span>
          ) : dirtyCount > 0 ? (
            <span className="text-gold-400 font-medium">
              {dirtyCount} {dirtyCount === 1 ? 'cambio sin guardar' : 'cambios sin guardar'}
            </span>
          ) : (
            <span className="text-white/70 flex items-center gap-2 justify-center sm:justify-start">
              <CheckCircle2 className="w-4 h-4 text-mx-green shrink-0" />
              Todo guardado
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onSaveAll}
          disabled={saving || dirtyCount === 0}
          className="btn-primary w-full sm:w-auto min-w-[180px] flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {allSaved ? 'Guardar todo' : `Guardar todo (${dirtyCount})`}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
