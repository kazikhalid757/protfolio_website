'use client';

import React, { useEffect, useId, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Copy, Plus, Trash2, X } from 'lucide-react';
import { useAdmin } from './AdminContext';

// ------------------------------------------------------------------ schema types

interface Base {
  key: string;
  label: string;
  help?: string;
}
export type Field =
  | (Base & { type: 'text' | 'url' | 'email' | 'tel'; placeholder?: string; required?: boolean })
  | (Base & { type: 'textarea'; placeholder?: string; rows?: number; required?: boolean })
  | (Base & { type: 'select'; options: string[] })
  | (Base & { type: 'boolean' })
  | (Base & { type: 'tags'; placeholder?: string })
  | (Base & { type: 'lines'; placeholder?: string; rows?: number })
  | (Base & { type: 'group'; fields: Field[] })
  | (Base & {
      type: 'list';
      fields: Field[];
      itemTitle: (item: any) => string;
      blank: () => any;
      addLabel?: string;
    });

// ------------------------------------------------------------------ validation

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isUrlLike(value: string) {
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(value);
}

/** The problem with one leaf field, or null. Required-ness is only reported once `showRequired` is on. */
export function fieldError(field: Field, value: any, showRequired: boolean): string | null {
  if (field.type === 'text' || field.type === 'textarea' || field.type === 'url' || field.type === 'email' || field.type === 'tel') {
    const text = typeof value === 'string' ? value.trim() : '';
    if (!text) return showRequired && field.required ? `${field.label} is required` : null;
    if (field.type === 'url' && !isUrlLike(text)) return 'Must start with https:// (or / for a file on this site)';
    if (field.type === 'email' && !EMAIL.test(text)) return 'Enter a valid email address';
  }
  return null;
}

/** Every problem in a value, used to block saving. */
export function collectErrors(fields: Field[], value: any, prefix = ''): string[] {
  const problems: string[] = [];
  for (const field of fields) {
    const v = value?.[field.key];
    if (field.type === 'group') problems.push(...collectErrors(field.fields, v, `${prefix}${field.label} › `));
    else if (field.type === 'list') {
      (Array.isArray(v) ? v : []).forEach((item, i) =>
        problems.push(...collectErrors(field.fields, item, `${prefix}${field.label} #${i + 1} › `))
      );
    } else {
      const error = fieldError(field, v, true);
      if (error) problems.push(`${prefix}${error.startsWith(field.label) ? error : `${field.label}: ${error}`}`);
    }
  }
  return problems;
}

// ------------------------------------------------------------------ inputs

const inputClass =
  'w-full h-11 px-3 bg-white border border-char/40 text-char placeholder:text-mute/60 focus:outline-none focus:border-signal focus:ring-2 focus:ring-signal/25 transition-colors';

function Shell({
  label,
  help,
  error,
  required,
  htmlFor,
  children,
}: {
  label: string;
  help?: string;
  error?: string | null;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-char">
        {label}
        {required && <span className="ml-0.5 text-signal" aria-hidden>*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-signal" role="alert">
          {error}
        </p>
      ) : (
        help && <p className="mt-1.5 text-xs text-mute leading-relaxed">{help}</p>
      )}
    </div>
  );
}

function TagsInput({ id, value, onChange, placeholder }: { id: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [text, setText] = useState('');
  const add = (raw: string) => {
    const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...value, ...parts.filter((p) => !value.includes(p))]);
    setText('');
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5 min-h-11 p-1.5 bg-white border border-char/40 focus-within:border-signal focus-within:ring-2 focus-within:ring-signal/25">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 bg-paperDeep border border-rule pl-2 pr-1 py-1 font-mono text-xs text-char">
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="grid place-items-center w-5 h-5 text-mute hover:text-signal"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={text}
        placeholder={value.length ? '' : placeholder || 'Type and press Enter'}
        onChange={(e) => (e.target.value.includes(',') ? add(e.target.value) : setText(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            add(text);
          } else if (e.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={() => text && add(text)}
        className="flex-1 min-w-[8rem] h-8 px-1.5 bg-transparent text-char text-sm placeholder:text-mute/60 focus:outline-none"
      />
    </div>
  );
}

function LinesInput({ id, value, onChange, placeholder, rows = 4 }: { id: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; rows?: number }) {
  // Keep the raw text locally so pressing Enter (a blank line) is not swallowed while typing.
  const joined = value.join('\n');
  const [text, setText] = useState(joined);
  useEffect(() => {
    if (text.split('\n').map((s) => s.trim()).filter(Boolean).join('\n') !== joined) setText(joined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined]);
  return (
    <textarea
      id={id}
      rows={rows}
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        setText(e.target.value);
        onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean));
      }}
      className={`${inputClass} h-auto py-2.5 leading-relaxed resize-y`}
    />
  );
}

