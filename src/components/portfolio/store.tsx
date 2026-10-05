import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { defaultContent, mergeContent, type SiteContent } from "@/lib/content";
import { saveSiteContent } from "@/lib/site.functions";

type Ctx = {
  content: SiteContent;
  loading: boolean;
  offline: boolean;
  editing: boolean;
  dirty: boolean;
  updatedAt: string | null;
  set: (path: string, value: unknown) => void;
  update: (fn: (c: SiteContent) => SiteContent) => void;
  unlock: (pw: string) => void;
  save: () => Promise<void>;
  reset: () => void;
  exit: () => void;
  openLogin: boolean;
  setOpenLogin: (v: boolean) => void;
};

const SiteCtx = createContext<Ctx | null>(null);
export const useSite = () => {
  const c = useContext(SiteCtx);
  if (!c) throw new Error("useSite outside provider");
  return c;
};

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o == null ? o : (o as Record<string, unknown>)[k]), obj);
}

function setPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone = (o: unknown) => (Array.isArray(o) ? [...o] : { ...(o as object) });
  const root = clone(obj) as Record<string, unknown>;
  let cur = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const next = clone(cur[keys[i]]) as Record<string, unknown>;
    cur[keys[i]] = next;
    cur = next;
  }
  cur[keys[keys.length - 1]] = value;
  return root as T;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [openLogin, setOpenLogin] = useState(false);
  const pw = useRef("");
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;

  useEffect(() => {
    let alive = true;
    supabase
      .from("site_data")
      .select("content, updated_at")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setOffline(true);
        else if (data) {
          setContent(mergeContent(data.content));
          setUpdatedAt(data.updated_at);
        }
        setLoading(false);
      });
    const ch = supabase
      .channel("site_data_sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_data" }, (p) => {
        const row = p.new as { content?: unknown; updated_at?: string };
        if (row?.content && !dirtyRef.current) {
          setContent(mergeContent(row.content));
          setUpdatedAt(row.updated_at ?? null);
        }
      })
      .subscribe();
    return () => {
      alive = false;
      supabase.removeChannel(ch);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        if (!editing) setOpenLogin(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing]);

  const set = useCallback((path: string, value: unknown) => {
    setContent((c) => setPath(c, path, value));
    setDirty(true);
  }, []);
  const update = useCallback((fn: (c: SiteContent) => SiteContent) => {
    setContent(fn);
    setDirty(true);
  }, []);

  const save = async () => {
    try {
      const r = await saveSiteContent({ data: { password: pw.current, content: content as never } });
      setUpdatedAt(r.updated_at);
      setDirty(false);
      toast.success("Saved successfully! Visible to everyone.");
    } catch (e) {
      toast.error("Save failed: " + (e instanceof Error ? e.message : "unknown error"));
    }
  };

  const reset = () => {
    if (!confirm("Reset all content to default? (Click Save to publish the reset.)")) return;
    setContent(defaultContent);
    setDirty(true);
  };

  const exit = () => {
    if (dirty && !confirm("You have unsaved changes. Exit anyway?")) return;
    setEditing(false);
    pw.current = "";
    if (dirty) {
      supabase
        .from("site_data")
        .select("content")
        .eq("id", 1)
        .maybeSingle()
        .then(({ data }) => setContent(data ? mergeContent(data.content) : defaultContent));
      setDirty(false);
    }
  };

  return (
    <SiteCtx.Provider
      value={{
        content,
        loading,
        offline,
        editing,
        dirty,
        updatedAt,
        set,
        update,
        unlock: (p) => {
          pw.current = p;
          setEditing(true);
        },
        save,
        reset,
        exit,
        openLogin,
        setOpenLogin,
      }}
    >
      {children}
    </SiteCtx.Provider>
  );
}
