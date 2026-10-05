import { useEffect, useState } from "react";
import { ArrowUp, Lock, LogOut, Menu, RotateCcw, Save, Settings, X, Mail, MessageCircle, CheckCircle2, WifiOff } from "lucide-react";
import { useSite } from "./store";
import { ELink, E, Modal, btnPrimary, inputCls } from "./editable";
import { verifyAdmin } from "@/lib/site.functions";
import { cn } from "@/lib/utils";

export const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
  </svg>
);
export const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
  </svg>
);

export function Socials({ className }: { className?: string }) {
  const c = "grid h-11 w-11 place-items-center rounded-full border border-border bg-glass text-muted-foreground transition hover:-translate-y-1 hover:border-primary hover:text-primary hover:shadow-glow";
  return (
    <div className={cn("flex gap-3", className)}>
      <ELink path="links.github" className={c} ariaLabel="GitHub"><GithubIcon className="h-5 w-5" /></ELink>
      <ELink path="links.linkedin" className={c} ariaLabel="LinkedIn"><LinkedinIcon className="h-5 w-5" /></ELink>
      <ELink path="links.whatsapp" className={c} ariaLabel="WhatsApp"><MessageCircle className="h-5 w-5" /></ELink>
      <ELink path="links.email" className={c} ariaLabel="Email"><Mail className="h-5 w-5" /></ELink>
    </div>
  );
}

export const NAV = ["Home", "About", "Skills", "Education", "Projects", "Contact"];

export function Logo() {
  return (
    <a href="#home" className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary font-display text-lg font-bold text-primary-foreground shadow-glow">
      MU
    </a>
  );
}

export function Navbar() {
  const { setOpenLogin, editing } = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f();
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all", scrolled ? "border-b border-border bg-background/75 backdrop-blur-xl" : "bg-transparent", editing && "top-9")}>
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n}>
              <a href={`#${n.toLowerCase()}`} className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-primary">
                {n}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ELink path="links.hire" className={cn(btnPrimary, "hidden py-2.5 sm:inline-flex")}>Hire Me</ELink>
          <button onClick={() => setOpenLogin(true)} aria-label="Admin" className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground transition hover:rotate-90 hover:text-primary">
            <Settings className="h-5 w-5" />
          </button>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-xl border border-border lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-border bg-background/95 px-5 pb-6 backdrop-blur-xl lg:hidden">
          {NAV.map((n) => (
            <a key={n} onClick={() => setOpen(false)} href={`#${n.toLowerCase()}`} className="block border-b border-border py-3 font-medium hover:text-primary">
              {n}
            </a>
          ))}
          <div className="mt-4"><ELink path="links.hire" className={cn(btnPrimary, "w-full")}>Hire Me</ELink></div>
        </div>
      )}
    </header>
  );
}

export function LoginModal() {
  const { openLogin, setOpenLogin, unlock, editing } = useSite();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(false);
    try {
      const r = await verifyAdmin({ data: { password: pw } });
      if (r.ok) {
        setOk(true);
        setTimeout(() => {
          unlock(pw);
          setOpenLogin(false);
          setOk(false);
          setPw("");
        }, 700);
      } else setErr(true);
    } catch {
      setErr(true);
    }
    setBusy(false);
  };
  return (
    <Modal open={openLogin && !editing} onClose={() => setOpenLogin(false)} className={cn(err && "animate-shake")}>
      <form onSubmit={submit} className="text-center" key={err ? "e" : "n"}>
        <div className={cn("mx-auto grid h-16 w-16 place-items-center rounded-2xl", ok ? "bg-gradient-primary text-primary-foreground" : "bg-accent text-primary")}>
          {ok ? <CheckCircle2 className="h-8 w-8" /> : <Lock className="h-7 w-7" />}
        </div>
        <h3 className="mt-4 text-xl font-semibold">{ok ? "Unlocked!" : "Admin access"}</h3>
        <p className="mt-1 text-sm text-muted-foreground">Enter the password to enable edit mode.</p>
        <input type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className={cn(inputCls, "mt-5 text-center", err && "border-destructive")} />
        {err && <p className="mt-2 text-sm text-destructive">Wrong password, try again</p>}
        <button disabled={busy || !pw} className={cn(btnPrimary, "mt-5 w-full")}>{busy ? "Checking…" : "Unlock"}</button>
      </form>
    </Modal>
  );
}

