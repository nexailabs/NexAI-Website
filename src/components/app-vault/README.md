# App Vault media notes

- Canonical upload path for logos: `nexailabs/app-vault/<slug>.png` on ImageKit.
- Endpoint base: `https://ik.imagekit.io/nexailabs`.
- PR 1 fallback can use ImageKit remote-fetch at `/proxy/<encoded-url>` so the vault ships without waiting on manual uploads.
- Card logo transforms come from `src/config/imagekit.ts` (`appLogo`, `appLogo2x`).
