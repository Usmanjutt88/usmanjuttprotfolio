import { useEffect, useRef, useState } from "react";
import { ArrowRight, Award, Briefcase, Download, ExternalLink, GraduationCap, Mail, MapPin, MessageCircle, Play, Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSite } from "./store";
import { AddButton, DynIcon, E, EditImage, ELink, IconPicker, ItemControls, Modal, Reveal, SectionHead, btnGhost, btnPrimary, inputCls, move } from "./editable";
import { GithubIcon, Socials } from "./chrome";
import { convertDriveVideoLink, uid, type Project } from "@/lib/content";
import { cn } from "@/lib/utils";

const Section = ({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={cn("scroll-mt-24 px-5 py-24 md:py-32", className)}>
    <div className="mx-auto max-w-7xl">{children}</div>
  </section>
);
const card = "glass relative rounded-2xl p-6 transition duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-glow";

/* ---------------- Hero ---------------- */
function Typing({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [t, setT] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i % words.length] ?? "";
    const id = setTimeout(
      () => {
        if (!del) {
          setT(w.slice(0, t.length + 1));
          if (t.length + 1 === w.length) setTimeout(() => setDel(true), 1400);
        } else {
          setT(w.slice(0, t.length - 1));
          if (t.length - 1 === 0) {
            setDel(false);
            setI((x) => x + 1);
          }
        }
      },
      del ? 45 : 90,
    );
    return () => clearTimeout(id);
  }, [t, del, i, words]);
  return (
    <span className="text-gradient">
      {t}
      <span className="animate-caret ml-0.5 inline-block w-[3px] bg-primary align-middle" style={{ height: "0.9em" }} />
    </span>
  );
}

