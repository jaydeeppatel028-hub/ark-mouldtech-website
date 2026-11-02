# ARK Mouldtech Solutions website

Corporate website for ARK Mouldtech Solutions, Sanand GIDC, Ahmedabad.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4,
Drizzle ORM and MySQL (MariaDB works too).

## Pages

| Path | Page |
| --- | --- |
| `/` | Home |
| `/about` | About Us |
| `/products` | Products & Services |
| `/infrastructure` | Infrastructure |
| `/why-choose-us` | Why Choose Us (reasons, client logos, testimonials) |
| `/contact` | Contact Us with inquiry form |
| `/admin` | Admin panel (login required) |

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values you need
npm run dev                  # http://localhost:3000
npm run lint && npm run typecheck
npm run build && npm start   # production build
```

Requires Node.js 20.9 or newer (22 recommended). Without `DATABASE_URL` the public pages still
work and show the starter content in `src/content/site.ts`.

## Database and first admin

1. Create an empty MySQL database and user (on Hostinger: hPanel, Databases).
2. Set `DATABASE_URL` and a long random `SETUP_TOKEN`, then start the site.
3. Open `/admin/setup`, enter the setup token, your name, email and a
   password (12+ characters with a letter and a number). This creates the
   tables, loads the starter content and signs you in.
4. The setup page closes itself once an admin exists. Remove `SETUP_TOKEN`.

The same can be done from a terminal:

```bash
DATABASE_URL=mysql://user:pass@host:3306/db npm run db:setup
DATABASE_URL=mysql://user:pass@host:3306/db npm run admin:create -- owner@example.com "Owner Name"
```

`admin:create` also resets the password of an existing admin and signs them
out everywhere. There is no public sign-up page.

## Admin panel

| Section | What it edits |
| --- | --- |
| Inquiries | Contact form submissions: filter by status, mark contacted or completed, delete, export to Excel (CSV) |
| Products, Categories | Products & Services page and homepage category cards |
| Machines, Gallery | Infrastructure page |
| Client logos, Reviews | Homepage, Why Choose Us and Contact pages |
| Company info | Phone, emails, address, About, mission and vision text, workshop area, map location |
| SEO | Page titles, descriptions and keywords |
| Password | Change your password (signs out other devices) |

Uploaded images (JPG, PNG, WebP up to 10 MB) are checked, resized, converted
to WebP with location data removed, and stored in the database so they are
included in database backups and survive redeploys. They are served from
`/media/<id>`.

## Security notes

- Passwords are hashed with scrypt. Sessions are random tokens stored hashed,
  in an http-only cookie that lasts 7 days.
- Login is limited to 5 attempts per 15 minutes per email and connection,
  30 per connection, and 20 per hour per account whatever the connection.
- Every admin page and action checks the session on the server.
- The inquiry form has a hidden spam trap, a minimum fill time, a limit of
  5 inquiries per 10 minutes per connection, and server-side validation.
- Secrets live only in environment variables, never in code.
- Every page is sent with a Content-Security-Policy that carries a fresh nonce
  (`src/middleware.ts`), so the browser runs only scripts this site served.
  Other headers (HSTS, nosniff, frame and referrer rules) are in `next.config.ts`.
- `npm audit --omit=dev` reports no known vulnerabilities as of 1 Nov 2026.

## Deploying to Hostinger

Hostinger's Node.js web app hosting (Business/"Unlimited" or Cloud plans) builds
this repository straight from GitHub.

1. hPanel, Websites, Add Website, **Node.js web app**, connect GitHub and pick
   this repository and the `main` branch. Framework: Next.js (auto-detected),
   Node 22, build command `npm run build`, output directory `.next`.
2. Create the MySQL database in hPanel (Databases). Use host `127.0.0.1`, not
   `localhost`.
3. Add the environment variables from `.env.example` (Environment variables
   screen or **Import .env**). Saving them redeploys the app.
4. Open `/admin/setup` once to create the tables and the first admin, then
   remove `SETUP_TOKEN`.
5. When the content is ready, set `SITE_PREVIEW=off` so Google may index the site.

Pushes to `main` redeploy automatically. Uploaded images live in the database,
so redeploys never lose them; back up the database (hPanel daily backups plus
an occasional phpMyAdmin export).

## Content rules

Do not add made-up clients, testimonials, certifications or machine
specifications. Only details the company confirms should be entered.

## Preview mode

While `SITE_PREVIEW` is not `off`, the site shows labelled placeholders where
photos, client logos and reviews will go, and asks search engines not to index
it. Set `SITE_PREVIEW=off` at launch.

## Status

- [x] Step 1: Homepage design
- [x] Step 2: All six pages
- [x] Step 3: MySQL database, admin panel, inquiry storage and email alerts (tested against a local SMTP server; real mailbox still to be tested)
- [ ] Step 4: SEO, security hardening, testing (done); deployment to Hostinger (waiting for hosting purchase)
