# Martí Vilàs - portfolio

Bilingual Astro portfolio with English and Spanish CV downloads. Server integrations for the contact form and portfolio assistant use the existing environment configuration in `.env.example`.

## Local development

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 4322
```

Routes: `/` (Spanish) and `/en/` (English). English is the primary CV download from either hero. Both PDFs are available in the CV section.

## Professional content and documents

Edit `src/data/professional-profile.json` for shared professional facts and their translations. The site, public assistant context and CV generator consume it. Interface-only translations stay in `src/languages/`.

Projects use `cvOrder` to select and order CV entries; `cvDescription` is an optional shorter description. Titles, technologies, roles and URLs remain in the shared project record.

```sh
python3 -m pip install -r scripts/requirements-cv.txt
npm run cv:generate
npm run cv:verify
```

Generation writes the PDF assets imported by Astro and review copies under the ignored `output/pdf/` directory. Render and visually inspect both PDFs after content changes. Verification checks text order and extraction; it does not simulate a commercial ATS.

## Validation

```sh
npm run check
npm test
npm run build
# With the local server running:
npm run test:site
```

There is no dedicated lint configuration. `check` runs Astro/TypeScript diagnostics. Local API calls need the appropriate environment variables; do not commit secrets or generated Vercel output.

See `docs/portfolio-review.md` for the audit, changes, remaining factual checks and the local comparison branch. The proposed industrial DFM description is general and excludes internal materials or client identities; review it before any publication.
