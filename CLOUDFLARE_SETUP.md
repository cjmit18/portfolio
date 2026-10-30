# Cloudflare setup

The site is deployed as the existing `portfolio` Worker. `worker.js` serves the static site through Workers Static Assets and stores contact messages through the `CONTACT_DB` D1 binding.

1. Install and authenticate Wrangler:

   ```sh
   npx wrangler login
   ```

2. The production database `wayne-mitchell-contact` has been created and its ID is already configured in `wrangler.jsonc`.

   ```sh
   npx wrangler d1 create wayne-mitchell-contact
   ```

   Run this only when creating a new environment or replacing the existing database.

3. Apply the schema locally and remotely when needed:

   ```sh
   npx wrangler d1 execute wayne-mitchell-contact --local --file=schema.sql
   npx wrangler d1 execute wayne-mitchell-contact --remote --file=schema.sql
   ```

4. Install dependencies once (the Worker uses `worker-mailer` to email contact messages):

   ```sh
   npm install
   npm test
   ```

5. Contact notifications: each new contact message is saved to D1 and then emailed to `CONTACT_TO` (set in `wrangler.jsonc`) through the `SMTP_USER` mailbox (mymail@wayne-mitchell.com on Purelymail), port 465 only. Set that mailbox password as a secret:

   ```sh
   npx wrangler secret put SMTP_PASSWORD
   ```

   Without it, messages are still saved to D1 but no email is sent. To read saved messages:

   ```sh
   npx wrangler d1 execute wayne-mitchell-contact --remote --command "SELECT created_at, name, email, message FROM contact_messages ORDER BY id DESC LIMIT 20"
   ```

6. Turnstile spam check: the contact form shows a Cloudflare Turnstile widget (site key in `contact.html`), and the Worker checks each token with Cloudflare before saving a message. Store the widget's secret key as a secret **before deploying**, or the form answers "not configured":

   ```sh
   npx wrangler secret put TURNSTILE_SECRET_KEY
   ```

   Copy the secret from the Cloudflare dashboard (Turnstile, then the widget, then Settings) and paste it at the prompt, never into a file or chat. The widget's hostname list must include every domain the form runs on, such as `wayne-mitchell.com`. For local testing, put Cloudflare's always-pass test secret `1x0000000000000000000000000000000AA` in `.dev.vars` as `TURNSTILE_SECRET_KEY` and temporarily use the test site key `1x00000000000000000000AA`.

7. Preview locally or deploy the existing Worker:

   ```sh
   npx wrangler dev
   npx wrangler deploy
   ```

   The current account endpoint is `https://portfolio.cj-mitchelljr.workers.dev`.

The official agent setup instructions are available at <https://developers.cloudflare.com/agent-setup/prompt.md>. The project MCP configuration is in `.vscode/mcp.json`; restart VS Code after OAuth becomes available so the Cloudflare servers are loaded.
