# Erika | Bounce Fit Boots — website

Live: https://wai-solutions.github.io/erika-life/

Rebound boots fitness dancing classes in Cairo (New Cairo + Heliopolis) with Erika Szenes.

## What's inside
- `index.html` — home page (story, method, schedule countdown, community, FAQ)
- `about.html` — About Erika (the erica flower, name roots, logo story, back to nature, journey)
- `booking.html` — booking page (studio, day, hour, boots size; event waitlists). Sends a prefilled message via Instagram or Messenger, no backend.
- `js/` — GSAP 3.12.5 + ScrollTrigger and Lenis 1.1.13 (vendored, no build step)
- `img/` — photos and logo
- `robots.txt`, `sitemap.xml`, `llms.txt` — SEO and AI search

## Run locally
Static site, no build. Open `index.html`, or serve the folder:
```
python3 -m http.server 8000
```

## Deploy
Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). Upload the folder as is.

When moving to a custom domain, replace `https://wai-solutions.github.io/erika-life` in `index.html`, `booking.html`, `sitemap.xml`, `robots.txt` and `llms.txt`.

## Still to add
- Studio addresses, WhatsApp number
- Google Search Console + Google Business Profile
