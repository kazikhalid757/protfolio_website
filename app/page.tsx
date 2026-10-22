import React from 'react';
import { getPortfolioData } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import InteractiveConsole from '@/components/InteractiveConsole';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import AwardsCertifications from '@/components/AwardsCertifications';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function Home() {
  const data = getPortfolioData() || {};

  return (
    <main className="min-h-screen bg-canvas text-ink flex flex-col">
      <Navbar profile={data.profile} />
      <Hero profile={data.profile} experiences={data.experiences} />
      <InteractiveConsole testSuites={data.interactiveTestSuites} />
      <SkillsSection skills={data.skills} />
      <ProjectsSection projects={data.projects} />
      <AwardsCertifications awards={data.awards} certifications={data.certifications} />
      <ExperienceTimeline experiences={data.experiences} />
      <ContactSection profile={data.profile} />
      <Footer profile={data.profile} />
    </main>
  );
}
