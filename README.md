# ARK Mouldtech Solutions website

Corporate website for ARK Mouldtech Solutions, Sanand GIDC, Ahmedabad.

Built with Next.js 15 (App Router), React 19, TypeScript and Tailwind CSS 4.

## Pages

| Path | Page |
| --- | --- |
| `/` | Home |
| `/about` | About Us |
| `/products` | Products & Services |
| `/infrastructure` | Infrastructure |
| `/why-choose-us` | Why Choose Us (reasons, client logos, testimonials) |
| `/contact` | Contact Us with inquiry form |

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production build
```

Requires Node.js 20 or newer.

## Content

All business content lives in `src/content/site.ts` and is read through
`src/lib/content.ts`. Step 3 replaces those getters with a MySQL database and
an admin panel at `/admin`, so the owner can edit products, machines, photos,
client logos, reviews and SEO text without touching code.

Do not add made-up clients, testimonials, certifications or machine specifications.

## Preview mode

While `SITE_PREVIEW` is not `off`, the site shows labelled placeholders where
photos, client logos and reviews will go, and asks search engines not to index
it. Set `SITE_PREVIEW=off` at launch.

## Status

- [x] Step 1: Homepage design
- [x] Step 2: All six pages (forms validate but do not send yet)
- [ ] Step 3: MySQL database, admin panel, email delivery for inquiries
- [ ] Step 4: SEO, security hardening, testing, deployment to Hostinger
