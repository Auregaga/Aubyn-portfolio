import Navigation from "@/src/components/layout/Navigation";
import PageTransition from "@/src/components/layout/PageTransition";
import Hero from "@/src/components/sections/Hero";
import About from "@/src/components/sections/About";
import ProjectsSection from "@/src/components/sections/Projects";
import InternshipSection from "@/src/components/sections/Internship";
import SkillsSection from "@/src/components/sections/Skills";
import LifeSection from "@/src/components/sections/Life";
import ContactSection from "@/src/components/sections/Contact";
import { portfolioData } from "@/src/data/portfolio";

export default function Home() {
  return (
    <>
      <Navigation items={portfolioData.navigation} />
      <main className="flex-1 pt-16 md:pt-20">
        <PageTransition />
        <Hero profile={portfolioData.profile} />
        {/* Hero 与 About 之间的留白：2/3 视口高度 */}
        <div className="w-full h-[66.67vh]" />
        <About profile={portfolioData.profile} />
        <ProjectsSection projects={portfolioData.showcaseProjects} />
        <InternshipSection internships={portfolioData.internships} />
        <SkillsSection skills={portfolioData.skills} />
        <LifeSection posts={portfolioData.lifePosts} />
        <ContactSection contact={portfolioData.profile.contact} />
      </main>
    </>
  );
}
