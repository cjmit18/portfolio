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

4. Preview locally or deploy the existing Worker:

   ```sh
   npx wrangler dev
   npx wrangler deploy
   ```

   The current account endpoint is `https://portfolio.cj-mitchelljr.workers.dev`.

The official agent setup instructions are available at <https://developers.cloudflare.com/agent-setup/prompt.md>. The project MCP configuration is in `.vscode/mcp.json`; restart VS Code after OAuth becomes available so the Cloudflare servers are loaded.
