'use client';

/**
 * Small, dependency-free charts for the analytics page. Plain SVG + HTML.
 *
 * Follows the project's data-viz rules: thin marks, hairline solid gridlines, 4px rounded data-ends on bars,
 * 2 px lines, a 2 px surface ring on end dots, a legend for two or more series, a crosshair + tooltip on the
 * time series, a per-bar tooltip on column charts, keyboard access, and a table view for every chart.
 * Colors are the validated palette below (checked with the dataviz palette validator against a white card).
 */
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Table2 } from 'lucide-react';

export const CHART = {
  /** categorical slot 1 (the brand accent) and slot 2 */
  s1: '#FF4F1F',
  s2: '#2a78d6',
  /** validated one-hue ordinal ramp, light to dark */
  ordinal: ['#FF9770', '#FF6A38', '#EE4616', '#C23510', '#8F2606'],
  grid: '#ECE8DC',
  axis: '#8A857A',
  ink: '#121212',
  muted: '#6B675E',
  surface: '#FFFFFF',
  context: '#B9B4A6',
};

// ------------------------------------------------------------------ formatting helpers

export const fmtNumber = (n: number) => n.toLocaleString('en-US');
export const fmtCompact = (n: number) => (n >= 10000 ? `${Math.round(n / 1000)}K` : n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : String(n));
export function fmtDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${String(s % 60).padStart(2, '0')}s`;
}
const dateOf = (iso: string) => new Date(iso + 'T00:00:00');
export const fmtDay = (iso: string) => dateOf(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtDayLong = (iso: string) => dateOf(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

/** A round upper bound for the y axis and four evenly spaced ticks. */
function niceScale(max: number): { top: number; ticks: number[] } {
  const raw = Math.max(max, 4);
  const pow = Math.pow(10, Math.floor(Math.log10(raw / 4)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s * 4 >= raw) ?? pow * 10;
  return { top: step * 4, ticks: [0, 1, 2, 3, 4].map((i) => i * step) };
}

function useWidth<T extends HTMLElement>(): [React.RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const observer = new ResizeObserver(() => setWidth(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

// ------------------------------------------------------------------ card with a table twin

export interface TableData {
  columns: string[];
  rows: (string | number)[][];
}

export function ChartCard({
  title,
  subtitle,
  legend,
  table,
  busy,
  children,
}: {
  title: string;
  subtitle?: string;
  legend?: { name: string; color: string }[];
  table?: TableData;
  busy?: boolean;
  children: React.ReactNode;
}) {
  const [asTable, setAsTable] = useState(false);
  const id = useId();
  return (
    <section className="bg-white border border-rule p-5 md:p-6" aria-labelledby={id}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 id={id} className="font-serif text-2xl font-normal text-char leading-tight">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-mute">{subtitle}</p>}
        </div>
        {table && (
          <button
            type="button"
            onClick={() => setAsTable((v) => !v)}
            aria-pressed={asTable}
            className={`inline-flex shrink-0 items-center gap-1.5 h-8 px-2.5 border text-xs font-medium transition-colors ${asTable ? 'bg-char text-paper border-char' : 'bg-white text-charSoft border-rule hover:border-char'}`}
          >
            <Table2 size={14} aria-hidden /> Table
          </button>
        )}
      </div>

      {legend && legend.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1" aria-label="Legend">
          {legend.map((l) => (
            <li key={l.name} className="flex items-center gap-2 text-sm text-charSoft">
              <span className="inline-block w-4 h-0.5" style={{ background: l.color }} aria-hidden />
              {l.name}
            </li>
          ))}
        </ul>
      )}

      <div className={`mt-4 transition-opacity ${busy ? 'opacity-50' : ''}`}>
        {asTable && table ? (
          <div className="max-h-72 overflow-auto border border-rule">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-paperDeep text-left">
                <tr>
                  {table.columns.map((c) => (
                    <th key={c} className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-mute font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr key={i} className="border-t border-rule">
                    {row.map((cell, j) => (
                      <td key={j} className={`px-3 py-1.5 ${j === 0 ? 'text-charSoft' : 'tabular-nums text-char'}`}>
                        {typeof cell === 'number' ? fmtNumber(cell) : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ tooltip

interface TooltipRow {
  name: string;
  value: string;
  color: string;
}

function Tooltip({ x, width, title, rows }: { x: number; width: number; title: string; rows: TooltipRow[] }) {
  const half = 88;
  const left = Math.min(Math.max(x, half), Math.max(width - half, half));
  return (
    <div
      className="pointer-events-none absolute top-0 z-10 w-44 -translate-x-1/2 border border-char bg-white px-3 py-2 shadow-[3px_3px_0_0_#121212]"
      style={{ left }}
      role="status"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-mute">{title}</p>
      {rows.map((r) => (
        <p key={r.name} className="mt-1 flex items-center gap-2 text-sm">
          <span className="inline-block w-3 h-0.5 shrink-0" style={{ background: r.color }} aria-hidden />
          <strong className="font-semibold text-char tabular-nums">{r.value}</strong>
          <span className="text-mute truncate">{r.name}</span>
        </p>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ time series (line / area)

export interface Series {
  name: string;
  color: string;
  values: number[];
  /** a 10% wash under the line (use on the first series only) */
  area?: boolean;
}

export function TimeSeriesChart({ dates, series, height = 240, label }: { dates: string[]; series: Series[]; height?: number; label: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const n = dates.length;
  const endLabels = width >= 560 && series.length >= 2;
  const m = { l: 40, r: endLabels ? 76 : 14, t: 12, b: 28 };
  const plotW = Math.max(width - m.l - m.r, 10);
  const plotH = height - m.t - m.b;
  const max = Math.max(0, ...series.flatMap((s) => s.values));
  const { top, ticks } = useMemo(() => niceScale(max), [max]);

  const x = (i: number) => m.l + (n <= 1 ? plotW / 2 : (i * plotW) / (n - 1));
  const y = (v: number) => m.t + plotH - (v / top) * plotH;
  const pathOf = (values: number[]) => values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');

  // up to 6 evenly spaced x labels, always including the first and last
  const xTickIdx = useMemo(() => {
    const want = Math.min(n, width < 420 ? 4 : 6);
    return Array.from(new Set(Array.from({ length: want }, (_, k) => Math.round((k * (n - 1)) / Math.max(want - 1, 1)))));
  }, [n, width]);

  const empty = max === 0;
  const pick = (clientX: number, rect: DOMRect) => setActive(Math.min(n - 1, Math.max(0, Math.round(((clientX - rect.left - m.l) / plotW) * (n - 1)))));
  const rows: TooltipRow[] = active === null ? [] : series.map((s) => ({ name: s.name, value: fmtNumber(s.values[active]), color: s.color }));

  // direct end labels only when the lines end far enough apart not to collide
  const ends = series.map((s) => ({ s, y: y(s.values[n - 1] ?? 0) }));
  const showEnds = endLabels && ends.every((a, i) => ends.every((b, j) => i === j || Math.abs(a.y - b.y) >= 16));

  return (
    <div ref={ref} className="relative" style={{ height }}>
      {width > 0 && (
        <>
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`${label}. ${series.map((s) => `${s.name}: ${fmtNumber(s.values.reduce((a, b) => a + b, 0))} in total`).join('; ')}. Use the Table view for each day.`}
            tabIndex={0}
            className="block outline-none focus-visible:ring-2 focus-visible:ring-signal/40"
            onFocus={() => setActive((a) => a ?? n - 1)}
            onBlur={() => setActive(null)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') setActive((a) => Math.min(n - 1, (a ?? n - 1) + 1));
              else if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? 1) - 1));
              else if (e.key === 'Escape') setActive(null);
              else return;
              e.preventDefault();
            }}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke={CHART.grid} strokeWidth={1} />
                <text x={m.l - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill={CHART.muted} className="tabular-nums">
                  {fmtCompact(t)}
                </text>
              </g>
            ))}
            {xTickIdx.map((i) => (
              <text key={i} x={x(i)} y={height - 8} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} fontSize={11} fill={CHART.muted}>
                {fmtDay(dates[i])}
              </text>
            ))}

            {!empty &&
              series.map((s) => (
                <g key={s.name}>
                  {s.area && <path d={`${pathOf(s.values)}L${x(n - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill={s.color} fillOpacity={0.1} />}
                  <path d={pathOf(s.values)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                  <circle cx={x(n - 1)} cy={y(s.values[n - 1] ?? 0)} r={6} fill={CHART.surface} />
                  <circle cx={x(n - 1)} cy={y(s.values[n - 1] ?? 0)} r={4} fill={s.color} />
                </g>
              ))}
            {showEnds &&
              ends.map(({ s, y: ey }) => (
                <text key={s.name} x={x(n - 1) + 12} y={ey + 4} fontSize={12} fill={CHART.ink} fontWeight={500}>
                  {s.name}
                </text>
              ))}

            {active !== null && !empty && (
              <g pointerEvents="none">
                <line x1={x(active)} x2={x(active)} y1={m.t} y2={m.t + plotH} stroke={CHART.axis} strokeWidth={1} />
                {series.map((s) => (
                  <g key={s.name}>
                    <circle cx={x(active)} cy={y(s.values[active])} r={6} fill={CHART.surface} />
                    <circle cx={x(active)} cy={y(s.values[active])} r={4} fill={s.color} />
                  </g>
                ))}
              </g>
            )}
            <rect
              x={m.l}
              y={m.t}
              width={plotW}
              height={plotH}
              fill="transparent"
              onPointerMove={(e) => pick(e.clientX, (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect())}
              onPointerLeave={() => setActive(null)}
            />
          </svg>
          {empty && <p className="absolute inset-0 grid place-items-center text-sm text-mute pointer-events-none">No data in this period yet</p>}
          {active !== null && !empty && <Tooltip x={x(active)} width={width} title={fmtDayLong(dates[active])} rows={rows} />}
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ columns

export function ColumnChart({
  categories,
  values,
  name,
  color,
  colors,
  height = 200,
  label,
  formatCategory = (c: string) => c,
  everyLabel,
  valueOnCap = false,
}: {
  categories: string[];
  values: number[];
  name: string;
  color: string;
  /** one color per bar (ordinal scales) */
  colors?: string[];
  height?: number;
  label: string;
  formatCategory?: (c: string) => string;
  everyLabel?: number;
  /** print each value above its bar (only for a handful of bars) */
  valueOnCap?: boolean;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const n = categories.length;
  const m = { l: 36, r: 8, t: valueOnCap ? 22 : 12, b: 26 };
  const plotW = Math.max(width - m.l - m.r, 10);
  const plotH = height - m.t - m.b;
  const max = Math.max(0, ...values);
  const { top, ticks } = useMemo(() => niceScale(max), [max]);
  const slot = plotW / n;
  const barW = Math.max(2, Math.min(24, slot * 0.66));
  const cx = (i: number) => m.l + slot * i + slot / 2;
  const y = (v: number) => m.t + plotH - (v / top) * plotH;
  const step = everyLabel ?? Math.max(1, Math.ceil(n / Math.max(Math.floor(plotW / 62), 1)));

  // 4px rounded data end, square at the baseline
  const bar = (i: number, v: number) => {
    const h = plotH - (y(v) - m.t);
    if (v <= 0 || h <= 0) return '';
    const r = Math.min(4, barW / 2, h);
    const x0 = cx(i) - barW / 2;
    const y0 = y(v);
    return `M${x0},${y0 + h}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + barW - r}Q${x0 + barW},${y0} ${x0 + barW},${y0 + r}V${y0 + h}Z`;
  };

  const empty = max === 0;
  return (
    <div ref={ref} className="relative" style={{ height }}>
      {width > 0 && (
        <>
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`${label}. ${fmtNumber(values.reduce((a, b) => a + b, 0))} in total. Use the Table view for each value.`}
            tabIndex={0}
            className="block outline-none focus-visible:ring-2 focus-visible:ring-signal/40"
            onFocus={() => setActive((a) => a ?? n - 1)}
            onBlur={() => setActive(null)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') setActive((a) => Math.min(n - 1, (a ?? n - 1) + 1));
              else if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? 1) - 1));
              else if (e.key === 'Escape') setActive(null);
              else return;
              e.preventDefault();
            }}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? CHART.axis : CHART.grid} strokeWidth={1} />
                <text x={m.l - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill={CHART.muted} className="tabular-nums">
                  {fmtCompact(t)}
                </text>
              </g>
            ))}
            {categories.map((c, i) =>
              i % step === 0 || i === n - 1 ? (
                <text key={c + i} x={cx(i)} y={height - 8} textAnchor="middle" fontSize={11} fill={CHART.muted}>
                  {formatCategory(c)}
                </text>
              ) : null
            )}
            {values.map((v, i) => (
              <g key={i}>
                <path d={bar(i, v)} fill={colors?.[i] ?? color} opacity={active === null || active === i ? 1 : 0.45} style={{ transition: 'opacity .12s' }} />
                {valueOnCap && v > 0 && (
                  <text x={cx(i)} y={y(v) - 6} textAnchor="middle" fontSize={11} fill={CHART.ink} fontWeight={600} className="tabular-nums">
                    {fmtNumber(v)}
                  </text>
                )}
                <rect
                  x={m.l + slot * i}
                  y={m.t}
                  width={slot}
                  height={plotH}
                  fill="transparent"
                  onPointerEnter={() => setActive(i)}
                  onPointerMove={() => setActive(i)}
                  onPointerLeave={() => setActive((a) => (a === i ? null : a))}
                />
              </g>
            ))}
          </svg>
          {empty && <p className="absolute inset-0 grid place-items-center text-sm text-mute pointer-events-none">No data in this period yet</p>}
          {active !== null && !empty && <Tooltip x={cx(active)} width={width} title={formatCategory(categories[active])} rows={[{ name, value: fmtNumber(values[active]), color: colors?.[active] ?? color }]} />}
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ ranked horizontal bars

