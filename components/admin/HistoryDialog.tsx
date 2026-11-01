'use client';

import React, { useEffect, useState } from 'react';
import { History, X } from 'lucide-react';
import type { SectionName } from '@/lib/schemas';
import { useAdmin } from './AdminContext';
import { Button, Spinner } from './ui';

interface Revision {
  id: number;
  version: number;
  actor: string | null;
  createdAt: string;
}

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

/** Lists earlier saved versions of one section. Choosing one loads it into the editor (it is not saved until you click Save). */
export default function HistoryDialog({
  section,
  currentVersion,
  onClose,
  onLoad,
}: {
  section: SectionName;
  currentVersion?: number;
  onClose: () => void;
  onLoad: (data: unknown) => void;
}) {
  const { toast } = useAdmin();
  const [revisions, setRevisions] = useState<Revision[] | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/admin/portfolio/revisions?section=${section}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setRevisions(j.revisions || []))
      .catch(() => {
        toast('Could not load the history.', 'error');
        onClose();
      });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const load = async (revision: Revision) => {
    setBusy(revision.id);
    try {
      const res = await fetch(`/api/admin/portfolio/revisions?section=${section}&id=${revision.id}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onLoad(json.data);
      toast(`Version ${revision.version} loaded into the editor. Click Save to keep it.`);
      onClose();
    } catch {
      toast('Could not load that version.', 'error');
      setBusy(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[105] grid place-items-center bg-char/50 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Version history"
        className="w-full max-w-lg max-h-[85vh] flex flex-col bg-white border border-char shadow-[8px_8px_0_0_#121212]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-rule px-5 py-4">
          <h2 className="font-serif text-3xl font-normal text-char">Version history</h2>
          <button onClick={onClose} aria-label="Close" className="grid place-items-center w-9 h-9 hover:bg-paperDeep">
            <X size={18} />
          </button>
        </div>
        <p className="px-5 pt-3 text-sm text-mute">Every save is kept. Load an older version into the editor, then save it to bring it back.</p>

        <div className="overflow-y-auto p-5">
          {!revisions ? (
            <Spinner label="Loading history" />
          ) : revisions.length === 0 ? (
            <p className="text-sm text-mute">No saved versions yet.</p>
          ) : (
            <ul className="border-t border-rule">
              {revisions.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 border-b border-rule py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-char">
                      Version {r.version}
                      {r.version === currentVersion && (
                        <span className="ml-2 border border-char px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]">Current</span>
                      )}
                    </p>
                    <p className="text-xs text-mute">
                      {when(r.createdAt)} · {r.actor || 'unknown'}
                    </p>
                  </div>
                  {r.version !== currentVersion && (
                    <Button variant="outline" size="sm" busy={busy === r.id} onClick={() => load(r)}>
                      <History size={14} aria-hidden /> Load
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
