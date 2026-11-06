/**
 * Draws the resume as a real text PDF. Choices made for applicant tracking systems (ATS):
 *  - one column, top to bottom, so the reading order is the visual order,
 *  - no tables, text boxes, icons, images, or content in page headers/footers,
 *  - a built-in font with standard encoding, so copied or parsed text comes out exactly as printed,
 *  - tagged structure (headings, lists), document metadata, and link addresses printed as visible text.
 */
import PDFDocument from 'pdfkit';
import type { Resume } from '@/lib/schemas';
import { buildResumeDocument, toPrintable, type ResumeItem } from './document';

const FONT = { regular: 'Helvetica', bold: 'Helvetica-Bold', italic: 'Helvetica-Oblique' };
const INK = '#1A1A1A';
const SOFT = '#4A4A4A';
const MARGIN_X = 50;
const MARGIN_Y = 34;
const BODY = 10;
const LINE_GAP = 1.6;

export interface ResumePdf {
  buffer: Buffer;
  pages: number;
}

export function renderResumePdf(resume: Resume): Promise<ResumePdf> {
  const model = buildResumeDocument(resume);
  const t = toPrintable;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: model.pageSize,
      margins: { top: MARGIN_Y, bottom: MARGIN_Y, left: MARGIN_X, right: MARGIN_X },
      tagged: true,
      displayTitle: true,
      lang: 'en',
      pdfVersion: '1.7',
      info: {
        Title: t([model.name, model.headline, 'Resume'].filter(Boolean).join(' - ')),
        Author: t(model.name),
        Subject: t(model.headline || 'Resume'),
        Keywords: t(model.keywords.join(', ')),
        Creator: 'Portfolio CMS',
      },
    });

    let pages = 1;
    doc.on('pageAdded', () => pages++);
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('error', reject);
    doc.on('end', () => resolve({ buffer: Buffer.concat(chunks), pages }));

    const left = MARGIN_X;
    const width = doc.page.width - MARGIN_X * 2;
    const bottom = () => doc.page.height - MARGIN_Y;

    /** Run `draw` as a tagged element under `parent`. */
    const tagged = (parent: PDFKit.PDFStructureElement, type: string, draw: () => void) => {
      const element = doc.struct(type as any);
      parent.add(element);
      element.add(draw);
      element.end();
    };

    /** Start a new page unless `height` points still fit, so a heading is never stranded at the bottom. */
    const keepTogether = (height: number) => {
      if (doc.y + height > bottom()) doc.addPage();
    };

    const measure = (text: string, font: string, size: number, w = width) => {
      doc.font(font).fontSize(size);
      return doc.heightOfString(t(text), { width: w, lineGap: LINE_GAP });
    };

    const paragraph = (text: string, font = FONT.regular, color = INK, x = left, w = width) => {
      doc.font(font).fontSize(BODY).fillColor(color).text(t(text), x, doc.y, { width: w, lineGap: LINE_GAP });
    };

    const root = doc.struct('Document');
    doc.addStructure(root);

    // ---- name and contact: part of the page body, because many parsers skip real headers
    tagged(root, 'H1', () => {
      // Kerning closes up the gaps at this size; the extra word spacing keeps the name parsed as separate words.
      doc.font(FONT.bold).fontSize(22).fillColor(model.accent).text(t(model.name), left, doc.y, { width, wordSpacing: 2.5 });
    });
    if (model.headline) {
      doc.moveDown(0.1);
      tagged(root, 'P', () => {
        doc.font(FONT.regular).fontSize(12).fillColor(INK).text(t(model.headline), left, doc.y, { width });
      });
    }
    doc.moveDown(0.35);
    for (const line of model.contact) {
      tagged(root, 'P', () => {
        doc.font(FONT.regular).fontSize(9.5).fillColor(SOFT);
        doc.text('', left, doc.y, { continued: true, width, lineGap: LINE_GAP });
        line.forEach((item, i) => {
          const isLast = i === line.length - 1;
          doc.text(t(item.text), { continued: !isLast, link: item.href ?? null, underline: false });
          if (!isLast) doc.text('  |  ', { continued: true, link: null });
        });
      });
    }

    // ---- sections
    const entry = (parent: PDFKit.PDFStructureElement, item: Extract<ResumeItem, { kind: 'entry' }>) => {
      const rightWidth = item.right ? doc.font(FONT.regular).fontSize(BODY).widthOfString(t(item.right)) + 4 : 0;
      const titleWidth = width - rightWidth - (rightWidth ? 10 : 0);
      const firstBody = item.bullets[0] || item.text;

      const header = measure(item.title, FONT.bold, BODY + 0.5, titleWidth) + (item.meta || item.link ? 13 : 0) + 6;
      const whole =
        header +
        (item.text ? measure(item.text, FONT.regular, BODY) + 1 : 0) +
        item.bullets.reduce((sum, b) => sum + measure(b, FONT.regular, BODY, width - 12) + 1, 1.2);
      // Keep a whole entry (a job and all its bullets) on one page when it fits on a page by itself.
      // A very long entry may still split, but never right after its heading.
      const pageRoom = doc.page.height - MARGIN_Y * 2;
      keepTogether(whole <= pageRoom * 0.6 ? whole : header + (firstBody ? measure(firstBody, FONT.regular, BODY, width - 12) : 0));

      tagged(parent, 'P', () => {
        const y = doc.y;
        doc.font(FONT.bold).fontSize(BODY + 0.5).fillColor(INK).text(t(item.title), left, y, { width: titleWidth, lineGap: LINE_GAP });
        const afterTitle = doc.y;
        if (item.right) {
          doc.font(FONT.regular).fontSize(BODY).fillColor(SOFT).text(t(item.right), left + width - rightWidth, y + 0.4, { width: rightWidth, align: 'right', lineBreak: false });
        }
        doc.x = left;
        doc.y = afterTitle;
      });
      if (item.meta || item.link) {
        tagged(parent, 'P', () => {
          if (item.meta) {
            doc.font(FONT.italic).fontSize(BODY).fillColor(SOFT).text(t(item.meta), left, doc.y, { width, lineGap: LINE_GAP, continued: !!item.link });
            if (item.link) doc.text('  |  ', { continued: true });
          }
          if (item.link) {
            const options = { width, lineGap: LINE_GAP, link: item.link.href, underline: false };
            doc.font(FONT.regular).fontSize(9.5).fillColor(model.accent);
            if (item.meta) doc.text(t(item.link.text), options);
            else doc.text(t(item.link.text), left, doc.y, options);
          }
          doc.x = left;
        });
      }
      if (item.text) {
        doc.y += 0.8;
        tagged(parent, 'P', () => paragraph(item.text as string));
      }
      if (item.bullets.length) {
        doc.y += 1.2;
        const list = doc.struct('L');
        parent.add(list);
        for (const bullet of item.bullets) {
          keepTogether(measure(bullet, FONT.regular, BODY, width - 12));
          tagged(list, 'LI', () => {
            const y = doc.y;
            doc.font(FONT.regular).fontSize(BODY).fillColor(INK).text('•', left + 1, y, { lineBreak: false });
            doc.text(t(bullet), left + 12, y, { width: width - 12, lineGap: LINE_GAP });
            doc.x = left;
          });
          doc.y += 1;
        }
        list.end();
      }
    };

    for (const section of model.sections) {
      const first = section.items[0];
      const firstHeight = first.kind === 'entry' ? 44 : measure('text' in first ? first.text : '', FONT.regular, BODY);
      doc.y += 8;
      keepTogether(24 + firstHeight);

      const sect = doc.struct('Sect');
      root.add(sect);
      tagged(sect, 'H2', () => {
        doc.font(FONT.bold).fontSize(10.5).fillColor(model.accent).text(section.heading.toUpperCase(), left, doc.y, { width, characterSpacing: 0.7 });
      });
      const ruleY = doc.y + 1.5;
      doc.save();
      doc.markContent('Artifact', { type: 'Layout' } as any);
      doc.moveTo(left, ruleY).lineTo(left + width, ruleY).lineWidth(0.8).strokeColor(model.accent).stroke();
      doc.endMarkedContent();
      doc.restore();
      doc.x = left;
      doc.y = ruleY + 4.5;

      section.items.forEach((item, i) => {
        if (item.kind === 'text') {
          tagged(sect, 'P', () => paragraph(item.text));
        } else if (item.kind === 'skill') {
          keepTogether(measure(`${item.label}: ${item.text}`, FONT.regular, BODY));
          tagged(sect, 'P', () => {
            doc.fillColor(INK).font(FONT.bold).fontSize(BODY).text(`${t(item.label)}: `, left, doc.y, { continued: true, width, lineGap: LINE_GAP });
            doc.font(FONT.regular).text(t(item.text), { continued: false, width, lineGap: LINE_GAP });
          });
          doc.y += 1;
        } else {
          if (i > 0) doc.y += 4;
          entry(sect, item);
        }
      });
      sect.end();
    }

    root.end();
    doc.end();
  });
}
