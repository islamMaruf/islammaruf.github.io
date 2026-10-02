# islammaruf.github.io

Personal portfolio website for Md Maruf Islam — Senior Software Engineer.

Live at: https://islammaruf.github.io/

## Stack

Plain HTML, CSS and vanilla JavaScript — no build step. Deployed via GitHub Pages directly from the `main` branch.

## Structure

```
index.html
assets/
  css/style.css
  js/main.js
  img/favicon.svg
  data/waka-stats.json
  Md_Maruf_Islam_Resume.pdf
.github/workflows/sync-wakatime-stats.yml
```

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Deploy

Push to the `islamMaruf/islammaruf.github.io` repository on `main`; GitHub Pages serves it automatically at https://islammaruf.github.io/.

## WakaTime coding-activity stats

The "Coding Activity" section reads `assets/data/waka-stats.json`, a static file kept in sync by the
`.github/workflows/sync-wakatime-stats.yml` GitHub Action. The WakaTime API key never ships to the
browser — it's only used server-side, inside the Action run.

To enable it after pushing this repo to GitHub:

1. Get your API key from https://wakatime.com/settings/api-key.
2. In the repo, go to **Settings → Secrets and variables → Actions → New repository secret**.
3. Name it `WAKATIME_API_KEY` and paste the key as the value.
4. Run the workflow once manually from the **Actions** tab (**Sync WakaTime Stats → Run workflow**) to
   populate real data immediately; after that it refreshes automatically every day at 03:00 UTC.

Until the secret is added, the section shows the seeded sample data committed in `waka-stats.json`.
