# JOE COLLECTION — Property Listings

Mobile-first real estate listing site for **JOE COLLECTION · Premier Real Estate Advisory · Bangkok**.
Pure HTML/CSS/JS — no build step, ready for GitHub Pages.

## Structure
```
index.html              Main page (hero, filters, grid, add-listing form, about, footer, modal)
css/styles.css           CBRE-inspired design system (deep green + gold, IBM Plex)
js/script.js             Rendering, filters, modal, add-listing logic, anti-copy deterrents
data/properties.json     Master property list — edit this to add/remove listings permanently
```

## Editing listings
- **Permanent listings:** edit `data/properties.json`. Each entry supports `name`, `type`, `location`, `tenure`, `price`, `priceLabel`, `keys`, `land`, `gfa`, `image`, `summary`, `url` (property website), `map` (Google Maps link).
- **Quick preview listings:** the "List a Property" form on the page saves to the visitor's browser (`localStorage`) for preview only — not shared with other visitors. To publish for everyone, copy the entry into `data/properties.json` and commit.

## Deploy on GitHub Pages
1. Create a new GitHub repository and push this folder as the root.
2. Repo → Settings → Pages → Source: `Deploy from a branch` → Branch: `main` / `root`.
3. Your site will be live at `https://<username>.github.io/<repo-name>/`.

## Local preview
`fetch()` requires a server (won't work opening `index.html` directly via `file://`). Run:
```
python3 -m http.server 8000
```
then open `http://localhost:8000`.

## Contact embedded throughout
Monthon Mahakijdumrongnukul — Deal Maker & Advisor
+66 80-657-8387 · joecollection.m@gmail.com
