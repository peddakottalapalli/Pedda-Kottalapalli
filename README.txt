# Pedda Kottalapalli — Village Community Website

The public website is built with HTML, CSS, and JavaScript. The optional online dashboard uses Supabase for account sign-in, content sections, file storage, and private visitor submissions. The dashboard remains in setup mode until a Supabase project is configured.

## Admin and visitor dashboard setup

1. Create a Supabase project at https://supabase.com/ and wait for it to finish provisioning.
2. In the Supabase project, open **SQL Editor**, paste the contents of `supabase-schema.sql`, and run it. This creates tables, role checks, storage buckets, and security policies.
3. In **Project Settings > API**, copy the project URL and the **publishable/anon** key. Put them in `supabase-config.js` in the marked settings. These browser keys are public; never paste a `service_role` key, database password, or other secret into website files.
4. In Supabase **Authentication > Providers**, enable Email/password. Enable **Anonymous sign-ins** if visitors should be able to submit without creating an account.
5. Deploy the whole folder to HTTPS hosting (for example GitHub Pages, Netlify, or Cloudflare Pages). Do not preview the module-based dashboard by double-clicking `index.html`; browser `file://` mode blocks module imports. Open the deployed HTTPS address instead.
6. Visit `/admin.html`, create the account for `peddakottalapalli.official@gmail.com`, and confirm its email if required.
7. Back in **SQL Editor**, run the admin promotion query at the bottom of `supabase-schema.sql` (it updates only the matching account to the admin role). Normal sign-up never grants admin access.
8. Sign in again at `/admin.html`. Admins can add/edit/delete custom sections, choose a content layout, upload photos/videos, publish or save drafts, and review visitor submissions. Approved visitor media is copied to the public site and appears as a new section.

## Visitor submissions

- Visitors can create a normal account to see the status of their own submissions later, or choose **Continue as guest** if anonymous sign-ins are enabled.
- Guest submission history is tied to that browser's anonymous account/session and may not be recoverable if browser data is cleared or the session is lost.
- Visitor photos and videos stay in a private bucket and are not shown publicly until an admin approves them.
- Upload limit is 40 MB per file. Supported formats are JPG, PNG, WEBP, GIF, MP4, WEBM, and OGG.

## Scope and security notes

- The dashboard is a starter CMS for adding and managing database-backed sections. It can replace the main hero, About, Heritage, Events, Facilities, Gallery, Stories, Testimonials, Map, or Contact section. These replacements use a shared flexible layout; adjust HTML/CSS for bespoke layout changes.
- Supabase RLS and storage policies are essential. Never disable them to “make it work.” The public site uses only the publishable/anon key; database policies enforce the admin role.
- Back up the database and media. Review submissions before publication and only upload media you have permission to publish.

## Preview without Supabase

Open `index.html` in a browser to preview the static page. The hand-authored page still renders; online CMS sections and the dashboard need Supabase configured and the site served over HTTPS.

## Main files

- `index.html` — public landing page
- `style.css` — public design and responsive styles
- `script.js` — navigation, language selection, and basic behavior
- `site-cms.js` — reads published custom sections from Supabase
- `admin.html`, `admin.css`, `admin.js` — admin and visitor dashboard
- `supabase-config.js` — public project URL and publishable key placeholders
- `supabase-schema.sql` — database setup and row/storage security policies
