import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SiteProvider } from "@/components/portfolio/store";
import { CursorTrail, EditToolbar, Footer, Loader, LoginModal, Navbar, OfflineBadge, ScrollExtras } from "@/components/portfolio/chrome";
import { About, Certifications, Contact, Education, Hero, Projects, Services, Skills, Videos } from "@/components/portfolio/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Usman — Web Developer & BS CS Student" },
      { name: "description", content: "Portfolio of Muhammad Usman, BS Computer Science student and web developer from Vehari, Pakistan." },
      { property: "og:title", content: "Muhammad Usman — Web Developer" },
      { property: "og:description", content: "Projects, skills, education and contact for Muhammad Usman, web developer from Vehari, Pakistan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteProvider>
      <Loader />
      <ScrollExtras />
      <CursorTrail />
      <EditToolbar />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Education />
        <Certifications />
        <Services />
        <Projects />
        <Videos />
        <Contact />
      </main>
      <Footer />
      <LoginModal />
      <OfflineBadge />
      <Toaster theme="dark" position="top-center" />
    </SiteProvider>
  );
}
