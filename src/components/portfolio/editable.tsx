import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import * as Icons from "lucide-react";
import { ArrowDown, ArrowUp, ImagePlus, Link2, Pencil, Trash2, User, X } from "lucide-react";
import { getPath, useSite } from "./store";
import { convertDriveImageLink, isValidLink } from "@/lib/content";
import { cn } from "@/lib/utils";

/* ---------- Inline text ---------- */
export function E({
  path,
  as: Tag = "span",
  className,
  multiline,
}: {
  path: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
}) {
  const { content, editing, set } = useSite();
  const value = String(getPath(content, path) ?? "");
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) ref.current.innerText = value;
  }, [value, editing]);
  if (!editing) return <Tag className={className}>{value}</Tag>;
  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      title="Click to edit"
      className={cn(className, "edit-outline")}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const v = e.currentTarget.innerText.trim();
        if (v !== value) set(path, v);
      }}
    />
  );
}

/* ---------- Icon by name ---------- */
export function DynIcon({ name, className }: { name: string; className?: string }) {
  const I = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Code2;
  return <I className={className} />;
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, children, className }: { open: boolean; onClose: () => void; children: ReactNode; className?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-background/70 p-4 backdrop-blur-md" onClick={onClose}>
      <div className={cn("glass relative w-full max-w-md rounded-2xl bg-popover p-6", className)} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-glass px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary";

/* ---------- Image ---------- */
export function EditImage({ path, className, alt }: { path: string; className?: string; alt: string }) {
  const { content, editing, set } = useSite();
  const src = String(getPath(content, path) ?? "");
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(src);
  const preview = convertDriveImageLink(val);
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
      ) : (
        <div className="grid h-full w-full place-items-center bg-accent text-primary">
          <User className="h-1/3 w-1/3 opacity-60" />
        </div>
      )}
      {editing && (
        <button
          onClick={() => {
            setVal(src);
            setOpen(true);
          }}
          className="absolute inset-x-2 bottom-2 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow"
        >
          <ImagePlus className="h-3.5 w-3.5" /> Change Image
        </button>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-lg font-semibold">Change image</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Drive → Right click image → Share → Anyone with link → Copy → Paste here
        </p>
        <input className={cn(inputCls, "mt-4")} placeholder="Paste Google Drive image link" value={val} onChange={(e) => setVal(e.target.value)} />
        {preview && (
          <img src={preview} alt="Preview" referrerPolicy="no-referrer" className="mt-4 h-40 w-full rounded-xl object-cover" />
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setOpen(false)}>Cancel</button>
          <button
            className={btnPrimary}
            onClick={() => {
              set(path, convertDriveImageLink(val.trim()));
              setOpen(false);
            }}
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ---------- Link button ---------- */
export function ELink({
  path,
  className,
  children,
  hideIfEmpty = true,
  ariaLabel,
}: {
  path: string;
  className?: string;
  children: ReactNode;
  hideIfEmpty?: boolean;
  ariaLabel?: string;
}) {
  const { content, editing, set } = useSite();
  const href = String(getPath(content, path) ?? "");
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(href);
  const valid = isValidLink(val);
  if (!editing && !href) {
    if (hideIfEmpty) return null;
    return (
      <span className={cn(className, "cursor-not-allowed opacity-50")} title="Coming soon">
        {children} <span className="text-[10px]">(Coming soon)</span>
      </span>
    );
  }
  const external = href.startsWith("https://");
  return (
    <span className="relative inline-flex">
      <a href={href || undefined} aria-label={ariaLabel} target={external ? "_blank" : undefined} rel="noreferrer" className={cn(className, editing && !href && "opacity-50")}>
        {children}
      </a>
      {editing && (
        <button
          onClick={() => {
            setVal(href);
            setOpen((o) => !o);
          }}
          className="absolute -right-2 -top-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
          aria-label="Edit link"
        >
          <Link2 className="h-3 w-3" />
        </button>
      )}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-popover p-3 shadow-glow">
          <input
            autoFocus
            className={cn(inputCls, "py-2", !valid && "border-destructive focus:border-destructive")}
            placeholder="https://… or mailto:…"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && valid) {
                set(path, val.trim());
                setOpen(false);
              }
              if (e.key === "Escape") setOpen(false);
            }}
          />
          {!valid ? (
            <p className="mt-1 text-xs text-destructive">Invalid URL — must start with https:// or mailto:</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">Press Enter to save. Empty = hidden.</p>
          )}
        </div>
      )}
    </span>
  );
}

/* ---------- List item controls ---------- */
export function ItemControls({ onDelete, onUp, onDown }: { onDelete: () => void; onUp?: () => void; onDown?: () => void }) {
  const { editing } = useSite();
  if (!editing) return null;
  const b = "grid h-7 w-7 place-items-center rounded-lg bg-popover/90 border border-border hover:text-primary";
  return (
    <div className="absolute right-2 top-2 z-20 flex gap-1">
      {onUp && <button className={b} onClick={onUp} aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>}
      {onDown && <button className={b} onClick={onDown} aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>}
      <button className={cn(b, "hover:text-destructive")} onClick={onDelete} aria-label="Delete">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  const { editing } = useSite();
  if (!editing) return null;
  return (
    <button onClick={onClick} className="flex min-h-24 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/50 p-4 text-sm font-semibold text-primary transition hover:bg-primary/10">
      <Icons.Plus className="h-4 w-4" /> {label}
    </button>
  );
}

export function move<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const a = [...arr];
  const t = a[i] as T; a[i] = a[j] as T; a[j] = t;
  return a;
}

export function IconPicker({ path }: { path: string }) {
  const { editing } = useSite();
  if (!editing) return null;
  return (
    <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
      <Pencil className="h-3 w-3" /> icon: <E path={path} />
    </span>
  );
}

/* ---------- Reveal on scroll ---------- */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center">
      <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </Reveal>
  );
}
