# Website Tasks

## Security Hardening (CSP)

- [x] Remove deprecated `X-XSS-Protection` header
- [x] Add `base-uri 'self'` and `form-action 'self'` to CSP
- [ ] Deploy a `Content-Security-Policy-Report-Only` header with a strict policy (no `unsafe-inline`) alongside the current permissive CSP — monitor for breakage on the live site before enforcing
- [ ] Migrate away from `unsafe-inline` in both `script-src` and `style-src`:
  - Audit all Astro inline `<script>` output (JSON-LD in `studio/index.astro`, component scripts)
  - Audit all scoped `<style>` blocks (Astro compiles these into `<style>` tags in `<head>`)
  - Option A: Use Astro middleware (`src/middleware.ts`) to generate per-request nonces and inject into CSP + inline tags
  - Option B: Use hash-based CSP — compute SHA-256 hashes of inline scripts/styles at build time
  - Either approach requires Cloudflare Workers or Astro SSR mode for dynamic nonce generation
