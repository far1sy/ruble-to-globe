import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function BottomSheet({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <button
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
      />
      <div className="relative w-full rounded-t-3xl border-t border-white/10 bg-card px-5 pb-8 pt-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted-foreground/30" />
        {title ? (
          <h2 className="mb-4 text-center text-lg font-semibold text-foreground">{title}</h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}
