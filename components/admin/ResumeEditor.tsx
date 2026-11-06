'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, CircleAlert, Check, Download, ExternalLink } from 'lucide-react';
import { ADMIN_LOGIN_EXPIRED } from '@/lib/adminPath';
import {
  RESUME_PDF_PATH,
  SECTION_HEADINGS,
  buildResumeDocument,
  checkResume,
  resolveLayout,
  resumeFileName,
  type ResumeDocument,
} from '@/lib/resume/document';
import type { Resume } from '@/lib/schemas';
import { useAdmin } from './AdminContext';
import { Field, SchemaForm } from './SchemaForm';
import SectionEditor from './SectionEditor';
import {
  resumeAwardFields,
  resumeBasicsFields,
  resumeCertificationFields,
  resumeContentFields,
  resumeEducationFields,
  resumeExperienceFields,
  resumeFields,
  resumeProjectFields,
  resumeSkillFields,
} from './schemas';
import { Button, Card } from './ui';

const TABS: { id: string; label: string; fields?: Field[] }[] = [
  { id: 'preview', label: 'Preview & ATS check' },
  { id: 'basics', label: 'Basics', fields: resumeBasicsFields },
  { id: 'summary', label: 'Summary & keywords', fields: resumeContentFields },
  { id: 'skills', label: 'Skills', fields: resumeSkillFields },
  { id: 'experience', label: 'Experience', fields: resumeExperienceFields },
  { id: 'projects', label: 'Projects', fields: resumeProjectFields },
  { id: 'education', label: 'Education', fields: resumeEducationFields },
  { id: 'extras', label: 'Certs & awards', fields: [...resumeCertificationFields, ...resumeAwardFields] },
  { id: 'layout', label: 'Section order' },
];