export interface RankedRow {
  name: string;
  count: number;
  /** shown in muted text after the value, e.g. "42%" */
  note?: string;
}

export function RankedBars({ rows, color = CHART.s1, empty = 'Nothing to show yet', suffix = '' }: { rows: RankedRow[]; color?: string; empty?: string; suffix?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-mute">{empty}</p>;
  return (
    <ul className="space-y-1">
      {rows.map((r) => (
        <li
          key={r.name}
          tabIndex={0}
          title={`${r.name}: ${fmtNumber(r.count)}${suffix}${r.note ? ` (${r.note})` : ''}`}
          className="grid grid-cols-[minmax(4.5rem,9.5rem)_1fr] items-center gap-3 px-1 py-1.5 outline-none hover:bg-paper focus-visible:bg-paper focus-visible:ring-2 focus-visible:ring-signal/40"
        >
          <span className="truncate text-sm text-charSoft">{r.name}</span>
          <span className="flex items-center gap-2 min-w-0">
            <span className="block h-2.5 shrink-0" style={{ width: `calc((100% - 4.25rem) * ${r.count / max})`, minWidth: r.count > 0 ? 3 : 0, background: color, borderRadius: '0 4px 4px 0' }} />
            <span className="text-sm font-semibold tabular-nums text-char whitespace-nowrap">
              {fmtNumber(r.count)}
              {suffix}
              {r.note && <span className="ml-1.5 text-xs font-normal text-mute">{r.note}</span>}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

// ------------------------------------------------------------------ stat tile + sparkline

export function Sparkline({ values }: { values: number[] }) {
  const w = 92;
  const h = 28;
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => [(i * (w - 8)) / Math.max(values.length - 1, 1) + 2, h - 4 - (v / max) * (h - 10)]);
  const d = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`).join('');
  const last = pts[pts.length - 1];
  if (!last || values.every((v) => v === 0)) return <svg width={w} height={h} aria-hidden />;
  return (
    <svg width={w} height={h} aria-hidden>
      <path d={d} fill="none" stroke={CHART.context} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r={5} fill={CHART.surface} />
      <circle cx={last[0]} cy={last[1]} r={3.5} fill={CHART.s1} />
    </svg>
  );
}

export function StatTile({
  label,
  value,
  change,
  note,
  spark,
  periodLabel,
}: {
  label: string;
  value: string;
  change?: number | null;
  note?: string;
  spark?: number[];
  periodLabel: string;
}) {
  const up = (change ?? 0) >= 0;
  return (
    <div className="bg-white p-4 md:p-5">
      <p className="text-sm text-mute">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="font-sans text-3xl md:text-4xl font-semibold leading-none tracking-tight text-char">{value}</p>
        {spark && <Sparkline values={spark} />}
      </div>
      <p className="mt-3 text-xs text-mute min-h-4">
        {change === undefined ? (
          note
        ) : change === null ? (
          <span>
            <span aria-hidden>–</span>
            <span className="sr-only">No comparison available yet</span>
          </span>
        ) : (
          <span>
            {up ? <ArrowUpRight size={13} className="inline -mt-0.5 text-char" aria-hidden /> : <ArrowDownRight size={13} className="inline -mt-0.5 text-char" aria-hidden />}
            <span className="sr-only">{up ? 'Up ' : 'Down '}</span>
            <strong className="font-semibold text-char tabular-nums">
              {up ? '+' : ''}
              {Math.abs(change) >= 1000 ? '999%+' : `${change}%`}
            </strong>{' '}
            vs prev. {periodLabel}
          </span>
        )}
      </p>
    </div>
  );
}
