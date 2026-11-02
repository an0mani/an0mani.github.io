import Contact from "@/components/Contact";
import AppDemo from "@/components/AppDemo";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Skills />
        <Projects />
        <AppDemo />
        <Contact />
      </main>
    </>
  );
}
