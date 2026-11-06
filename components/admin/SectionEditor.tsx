'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Check, History, RotateCcw, Save } from 'lucide-react';
import type { SectionName } from '@/lib/schemas';
import { useAdmin } from './AdminContext';
import { Button, Card, Spinner } from './ui';
import HistoryDialog from './HistoryDialog';
import { Field, ListEditor, SchemaForm, collectErrors } from './SchemaForm';

interface SectionEditorProps {
  /** Which content section this edits, e.g. "experiences". */
  section: SectionName;
  fields: Field[];
  /** "object" edits one record (profile); "list" edits an ordered list of records. */
  kind: 'object' | 'list';
  itemTitle?: (item: any) => string;
  itemSubtitle?: (item: any) => string;
  blank?: () => any;
  addLabel?: string;
  emptyHint?: string;
  /** Replaces the standard form when a section needs its own layout (object sections only). */
  renderForm?: (props: { draft: any; setDraft: (next: any) => void; showErrors: boolean }) => React.ReactNode;
}

const same = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

export default function SectionEditor({
  section,
  fields,
  kind,
  itemTitle = () => '',
  itemSubtitle,
  blank = () => ({}),
  addLabel,
  emptyHint,
  renderForm,
}: SectionEditorProps) {
  const { data, versions, loading, error, saveSection, reload, setDirty, toast, confirm } = useAdmin();
  const saved = data?.[section] ?? (kind === 'list' ? [] : {});
  const [draft, setDraft] = useState<any>(saved);
  const [saving, setSaving] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Take the server copy whenever it changes (first load, or after a save).
  useEffect(() => {
    if (data) setDraft(data[section] ?? (kind === 'list' ? [] : {}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.[section]]);

  const dirty = !same(draft, saved);
  useEffect(() => {
    setDirty(section, dirty);
    return () => setDirty(section, false);
  }, [dirty, section, setDirty]);

  const problems = useMemo(() => {
    if (kind === 'object') return collectErrors(fields, draft);
    return (draft as any[]).flatMap((item, i) =>
      collectErrors(fields, item, `#${i + 1} ${itemTitle(item) || 'Untitled'} › `)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, fields, kind]);

  const save = async () => {
    setAttempted(true);
    if (problems.length) {
      toast(`Fix ${problems.length} problem${problems.length > 1 ? 's' : ''} before saving.`, 'error');
      return;
    }
    setSaving(true);
    const result = await saveSection(section, draft);
    setSaving(false);
    if (result.conflict) {
      const reloadNow = await confirm(
        'This section was changed in another tab or device since you opened it. Load the latest version? Your unsaved edits here will be replaced (use History afterwards if you need them).',
        { title: 'Edited somewhere else', confirmLabel: 'Load latest', danger: true }
      );
      if (reloadNow) await reload();
      return;
    }
    if (!result.ok) {
      toast([result.error, ...(result.details ?? []).slice(0, 2)].filter(Boolean).join(' ') || 'Saving failed.', 'error');
      return;
    }
    setAttempted(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
    toast('Saved. The live site is updated.');
  };

  if (loading && !data) return <Spinner />;
  if (error && !data)
    return (
      <Card className="p-6">
        <p className="font-semibold text-char">Could not load your content.</p>
        <p className="mt-1 text-sm text-mute">{error}</p>
      </Card>
    );

  return (
    <div>
      {renderForm ? (
        renderForm({ draft, setDraft, showErrors: attempted })
      ) : kind === 'object' ? (
        <Card className="p-5 md:p-7">
          <SchemaForm fields={fields} value={draft} onChange={setDraft} showErrors={attempted} />
        </Card>
      ) : (
        <ListEditor
          items={draft}
          onChange={setDraft}
          fields={fields}
          itemTitle={itemTitle}
          itemSubtitle={itemSubtitle}
          blank={blank}
          addLabel={addLabel}
          emptyHint={emptyHint}
          showErrors={attempted}
        />
      )}

      {/* Save bar */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 mt-8 border-t border-char bg-paper px-4 sm:px-6 lg:px-8 py-3 z-20">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[12rem] text-sm" role="status" aria-live="polite">
            {problems.length > 0 && attempted ? (
              <span className="flex items-center gap-2 text-signal font-medium">
                <AlertTriangle size={16} className="shrink-0" /> {problems.length} problem{problems.length > 1 ? 's' : ''} to fix: {problems[0]}
              </span>
            ) : dirty ? (
              <span className="flex items-center gap-2 text-char font-medium">
                <span className="w-2 h-2 bg-signal shrink-0" aria-hidden /> Unsaved changes
              </span>
            ) : justSaved ? (
              <span className="flex items-center gap-2 text-char font-medium">
                <Check size={16} className="text-signal shrink-0" /> Saved
              </span>
            ) : (
              <span className="text-mute">All changes saved</span>
            )}
          </div>
          <Button variant="ghost" onClick={() => setShowHistory(true)}>
            <History size={15} aria-hidden /> History
          </Button>
          <Button variant="ghost" onClick={() => setDraft(saved)} disabled={!dirty || saving}>
            <RotateCcw size={15} aria-hidden /> Discard
          </Button>
          <Button onClick={save} busy={saving} disabled={!dirty}>
            <Save size={15} aria-hidden /> Save changes
          </Button>
        </div>
      </div>
      {showHistory && (
        <HistoryDialog section={section} currentVersion={versions[section]} onClose={() => setShowHistory(false)} onLoad={(d) => setDraft(d)} />
      )}
    </div>
  );
}