function FieldRow({ field, value, onChange, showErrors }: { field: Field; value: any; onChange: (v: any) => void; showErrors: boolean }) {
  const id = useId();

  switch (field.type) {
    case 'text':
    case 'url':
    case 'email':
    case 'tel': {
      const error = fieldError(field, value, showErrors);
      return (
        <Shell label={field.label} help={field.help} error={error} required={field.required} htmlFor={id}>
          <input
            id={id}
            type={field.type === 'url' ? 'text' : field.type}
            inputMode={field.type === 'url' ? 'url' : undefined}
            value={value ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!error}
            className={`${inputClass} ${error ? 'border-signal' : ''}`}
          />
        </Shell>
      );
    }
    case 'textarea': {
      const error = fieldError(field, value, showErrors);
      return (
        <Shell label={field.label} help={field.help} error={error} required={field.required} htmlFor={id}>
          <textarea
            id={id}
            rows={field.rows || 4}
            value={value ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!error}
            className={`${inputClass} h-auto py-2.5 leading-relaxed resize-y ${error ? 'border-signal' : ''}`}
          />
        </Shell>
      );
    }
    case 'select':
      return (
        <Shell label={field.label} help={field.help} htmlFor={id}>
          <select id={id} value={value ?? field.options[0]} onChange={(e) => onChange(e.target.value)} className={inputClass}>
            {field.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Shell>
      );
    case 'boolean':
      return (
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-0.5 h-5 w-5 accent-[#FF4F1F]"
          />
          <span>
            <span className="block text-sm font-semibold text-char">{field.label}</span>
            {field.help && <span className="block text-xs text-mute mt-0.5">{field.help}</span>}
          </span>
        </label>
      );
    case 'tags':
      return (
        <Shell label={field.label} help={field.help ?? 'Press Enter or comma to add each one.'} htmlFor={id}>
          <TagsInput id={id} value={Array.isArray(value) ? value : []} onChange={onChange} placeholder={field.placeholder} />
        </Shell>
      );
    case 'lines':
      return (
        <Shell label={field.label} help={field.help ?? 'One item per line.'} htmlFor={id}>
          <LinesInput id={id} value={Array.isArray(value) ? value : []} onChange={onChange} placeholder={field.placeholder} rows={field.rows} />
        </Shell>
      );
    case 'group':
      return (
        <fieldset className="border border-rule p-4 md:p-5">
          <legend className="px-2 font-mono text-xs uppercase tracking-[0.14em] text-mute">{field.label}</legend>
          {field.help && <p className="mb-4 -mt-1 text-xs text-mute">{field.help}</p>}
          <SchemaForm fields={field.fields} value={value || {}} onChange={onChange} showErrors={showErrors} />
        </fieldset>
      );
    case 'list':
      return (
        <div>
          <p className="mb-1.5 text-sm font-semibold text-char">{field.label}</p>
          {field.help && <p className="mb-2 text-xs text-mute">{field.help}</p>}
          <ListEditor
            items={Array.isArray(value) ? value : []}
            onChange={onChange}
            fields={field.fields}
            itemTitle={field.itemTitle}
            blank={field.blank}
            addLabel={field.addLabel}
            showErrors={showErrors}
            nested
          />
        </div>
      );
  }
}

// ------------------------------------------------------------------ form

export function SchemaForm({
  fields,
  value,
  onChange,
  showErrors = false,
}: {
  fields: Field[];
  value: any;
  onChange: (next: any) => void;
  showErrors?: boolean;
}) {
  const current = value || {};
  // Pair up short fields so the form is not one long column on wide screens.
  const isShort = (f: Field) => f.type === 'text' || f.type === 'url' || f.type === 'email' || f.type === 'tel' || f.type === 'select';
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
      {fields.map((field) => (
        <div key={field.key} className={isShort(field) ? '' : 'md:col-span-2'}>
          <FieldRow
            field={field}
            value={current[field.key]}
            showErrors={showErrors}
            onChange={(v) => onChange({ ...current, [field.key]: v })}
          />
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ list editor

export function ListEditor({
  items,
  onChange,
  fields,
  itemTitle,
  itemSubtitle,
  blank,
  addLabel = 'Add item',
  emptyHint = 'Nothing here yet.',
  showErrors = false,
  nested = false,
}: {
  items: any[];
  onChange: (next: any[]) => void;
  fields: Field[];
  itemTitle: (item: any) => string;
  itemSubtitle?: (item: any) => string;
  blank: () => any;
  addLabel?: string;
  emptyHint?: string;
  showErrors?: boolean;
  nested?: boolean;
}) {
  const { confirm } = useAdmin();
  const [open, setOpen] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
    if (open === from) setOpen(to);
    else if (open === to) setOpen(from);
  };

  const remove = async (i: number) => {
    const name = itemTitle(items[i]) || 'this item';
    if (!(await confirm(`Remove "${name}"? You can still discard the change before saving.`, { title: 'Remove item', confirmLabel: 'Remove', danger: true }))) return;
    onChange(items.filter((_, idx) => idx !== i));
    setOpen(null);
  };

  const duplicate = (i: number) => {
    const copy = JSON.parse(JSON.stringify(items[i]));
    if (copy.id) copy.id = `${String(copy.id).replace(/-\d{6,}$/, '')}-${Date.now()}`;
    onChange([...items.slice(0, i + 1), copy, ...items.slice(i + 1)]);
    setOpen(i + 1);
  };

  const add = () => {
    onChange([...items, blank()]);
    setOpen(items.length);
  };

  const iconBtn =
    'grid place-items-center w-9 h-9 text-charSoft hover:bg-paperDeep hover:text-char disabled:opacity-30 disabled:hover:bg-transparent transition-colors';

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="border border-dashed border-char/30 px-4 py-6 text-center text-sm text-mute">{emptyHint}</p>}

      {items.map((item, i) => {
        const isOpen = open === i;
        const title = itemTitle(item);
        const subtitle = itemSubtitle?.(item);
        return (
          <div key={item?.id ?? i} className={`border bg-white ${isOpen ? 'border-char' : 'border-rule'}`}>
            <div className="flex items-center gap-1 pr-1">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex flex-1 min-w-0 items-center gap-3 px-4 py-3 text-left"
              >
                <span className="font-serif text-2xl leading-none text-signal w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate font-semibold ${title ? 'text-char' : 'text-mute italic'}`}>{title || 'Untitled'}</span>
                  {subtitle && <span className="block truncate text-xs text-mute mt-0.5">{subtitle}</span>}
                </span>
                <ChevronDown size={18} className={`shrink-0 text-mute transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
              </button>
              <button type="button" className={iconBtn} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move up">
                <ArrowUp size={16} />
              </button>
              <button type="button" className={iconBtn} onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label="Move down">
                <ArrowDown size={16} />
              </button>
              <button type="button" className={`${iconBtn} hidden sm:grid`} onClick={() => duplicate(i)} aria-label="Duplicate">
                <Copy size={16} />
              </button>
              <button type="button" className={`${iconBtn} hover:!text-signal`} onClick={() => remove(i)} aria-label="Remove">
                <Trash2 size={16} />
              </button>
            </div>

            {isOpen && (
              <div className="border-t border-rule p-4 md:p-5 bg-paper/60">
                <SchemaForm
                  fields={fields}
                  value={item}
                  showErrors={showErrors}
                  onChange={(next) => onChange(items.map((it, idx) => (idx === i ? next : it)))}
                />
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className={`inline-flex items-center gap-2 h-10 px-4 border border-dashed border-char text-sm font-medium text-char hover:bg-char hover:text-paper hover:border-solid transition-colors ${nested ? '' : 'w-full justify-center h-12'}`}
      >
        <Plus size={16} aria-hidden /> {addLabel}
      </button>
    </div>
  );
}
