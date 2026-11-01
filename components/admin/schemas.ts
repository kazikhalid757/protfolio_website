import type { Field } from './SchemaForm';

/**
 * One schema per section, listing exactly the fields the public website displays.
 * Fields that are not listed here (old ids, icons, levels, ...) are kept untouched in the data.
 */

const newId = (prefix: string) => `${prefix}-${Date.now()}`;

export const profileFields: Field[] = [
  { type: 'text', key: 'name', label: 'Full name', required: true, help: 'Shown in the footer and search results.' },
  { type: 'text', key: 'shortName', label: 'Short name', help: 'The nav wordmark and the hero greeting use this, e.g. "Kazi Tamim".' },
  { type: 'text', key: 'title', label: 'Job title', placeholder: 'QA & Automation Engineer' },
  { type: 'text', key: 'tagline', label: 'Tagline', help: 'The big line under the hero heading.' },
  { type: 'textarea', key: 'bio', label: 'Short bio', rows: 5, help: 'The paragraph under the tagline, and the search-engine description.' },
  { type: 'email', key: 'email', label: 'Email', required: true },
  { type: 'tel', key: 'phone', label: 'Phone', help: 'Optional. Shown in the contact section.' },
  { type: 'text', key: 'location', label: 'Location' },
  { type: 'url', key: 'avatar', label: 'Photo', placeholder: '/images/kazi-tamim.jpg', help: 'A path inside /public (like /images/me.jpg) or a full https:// image URL.' },
  { type: 'url', key: 'resumeUrl', label: 'CV / resume link', help: 'The "Download CV" button. Leave empty to hide it.' },
  { type: 'url', key: 'siteUrl', label: 'Website address', placeholder: 'https://yourname.dev', help: 'Used for SEO tags and the sitemap. On Vercel it falls back to your production URL.' },
  { type: 'boolean', key: 'availableForHire', label: 'Show "available for work" badge' },
  { type: 'text', key: 'availabilityStatus', label: 'Availability text', placeholder: 'Available for Full-time Roles & Contracts' },
  {
    type: 'group',
    key: 'seo',
    label: 'Search & social (SEO)',
    help: 'What Google and social networks show for your site. Leave empty to use your name, title and bio automatically.',
    fields: [
      { type: 'text', key: 'title', label: 'Page title', placeholder: 'Your Name | QA Automation Engineer', help: 'Aim for about 50 to 60 characters, with your name first.' },
      { type: 'textarea', key: 'description', label: 'Search description', rows: 3, help: 'Aim for 120 to 160 characters. Mention your name, role, city and main skills.' },
      { type: 'tags', key: 'keywords', label: 'Keywords', help: 'Roles and tools people search for: QA engineer, Playwright, API testing, SDET, ...' },
    ],
  },
  {
    type: 'group',
    key: 'metrics',
    label: 'Hero numbers',
    help: 'The four big figures under the hero.',
    fields: [
      { type: 'text', key: 'yearsExperience', label: 'Years in QA', placeholder: '3+' },
      { type: 'text', key: 'saasProducts', label: 'SaaS products tested', placeholder: '5' },
      { type: 'text', key: 'automationRepos', label: 'Automation repos', placeholder: '10' },
      { type: 'text', key: 'googleVrpAwards', label: 'Google VRP awards', placeholder: '2' },
    ],
  },
  {
    type: 'group',
    key: 'socials',
    label: 'Social links',
    fields: [
      { type: 'url', key: 'linkedin', label: 'LinkedIn' },
      { type: 'url', key: 'github', label: 'GitHub' },
      { type: 'url', key: 'upwork', label: 'Upwork' },
      { type: 'url', key: 'bughunters', label: 'Google Bug Hunters' },
    ],
  },
];

export const experienceFields: Field[] = [
  { type: 'text', key: 'role', label: 'Role', required: true },
  { type: 'text', key: 'company', label: 'Company', required: true },
  { type: 'text', key: 'location', label: 'Location' },
  { type: 'text', key: 'period', label: 'Period', required: true, placeholder: 'Sep 2025 – Present', help: 'Include the word "Present" to mark your current job.' },
  { type: 'text', key: 'type', label: 'Employment type', placeholder: 'Full-Time (Remote)' },
  { type: 'text', key: 'product', label: 'Product you worked on', placeholder: 'Oppora.ai', help: 'Shown in the hero as "testing …" for your current job.' },
  { type: 'textarea', key: 'summary', label: 'One-line summary', rows: 2 },
  { type: 'lines', key: 'highlights', label: 'What you did', rows: 5, help: 'One bullet per line. Put manual testing first.' },
  { type: 'tags', key: 'techStack', label: 'Tools & tech', help: 'Press Enter or comma after each one. The first tag shows first.' },
];
export const experienceItem = {
  itemTitle: (e: any) => e.role,
  itemSubtitle: (e: any) => [e.company, e.period].filter(Boolean).join(' · '),
  blank: () => ({ id: newId('exp'), role: '', company: '', location: '', period: '', type: '', summary: '', highlights: [], techStack: ['Manual Testing'] }),
};

