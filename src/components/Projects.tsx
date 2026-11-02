import ProjectCard from "@/components/ProjectCard";
import Section from "@/components/Section";
import { projects } from "@/data/profile";

export default function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title="만들고 있는 것들">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}
