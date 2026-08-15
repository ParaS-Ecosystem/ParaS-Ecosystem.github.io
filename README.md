# ParaS-Ecosystem.github.io

Official website for the [ParaS Ecosystem](https://github.com/ParaS-Ecosystem) — an
open, device-agnostic HPC-AI software ecosystem.

Live at: **https://paras-ecosystem.org**

## Structure

```
.
├── index.html            # single-page site
├── CNAME                 # custom domain for GitHub Pages
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── images/           # logo / favicon go here once branding is finalized
└── README.md
```

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying

This repo is published directly via GitHub Pages.

1. Push to `main`.
2. Repository → **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **main**, folder **/ (root)**
3. Repository → **Settings → Pages → Custom domain** → enter `paras-ecosystem.org`
   (already set via the `CNAME` file in this repo).
4. Configure DNS for `paras-ecosystem.org` per GitHub's current
   [custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
5. Once DNS verifies, enable **Enforce HTTPS** in the same settings page.

## Editing content

Everything lives in `index.html` as plain sections (`#about`, `#architecture`,
`#projects`, `#governance`). No build step — edit the HTML/CSS directly and push.

The Technical Charter itself is **not** duplicated here; the Governance section
links out to `ParaS-Ecosystem/governance/TECHNICAL_CHARTER.md`.