export const productFields: Field[] = [
  { type: 'text', key: 'name', label: 'Name', required: true },
  { type: 'select', key: 'kind', label: 'Your role', options: ['Built by me', 'QA on the team'], help: '"Built by me" gets the dark card.' },
  { type: 'text', key: 'tagline', label: 'Tagline' },
  { type: 'text', key: 'role', label: 'Role line', placeholder: 'QA & automation, SoftStandard Solutions' },
  { type: 'url', key: 'url', label: 'Website', help: 'Leave empty for private products.' },
  { type: 'textarea', key: 'problem', label: 'The problem', rows: 3 },
  { type: 'textarea', key: 'built', label: 'What you built / did', rows: 3 },
  { type: 'lines', key: 'stats', label: 'Key facts', help: 'One per line, e.g. "25 audit engines".' },
  { type: 'tags', key: 'stack', label: 'Tools & tech' },
];
export const productItem = {
  itemTitle: (p: any) => p.name,
  itemSubtitle: (p: any) => [p.kind, p.url?.replace(/^https?:\/\//, '')].filter(Boolean).join(' · '),
  blank: () => ({ id: newId('prod'), kind: 'QA on the team', name: '', url: '', tagline: '', role: '', problem: '', built: '', stats: [], stack: ['Manual testing'] }),
};

export const serviceFields: Field[] = [
  { type: 'text', key: 'title', label: 'Service', required: true },
  { type: 'textarea', key: 'summary', label: 'Summary', rows: 2 },
  { type: 'lines', key: 'deliverables', label: 'What clients get', help: 'One per line.' },
  { type: 'url', key: 'hireUrl', label: '"Hire me" link', help: 'Where the button goes, e.g. your Upwork profile.' },
];
export const serviceItem = {
  itemTitle: (s: any) => s.title,
  itemSubtitle: (s: any) => s.summary,
  blank: () => ({ id: newId('srv'), title: '', summary: '', deliverables: [], hireUrl: '' }),
};

export const skillCategoryFields: Field[] = [
  { type: 'text', key: 'category', label: 'Group name', required: true, placeholder: 'Manual Testing' },
  {
    type: 'list',
    key: 'items',
    label: 'Skills',
    addLabel: 'Add skill',
    itemTitle: (i: any) => i.name,
    blank: () => ({ name: '', experience: '' }),
    fields: [
      { type: 'text', key: 'name', label: 'Skill', required: true },
      { type: 'text', key: 'experience', label: 'Experience', placeholder: '3 yrs' },
    ],
  },
];
export const skillItem = {
  itemTitle: (c: any) => c.category,
  itemSubtitle: (c: any) => `${(c.items || []).length} skills`,
  blank: () => ({ category: '', items: [] }),
};

export const projectFields: Field[] = [
  { type: 'text', key: 'title', label: 'Title', required: true },
  { type: 'textarea', key: 'description', label: 'Description', rows: 3 },
  { type: 'text', key: 'metrics', label: 'Result line', placeholder: '65% faster builds | 100% automated', help: 'Shown in monospace under the description.' },
  { type: 'tags', key: 'tags', label: 'Tags' },
  { type: 'url', key: 'github', label: 'GitHub link', help: 'The whole row links here.' },
  { type: 'url', key: 'liveDemo', label: 'Live demo link', help: 'Used only if there is no GitHub link.' },
];
export const projectItem = {
  itemTitle: (p: any) => p.title,
  itemSubtitle: (p: any) => (p.tags || []).slice(0, 4).join(', '),
  blank: () => ({ id: newId('proj'), title: '', description: '', metrics: '', tags: [], github: '', liveDemo: '', category: '', featured: false }),
};

export const awardFields: Field[] = [
  { type: 'text', key: 'title', label: 'Award', required: true },
  { type: 'text', key: 'issuer', label: 'Given by', required: true },
  { type: 'text', key: 'date', label: 'Date', placeholder: 'August 2025' },
  { type: 'textarea', key: 'description', label: 'Description', rows: 3 },
  { type: 'url', key: 'verifyUrl', label: 'Verify link' },
];
export const awardItem = {
  itemTitle: (a: any) => a.title,
  itemSubtitle: (a: any) => [a.issuer, a.date].filter(Boolean).join(' · '),
  blank: () => ({ id: newId('award'), title: '', issuer: '', date: '', description: '', verifyUrl: '' }),
};

export const certificationFields: Field[] = [
  { type: 'text', key: 'title', label: 'Certificate', required: true },
  { type: 'text', key: 'issuer', label: 'Issued by', required: true, placeholder: 'Coursera' },
  { type: 'text', key: 'date', label: 'Date', placeholder: 'Jan 2023' },
  { type: 'tags', key: 'skills', label: 'Skills covered' },
  { type: 'url', key: 'verifyUrl', label: 'Verify link', help: 'The certificate page that proves it is real.' },
];
export const certificationItem = {
  itemTitle: (c: any) => c.title,
  itemSubtitle: (c: any) => [c.issuer, c.date].filter(Boolean).join(' · '),
  blank: () => ({ id: newId('cert'), title: '', issuer: '', date: '', skills: [], verifyUrl: '', image: '' }),
};