export function EditToolbar() {
  const { editing, save, reset, exit, dirty, updatedAt } = useSite();
  const [saving, setSaving] = useState(false);
  if (!editing) return null;
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] flex h-9 items-center justify-center gap-3 bg-gradient-primary text-xs font-semibold text-primary-foreground">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary-foreground" /> Edit Mode ON
        <span className="hidden opacity-80 sm:inline">· Last updated: {updatedAt ? new Date(updatedAt).toLocaleString() : "never"}</span>
      </div>
      <div className="glass fixed bottom-5 right-5 z-[60] flex flex-col gap-2 rounded-2xl bg-popover/90 p-2">
        <button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await save();
            setSaving(false);
          }}
          className={cn(btnPrimary, "py-2.5", dirty && "animate-pulse")}
        >
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Changes"}
        </button>
        <button onClick={reset} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm hover:bg-accent"><RotateCcw className="h-4 w-4" /> Reset to Default</button>
        <button onClick={exit} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-destructive hover:bg-accent"><LogOut className="h-4 w-4" /> Exit Edit Mode</button>
      </div>
    </>
  );
}

export function Loader() {
  const { loading } = useSite();
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setGone(true), 500);
      return () => clearTimeout(t);
    }
  }, [loading]);
  if (gone) return null;
  return (
    <div className={cn("fixed inset-0 z-[200] grid place-items-center bg-background transition-opacity duration-500", !loading && "opacity-0")}>
      <div className="animate-loader grid h-24 w-24 place-items-center rounded-3xl bg-gradient-primary font-display text-4xl font-bold text-primary-foreground shadow-glow">MU</div>
    </div>
  );
}

export function OfflineBadge() {
  const { offline } = useSite();
  if (!offline) return null;
  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full border border-border bg-popover px-3 py-1.5 text-xs text-muted-foreground">
      <WifiOff className="h-3.5 w-3.5" /> Offline mode
    </div>
  );
}

export function ScrollExtras() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <>
      <div className="fixed left-0 top-0 z-[70] h-[3px] bg-gradient-primary" style={{ width: `${p * 100}%` }} />
      <button
        onClick={() => window.scrollTo({ top: 0 })}
        aria-label="Back to top"
        className={cn("fixed bottom-5 left-1/2 z-40 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition sm:left-auto sm:right-5 sm:translate-x-0", p > 0.08 ? "opacity-100" : "pointer-events-none opacity-0", "sm:bottom-24")}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}

export function CursorTrail() {
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const f = (e: MouseEvent) => setPts((p) => [{ x: e.clientX, y: e.clientY }, ...p].slice(0, 8));
    window.addEventListener("mousemove", f);
    return () => window.removeEventListener("mousemove", f);
  }, []);
  if (!enabled) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[300]">
      {pts.map((pt, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary"
          style={{ left: pt.x, top: pt.y, width: 10 - i, height: 10 - i, opacity: 0.8 - i * 0.09, transform: "translate(-50%,-50%)" }}
        />
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-3">
        <div>
          <Logo />
          <E as="p" path="footer.tagline" className="mt-4 block max-w-xs text-sm text-muted-foreground" multiline />
        </div>
        <div>
          <h4 className="font-semibold">Quick links</h4>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {NAV.map((n) => (
              <li key={n}><a href={`#${n.toLowerCase()}`} className="hover:text-primary">{n}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Connect</h4>
          <Socials className="mt-4" />
        </div>
      </div>
      <p className="mt-12 text-center text-xs text-muted-foreground">© 2025 Muhammad Usman. All rights reserved.</p>
    </footer>
  );
}
