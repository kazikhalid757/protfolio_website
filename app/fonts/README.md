# Fonts

Self-hosted so the site never asks Google (or anyone else) for fonts, and so builds work offline.
Latin subset only. All three are open-source under the SIL Open Font License 1.1 (https://openfontlicense.org).

| File | Family | Used for |
| --- | --- | --- |
| `instrument-serif.woff2`, `instrument-serif-italic.woff2` | Instrument Serif | Headings |
| `plus-jakarta-sans.woff2` | Plus Jakarta Sans (variable, 200 to 800) | Body text |
| `fira-code.woff2` | Fira Code (variable, 300 to 700) | Labels and code |

Source: Google Fonts. To change a font, replace the file here and update `app/layout.tsx`.