export function Hero() {
  const { content, editing } = useSite();
  const words = content.hero.roles.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-5 pt-28 pb-16">
      <div className="animate-blob pointer-events-none absolute -left-32 top-10 h-[480px] w-[480px] bg-gradient-primary opacity-25 blur-3xl" />
      <div className="animate-blob pointer-events-none absolute -right-20 bottom-0 h-[380px] w-[380px] bg-primary opacity-15 blur-3xl [animation-delay:-6s]" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Available for opportunities
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            <E path="hero.greeting" /> <br />
            <E path="hero.name" className="text-gradient" />
          </h1>
          <div className="mt-5 h-10 text-2xl font-semibold sm:text-3xl">
            {editing ? <E path="hero.roles" className="text-base text-primary" /> : <Typing words={words.length ? words : ["Developer"]} />}
          </div>
          <E as="p" path="hero.intro" multiline className="mt-6 block max-w-xl text-lg leading-relaxed text-muted-foreground" />
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#projects" className={btnPrimary}>View My Work <ArrowRight className="h-4 w-4" /></a>
            <ELink path="links.cv" hideIfEmpty={false} className={btnGhost}><Download className="h-4 w-4" /> Download CV</ELink>
          </div>
          <Socials className="mt-9" />
        </Reveal>
        <Reveal delay={150} className="mx-auto">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-gradient-primary opacity-60 blur-2xl" />
            <div className="relative rounded-full bg-gradient-primary p-1.5 shadow-glow">
              <EditImage path="hero.avatar" alt="Muhammad Usman" className="h-64 w-64 rounded-full bg-background sm:h-80 sm:w-80" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */
export function About() {
  const { content, update } = useSite();
  return (
    <Section id="about">
      <SectionHead eyebrow="About me" title="Who I am" />
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -inset-4 -rotate-3 rounded-3xl bg-gradient-primary opacity-30" />
            <EditImage path="about.photo" alt="About Muhammad Usman" className="relative aspect-[4/5] rounded-3xl border border-border bg-card" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <E as="h3" path="about.title" className="block text-2xl font-bold sm:text-3xl" />
          <E as="p" path="about.bio" multiline className="mt-5 block leading-relaxed text-muted-foreground" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {content.about.stats.map((s, i) => (
              <div key={s.id} className={cn(card, "p-5 text-center")}>
                <ItemControls onDelete={() => update((c) => ({ ...c, about: { ...c.about, stats: c.about.stats.filter((x) => x.id !== s.id) } }))} />
                <E as="div" path={`about.stats.${i}.value`} className="block font-display text-3xl font-bold text-gradient" />
                <E as="div" path={`about.stats.${i}.label`} className="mt-1 block text-xs uppercase tracking-wider text-muted-foreground" />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <AddButton label="Add Stat" onClick={() => update((c) => ({ ...c, about: { ...c.about, stats: [...c.about.stats, { id: uid(), value: "0", label: "Label" }] } }))} />
          </div>
          <div className="mt-8"><ELink path="links.talk" className={btnPrimary}>Let's Talk <MessageCircle className="h-4 w-4" /></ELink></div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------------- Skills ---------------- */
export function Skills() {
  const { content, update } = useSite();
  return (
    <Section id="skills" className="bg-card/30">
      <SectionHead eyebrow="Skills" title="What I work with" sub="A toolkit built through coursework, projects and curiosity." />
      <div className="space-y-14">
        {content.skills.map((g, gi) => (
          <div key={g.id}>
            <Reveal><E as="h3" path={`skills.${gi}.title`} className="mb-6 block text-xl font-semibold text-primary" /></Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {g.items.map((s, si) => (
                <Reveal key={s.id} delay={si * 40}>
                  <div className={cn(card, "flex h-full items-center gap-4 p-5")}>
                    <ItemControls
                      onDelete={() => update((c) => { const sk = [...c.skills]; sk[gi] = { ...g, items: g.items.filter((x) => x.id !== s.id) }; return { ...c, skills: sk }; })}
                      onUp={() => update((c) => { const sk = [...c.skills]; sk[gi] = { ...g, items: move(g.items, si, -1) }; return { ...c, skills: sk }; })}
                    />
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"><DynIcon name={s.icon} className="h-5 w-5" /></div>
                    <div className="min-w-0">
                      <E path={`skills.${gi}.items.${si}.name`} className="block text-sm font-medium" />
                      <IconPicker path={`skills.${gi}.items.${si}.icon`} />
                    </div>
                  </div>
                </Reveal>
              ))}
              <AddButton label="Add Skill" onClick={() => update((c) => { const sk = [...c.skills]; sk[gi] = { ...g, items: [...g.items, { id: uid(), name: "New skill", icon: "Code2" }] }; return { ...c, skills: sk }; })} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Education + Experience ---------------- */
export function Education() {
  const { content, update } = useSite();
  return (
    <Section id="education">
      <SectionHead eyebrow="Journey" title="Education & Experience" />
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold"><GraduationCap className="h-6 w-6 text-primary" /> Education</h3>
          <div className="relative space-y-6 border-l border-primary/30 pl-8">
            {content.education.map((e, i) => (
              <Reveal key={e.id} delay={i * 80}>
                <div className={card}>
                  <span className="absolute -left-[41px] top-7 h-4 w-4 rounded-full bg-gradient-primary shadow-glow" />
                  <ItemControls onDelete={() => update((c) => ({ ...c, education: c.education.filter((x) => x.id !== e.id) }))} onUp={() => update((c) => ({ ...c, education: move(c.education, i, -1) }))} />
                  <E as="h4" path={`education.${i}.degree`} className="block text-lg font-semibold" />
                  <E as="p" path={`education.${i}.school`} className="mt-1 block text-muted-foreground" />
                  <E as="p" path={`education.${i}.meta`} className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary" />
                </div>
              </Reveal>
            ))}
            <AddButton label="Add Education" onClick={() => update((c) => ({ ...c, education: [...c.education, { id: uid(), degree: "Degree", school: "Institute", meta: "Year" }] }))} />
          </div>
        </div>
        <div>
          <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold"><Briefcase className="h-6 w-6 text-primary" /> Work Experience</h3>
          <div className="relative space-y-6 border-l border-primary/30 pl-8">
            {content.experience.map((e, i) => (
              <Reveal key={e.id} delay={i * 80}>
                <div className={card}>
                  <span className="absolute -left-[41px] top-7 h-4 w-4 rounded-full bg-gradient-primary shadow-glow" />
                  <ItemControls onDelete={() => update((c) => ({ ...c, experience: c.experience.filter((x) => x.id !== e.id) }))} onUp={() => update((c) => ({ ...c, experience: move(c.experience, i, -1) }))} />
                  <E as="p" path={`experience.${i}.dates`} className="block text-xs font-medium uppercase tracking-wider text-primary" />
                  <E as="h4" path={`experience.${i}.title`} className="mt-2 block text-lg font-semibold" />
                  <E as="p" path={`experience.${i}.org`} className="mt-1 block text-muted-foreground" />
                  <E as="p" path={`experience.${i}.description`} multiline className="mt-3 block text-sm leading-relaxed text-muted-foreground" />
                </div>
              </Reveal>
            ))}
            <AddButton label="Add Experience" onClick={() => update((c) => ({ ...c, experience: [...c.experience, { id: uid(), title: "Role", org: "Organization", dates: "Dates", description: "Description" }] }))} />
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- Certifications + Services ---------------- */
export function Certifications() {
  const { content, update } = useSite();
  return (
    <Section id="certifications" className="bg-card/30">
      <SectionHead eyebrow="Certifications" title="Credentials earned" />
      <div className="grid gap-5 md:grid-cols-3">
        {content.certifications.map((c, i) => (
          <Reveal key={c.id} delay={i * 80}>
            <div className={cn(card, "h-full border-l-4 border-l-primary")}>
              <ItemControls onDelete={() => update((s) => ({ ...s, certifications: s.certifications.filter((x) => x.id !== c.id) }))} onUp={() => update((s) => ({ ...s, certifications: move(s.certifications, i, -1) }))} />
              <Award className="h-9 w-9 text-primary" />
              <E as="h4" path={`certifications.${i}.title`} className="mt-4 block text-lg font-semibold" />
              <E as="p" path={`certifications.${i}.issuer`} className="mt-1 block text-sm text-muted-foreground" />
            </div>
          </Reveal>
        ))}
        <AddButton label="Add Certification" onClick={() => update((s) => ({ ...s, certifications: [...s.certifications, { id: uid(), title: "Certificate", issuer: "Issuer" }] }))} />
      </div>
    </Section>
  );
}

export function Services() {
  const { content, update } = useSite();
  return (
    <Section id="services">
      <SectionHead eyebrow="Services" title="How I can help" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {content.services.map((s, i) => (
          <Reveal key={s.id} delay={i * 80}>
            <div className={cn(card, "group h-full p-7")}>
              <ItemControls onDelete={() => update((c) => ({ ...c, services: c.services.filter((x) => x.id !== s.id) }))} onUp={() => update((c) => ({ ...c, services: move(c.services, i, -1) }))} />
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow transition group-hover:rotate-6"><DynIcon name={s.icon} className="h-6 w-6" /></div>
              <IconPicker path={`services.${i}.icon`} />
              <E as="h4" path={`services.${i}.title`} className="mt-5 block text-lg font-semibold" />
              <E as="p" path={`services.${i}.description`} multiline className="mt-2 block text-sm leading-relaxed text-muted-foreground" />
            </div>
          </Reveal>
        ))}
        <AddButton label="Add Service" onClick={() => update((c) => ({ ...c, services: [...c.services, { id: uid(), title: "Service", description: "Description", icon: "Code2" }] }))} />
      </div>
    </Section>
  );
}

/* ---------------- Projects ---------------- */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="h-full transition-transform duration-200"
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        ref.current!.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      }}
      onMouseLeave={() => (ref.current!.style.transform = "")}
    >
      {children}
    </div>
  );
}

const CATS = ["All", "Web", "Programming", "AI"] as const;

export function Projects() {
  const { content, update, editing, set } = useSite();
  const [f, setF] = useState<(typeof CATS)[number]>("All");
  const list = content.projects.map((p, i) => ({ p, i })).filter(({ p }) => editing || f === "All" || p.category === f);
  return (
    <Section id="projects" className="bg-card/30">
      <SectionHead eyebrow="Portfolio" title="Featured projects" />
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setF(c)} className={cn("rounded-full px-5 py-2 text-sm font-medium transition", f === c ? "bg-gradient-primary text-primary-foreground shadow-glow" : "border border-border text-muted-foreground hover:border-primary hover:text-primary")}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map(({ p, i }) => (
          <Reveal key={p.id}>
            <TiltCard>
              <article className="glass relative flex h-full flex-col overflow-hidden rounded-2xl transition hover:border-primary/40 hover:shadow-glow">
                <ItemControls onDelete={() => update((c) => ({ ...c, projects: c.projects.filter((x) => x.id !== p.id) }))} onUp={() => update((c) => ({ ...c, projects: move(c.projects, i, -1) }))} />
                <EditImage path={`projects.${i}.image`} alt={p.title} className="aspect-video bg-accent" />
                <div className="flex flex-1 flex-col p-6">
                  {editing ? (
                    <select value={p.category} onChange={(e) => set(`projects.${i}.category`, e.target.value as Project["category"])} className={cn(inputCls, "mb-3 py-1.5")}>
                      {CATS.slice(1).map((c) => <option key={c}>{c}</option>)}
                    </select>
                  ) : (
                    <span className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</span>
                  )}
                  <E as="h3" path={`projects.${i}.title`} className="block text-xl font-semibold" />
                  <E as="p" path={`projects.${i}.description`} multiline className="mt-2 block flex-1 text-sm leading-relaxed text-muted-foreground" />
                  {editing ? (
                    <E as="p" path={`projects.${i}.tags`} className="mt-4 block text-xs text-primary" />
                  ) : (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                        <span key={t} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <ELink path={`projects.${i}.demo`} hideIfEmpty={false} className={cn(btnPrimary, "px-4 py-2")}><ExternalLink className="h-4 w-4" /> Live Demo</ELink>
                    <ELink path={`projects.${i}.github`} hideIfEmpty={false} className={cn(btnGhost, "px-4 py-2")}><GithubIcon className="h-4 w-4" /> GitHub</ELink>
                  </div>
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
        <AddButton label="Add Project" onClick={() => update((c) => ({ ...c, projects: [...c.projects, { id: uid(), title: "New project", description: "Description", image: "", tags: "Tag", category: "Web", demo: "", github: "" }] }))} />
      </div>
    </Section>
  );
}

/* ---------------- Videos ---------------- */
export function Videos() {
  const { content, update, editing } = useSite();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", url: "" });
  const [playing, setPlaying] = useState<string | null>(null);
  const embed = convertDriveVideoLink(form.url.trim());
  if (!editing && content.videos.length === 0) return null;
  return (
    <Section id="videos">
      <SectionHead eyebrow="Showcase" title="Video highlights" sub="Walkthroughs and demos of my work." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {content.videos.map((v, i) => (
          <Reveal key={v.id}>
            <div className="glass relative overflow-hidden rounded-2xl transition hover:shadow-glow">
              {editing && (
                <button onClick={() => update((c) => ({ ...c, videos: c.videos.filter((x) => x.id !== v.id) }))} className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-lg bg-destructive text-destructive-foreground" aria-label="Delete video">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <div className="relative aspect-video bg-accent">
                {playing === v.id ? (
                  <iframe src={v.url} title={v.title} allow="autoplay; fullscreen" allowFullScreen className="h-full w-full" />
                ) : (
                  <button onClick={() => setPlaying(v.id)} className="group grid h-full w-full place-items-center bg-gradient-to-br from-accent to-background" aria-label={`Play ${v.title}`}>
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition group-hover:scale-110"><Play className="ml-1 h-7 w-7" /></span>
                  </button>
                )}
              </div>
              <div className="p-5">
                <E as="h3" path={`videos.${i}.title`} className="block font-semibold" />
                <E as="p" path={`videos.${i}.description`} multiline className="mt-1 block text-sm text-muted-foreground" />
              </div>
            </div>
          </Reveal>
        ))}
        {editing && (
          <button onClick={() => { setForm({ title: "", description: "", url: "" }); setOpen(true); }} className="flex min-h-48 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/50 text-sm font-semibold text-primary hover:bg-primary/10">
            <Plus className="h-4 w-4" /> Add Video
          </button>
        )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} className="max-w-lg">
        <h3 className="text-lg font-semibold">Add video</h3>
        <div className="mt-4 space-y-3">
          <input className={inputCls} placeholder="Video title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className={inputCls} placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className={inputCls} placeholder="Google Drive video link" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <p className="text-xs text-muted-foreground">Drive → Share → Anyone with link → Copy link.</p>
          {embed && /^https:\/\//.test(embed) && <iframe src={embed} title="Preview" className="aspect-video w-full rounded-xl" allow="autoplay" />}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setOpen(false)}>Cancel</button>
          <button
            disabled={!form.title || !/^https:\/\//.test(embed)}
            className={btnPrimary}
            onClick={() => {
              update((c) => ({ ...c, videos: [...c.videos, { id: uid(), title: form.title, description: form.description, url: embed }] }));
              setOpen(false);
            }}
          >
            Save
          </button>
        </div>
      </Modal>
    </Section>
  );
}

/* ---------------- Contact ---------------- */
export function Contact() {
  const { content } = useSite();
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const to = content.contact.email.trim();
    const body = `${f.message}\n\n— ${f.name} (${f.email})`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(f.subject || "Portfolio enquiry")}&body=${encodeURIComponent(body)}`;
    toast.success("Opening your email app…");
  };
  const info = [
    { icon: MessageCircle, label: "WhatsApp", path: "contact.phone" },
    { icon: Mail, label: "Email", path: "contact.email" },
    { icon: MapPin, label: "Location", path: "contact.location" },
  ];
  return (
    <Section id="contact" className="bg-card/30">
      <SectionHead eyebrow="Contact" title="Let's build something together" sub="Have a project or opportunity in mind? I'd love to hear about it." />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="space-y-4">
          {info.map((x) => (
            <div key={x.label} className={cn(card, "flex items-center gap-4")}>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"><x.icon className="h-5 w-5" /></div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{x.label}</p>
                <E path={x.path} className="block truncate font-medium" />
              </div>
            </div>
          ))}
          <Socials className="pt-4" />
        </Reveal>
        <Reveal delay={100}>
          <form onSubmit={submit} className="glass space-y-4 rounded-2xl p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <input required className={inputCls} placeholder="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
              <input required type="email" className={inputCls} placeholder="Your email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            </div>
            <input className={inputCls} placeholder="Subject" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} />
            <textarea required rows={6} className={inputCls} placeholder="Your message" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
            <button className={cn(btnPrimary, "w-full sm:w-auto")}>Send Message <Send className="h-4 w-4" /></button>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
