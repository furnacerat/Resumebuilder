# Resume Generator (Local-Only)

A local-only resume builder that saves everything to browser storage and downloads a professional PDF using selectable templates.

## Features

- Local-only persistence (IndexedDB)
- Clean builder UI (Basics, Summary, Experience, Education, Skills)
- PDF export (client-side) with multiple templates
- Installable as a macOS web app (PWA)

## Dev

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build (Static)

```bash
npm run build
```

Output is written to `out/`.

## Install on macOS

- Safari: Share menu -> Add to Dock
- Chrome/Edge: Install icon in address bar

## Notes

- Data is stored locally in this browser profile. Clearing site data removes resumes.