/** Same content and order as the PDF. Only the exact page breaks differ, so "Download draft" is the final check. */
function ResumePreview({ doc }: { doc: ResumeDocument }) {
  return (
    <div className="bg-white border border-rule px-6 py-7 sm:px-10 sm:py-9 text-[13px] leading-[1.45] text-[#1A1A1A] overflow-hidden [&_p]:text-inherit [&_h2]:[font-family:inherit] [&_h3]:[font-family:inherit]" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <h2 className="text-[26px] font-bold leading-tight" style={{ color: doc.accent }}>
        {doc.name || 'Your name'}
      </h2>
      {doc.headline && <p className="mt-0.5 text-[15px]">{doc.headline}</p>}
      <div className="mt-2 text-xs text-[#4A4A4A] break-words">
        {doc.contact.map((line, i) => (
          <p key={i}>{line.map((c) => c.text).join('  |  ')}</p>
        ))}
      </div>
      {doc.sections.map((section) => (
        <section key={section.key} className="mt-4">
          <h3 className="pb-0.5 mb-1.5 border-b text-[13px] font-bold uppercase tracking-[0.06em]" style={{ color: doc.accent, borderColor: doc.accent }}>
            {section.heading}
          </h3>
          {section.items.map((item, i) => {
            if (item.kind === 'text') return <p key={i}>{item.text}</p>;
            if (item.kind === 'skill')
              return (
                <p key={i}>
                  <strong>{item.label}:</strong> {item.text}
                </p>
              );
            return (
              <div key={i} className={i ? 'mt-2' : ''}>
                <div className="flex flex-wrap justify-between gap-x-4">
                  <strong>{item.title}</strong>
                  {item.right && <span className="text-[#4A4A4A]">{item.right}</span>}
                </div>
                {(item.meta || item.link) && (
                  <p className="break-words">
                    {item.meta && <em className="text-[#4A4A4A]">{item.meta}</em>}
                    {item.meta && item.link && <span className="text-[#4A4A4A]">{'  |  '}</span>}
                    {item.link && <span style={{ color: doc.accent }}>{item.link.text}</span>}
                  </p>
                )}
                {item.text && <p>{item.text}</p>}
                {item.bullets.length > 0 && (
                  <ul className="mt-0.5 list-disc pl-4">
                    {item.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

function AtsChecks({ resume }: { resume: Resume }) {
  const checks = useMemo(() => checkResume(resume), [resume]);
  const passed = checks.filter((c) => c.ok).length;
  return (
    <Card className="p-5">
      <p className="font-serif text-4xl leading-none text-char">
        {passed}
        <span className="text-mute text-2xl"> of {checks.length}</span>
      </p>
      <p className="mt-1.5 text-xs text-mute leading-relaxed">checks passed. These are content checks, not a score from any real ATS.</p>
      <ul className="mt-4 space-y-2.5">
        {[...checks].sort((a, b) => Number(a.ok) - Number(b.ok)).map((c) => (
          <li key={c.label} className="flex items-start gap-2 text-sm">
            {c.ok ? <Check size={16} className="mt-0.5 shrink-0 text-char" aria-label="Passed" /> : <CircleAlert size={16} className="mt-0.5 shrink-0 text-signal" aria-label="Needs attention" />}
            <span>
              <span className={c.ok ? 'text-charSoft' : 'font-medium text-char'}>{c.label}</span>
              {!c.ok && c.fix && <span className="mt-0.5 block text-xs text-mute leading-relaxed">{c.fix}</span>}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SectionOrder({ resume, onChange }: { resume: Resume; onChange: (next: Resume) => void }) {
  const layout = resolveLayout(resume);
  const update = (next: typeof layout) => onChange({ ...resume, layout: next });
  const move = (from: number, to: number) => {
    const next = [...layout];
    [next[from], next[to]] = [next[to], next[from]];
    update(next);
  };
  const iconBtn = 'grid place-items-center w-9 h-9 text-charSoft hover:bg-paperDeep disabled:opacity-30 disabled:hover:bg-transparent';
  return (
    <Card className="p-5 md:p-7">
      <p className="mb-4 text-sm text-mute leading-relaxed">Choose what prints and in which order. Headings stay standard on purpose, because parsers look for those exact words. Early in your career, projects can go above experience.</p>
      <ul className="border border-rule divide-y divide-rule bg-white">
        {layout.map((row, i) => (
          <li key={row.key} className="flex items-center gap-3 pl-4 pr-1 py-1">
            <label className="flex flex-1 min-w-0 items-center gap-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={row.visible}
                onChange={(e) => update(layout.map((l, idx) => (idx === i ? { ...l, visible: e.target.checked } : l)))}
                className="h-5 w-5 accent-[#FF4F1F]"
              />
              <span className={`truncate text-sm font-semibold ${row.visible ? 'text-char' : 'text-mute line-through'}`}>{SECTION_HEADINGS[row.key]}</span>
            </label>
            <button type="button" className={iconBtn} disabled={i === 0} onClick={() => move(i, i - 1)} aria-label={`Move ${SECTION_HEADINGS[row.key]} up`}>
              <ArrowUp size={16} />
            </button>
            <button type="button" className={iconBtn} disabled={i === layout.length - 1} onClick={() => move(i, i + 1)} aria-label={`Move ${SECTION_HEADINGS[row.key]} down`}>
              <ArrowDown size={16} />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ResumeWorkspace({ draft, setDraft, showErrors }: { draft: Resume; setDraft: (next: Resume) => void; showErrors: boolean }) {
  const { toast } = useAdmin();
  const [tab, setTab] = useState('preview');
  const [downloading, setDownloading] = useState(false);
  const doc = useMemo(() => buildResumeDocument(draft), [draft]);
  const current = TABS.find((t) => t.id === tab);

  const downloadDraft = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/admin/resume/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: draft }),
      });
      if (res.status === 401) {
        window.location.href = ADMIN_LOGIN_EXPIRED;
        return;
      }
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        toast([json.error || 'The PDF could not be built.', ...(json.details ?? []).slice(0, 2)].join(' '), 'error');
        return;
      }
      const pages = Number(res.headers.get('X-Resume-Pages') || 0);
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement('a');
      a.href = url;
      a.download = resumeFileName(draft);
      a.click();
      URL.revokeObjectURL(url);
      if (pages > 2) toast(`Downloaded, but it runs to ${pages} pages. Two is the usual limit, so consider trimming.`, 'error');
      else toast(`Draft downloaded (${pages} ${pages === 1 ? 'page' : 'pages'}).`);
    } catch {
      toast('The PDF could not be built. Check your connection and try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1 border-b border-rule" role="tablist" aria-label="Resume sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px h-10 px-3 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-signal text-char' : 'border-transparent text-mute hover:text-char'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_17rem] gap-5 items-start">
          <ResumePreview doc={doc} />
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button onClick={downloadDraft} busy={downloading}>
                <Download size={15} aria-hidden /> Download draft PDF
              </Button>
              <a
                href={RESUME_PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 border border-char bg-white text-sm font-medium text-char hover:bg-char hover:text-paper transition-colors"
              >
                <ExternalLink size={15} aria-hidden /> Live version (last saved)
              </a>
              <p className="text-xs text-mute leading-relaxed">
                Share this link with recruiters: <span className="font-mono text-char">{RESUME_PDF_PATH}</span> after your site address.
              </p>
            </div>
            <AtsChecks resume={draft} />
          </div>
        </div>
      )}

      {tab === 'layout' && <SectionOrder resume={draft} onChange={setDraft} />}

      {current?.fields && (
        <Card className="p-5 md:p-7">
          <SchemaForm key={current.id} fields={current.fields} value={draft} onChange={setDraft} showErrors={showErrors} />
        </Card>
      )}
    </div>
  );
}

export default function ResumeEditor() {
  return (
    <SectionEditor
      section="resume"
      kind="object"
      fields={resumeFields}
      renderForm={({ draft, setDraft, showErrors }) => <ResumeWorkspace draft={draft} setDraft={setDraft} showErrors={showErrors} />}
    />
  );
}
