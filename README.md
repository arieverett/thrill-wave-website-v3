# Thrill Wave Website

Production site for thrillwave.com. Static HTML/CSS/JS — no build step required.

---

## FILE STRUCTURE

```
thrillwave-site/
├── index.html        ← Homepage
├── sitrep.html       ← SITREP methodology lander (/sitrep)
├── styles.css        ← All shared styles (colors, fonts, layout)
├── _redirects        ← Netlify routing (makes /sitrep work without .html)
├── robots.txt        ← SEO — tells search engines to index the site
├── sitemap.xml       ← SEO — lists all pages for Google
├── assets/           ← Put images, videos, and other media here
└── README.md         ← This file
```

---

## DEPLOYMENT — FIRST TIME SETUP

### 1. GitHub
1. Go to github.com → Sign in (or create account)
2. Click the **+** in the top right → **New repository**
3. Name: `thrillwave-site`
4. Set to **Private**
5. Click **Create repository**
6. Upload all the files from this folder into the repo
   - You can drag and drop the files directly into the GitHub web interface
   - Or use `git` from the command line if you prefer

### 2. Netlify
1. Go to netlify.com → Sign up with your GitHub account
2. Click **Add new site** → **Import an existing project**
3. Select **GitHub** → Select `thrillwave-site` repo
4. Deploy settings — leave defaults:
   - Build command: *(leave blank)*
   - Publish directory: `/`
5. Click **Deploy site**

Netlify will give you a URL like `thrillwave-site-abc123.netlify.app`. That's your staging site.

### 3. Custom staging domain (optional)
1. In your DNS provider (wherever you manage thrillwave.com)
2. Add a CNAME record: `staging` → your Netlify URL
3. In Netlify → Domain settings → Add `staging.thrillwave.com`

### 4. Going live
When ready to launch:
1. In Netlify → Domain settings → Add `thrillwave.com`
2. Update your DNS A record or CNAME to point at Netlify
3. Netlify will auto-provision SSL

---

## HOW TO MAKE CHANGES

### Small edits (copy, phone numbers, client names)
1. Go to GitHub → open the file (index.html or sitrep.html)
2. Click the pencil icon to edit
3. Find the text you want to change (use Ctrl+F / Cmd+F)
4. Make the change
5. Click **Commit changes** at the bottom
6. Netlify auto-deploys in ~30 seconds

### The HTML files have comments like this marking each section:
```html
<!-- ============================================
     SECTION NAME
     TO EDIT: Instructions for what to change.
     ============================================ -->
```
Follow those instructions for common edits.

### Adding images
1. Put the image file in the `assets/` folder
2. Reference it in HTML as `assets/your-image.jpg`

### Adding a hero video
In `index.html`, find the hero section. Replace:
```html
<div class="hero-bg"></div>
```
With:
```html
<video class="hero-bg" autoplay muted loop playsinline style="object-fit:cover;width:100%;height:100%">
  <source src="assets/hero-reel.mp4" type="video/mp4">
</video>
```

### Adding a case study video
In the case study section, replace the `.vid-ph` placeholder div with:
```html
<video controls poster="assets/case-study-poster.jpg" style="width:100%;aspect-ratio:16/9;margin-bottom:64px">
  <source src="assets/case-study.mp4" type="video/mp4">
</video>
```

### Changing colors
All colors are CSS variables at the top of `styles.css`:
```css
:root{
  --orange:#e06000;    ← Accent color
  --black:#060606;     ← Background
  --white:#eee;        ← Headings
  --secondary:#999;    ← Body text
}
```
Change these to update the entire site.

---

## FONTS
- **Archivo** — Headings and body text (loaded from Google Fonts)
- **IBM Plex Mono** — Labels, data, monospace elements (loaded from Google Fonts)

---

## ADDING NEW PAGES
1. Duplicate `index.html` or `sitrep.html`
2. Rename it (e.g., `work.html`)
3. Add a redirect in `_redirects`: `/work  /work.html  200`
4. Add the URL to `sitemap.xml`
5. Add a nav link in both `index.html` and the new page

---

## TRACKING / ANALYTICS
To add Google Analytics, Meta Pixel, HubSpot, or any tracking:
1. Open `index.html` and `sitrep.html`
2. Paste the tracking script just before `</head>`
3. Commit and push

---

## QUESTIONS?
Ask Chris to bring it to Claude — any code changes, new sections, 
new pages, or major updates can be built there and handed off as files.
