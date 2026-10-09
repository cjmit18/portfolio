# Portfolio

Personal portfolio site for Wayne Mitchell: about, skills, projects, resume, and a contact form.

## Pages

- `index.html` – home / about
- `skills.html` – skills
- `projects.html` – project showcase (demo videos in `assets/`)
- `resume.html` / `resume.pdf` – resume
- `contact.html` – contact form
- `rework/` – a static build of the ReWork project demo

## How it works

The site is static HTML/CSS served through a Cloudflare Worker using Workers Static Assets. `worker.js` handles `/api/*` requests: the contact form posts JSON to the Worker, which validates it (including a honeypot field) and stores the message in a Cloudflare D1 database (`CONTACT_DB`, schema in `schema.sql`).

## Development

```sh
npx wrangler dev      # preview locally
npx wrangler deploy   # deploy the Worker
```

See [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) for D1 setup and schema migration steps. A GitHub Actions workflow in `.github/workflows` also deploys the static content to GitHub Pages on pushes to `main`.
