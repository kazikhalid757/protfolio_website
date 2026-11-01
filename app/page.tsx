import React from 'react';
import { getPortfolioData } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import ProductsSection from '@/components/ProductsSection';
import Services from '@/components/Services';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import AwardsCertifications from '@/components/AwardsCertifications';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import BugCursor from '@/components/BugCursor';
import Analytics from '@/components/Analytics';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <main className="min-h-screen bg-paper text-char flex flex-col">
      <Navbar profile={data.profile} />
      <Hero profile={data.profile} experiences={data.experiences} />
      <ExperienceTimeline experiences={data.experiences} />
      <ProductsSection products={data.products} />
      <Services services={data.services} />
      <SkillsSection skills={data.skills} />
      <ProjectsSection projects={data.projects} />
      <AwardsCertifications awards={data.awards} certifications={data.certifications} />
      <ContactSection profile={data.profile} />
      <Footer profile={data.profile} />
      <BugCursor />
      <Analytics />
    </main>
  );
}
