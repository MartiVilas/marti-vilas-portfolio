// Both sources are needed, in this order:
//   - `process.env` is where the Vercel adapter exposes dashboard variables at
//     runtime, so reading it first means a value is never stale from build time.
//   - `import.meta.env` is the only one populated during `astro dev`; Vite does
//     not copy `.env` into `process.env`, so without this fallback local dev
//     answers 500 "Brevo API key is not configured".
// Note that naming `import.meta.env` at all makes Vite materialise the whole env
// object into the server bundle, so `.env` values end up as literals under
// `dist/` and `.vercel/`. Those are server-only and git-ignored, but never
// commit either directory.
// Empty strings collapse to `undefined` so the `??` defaults at call sites
// actually fire — `"" ?? fallback` is `""`, which silently shipped an empty
// portfolio_url in the confirmation email.
export function readEnv(key: string) {
	const runtimeEnv = process.env as Record<string, string | undefined>;
	const buildEnv = import.meta.env as unknown as Record<string, string | undefined>;
	const value = runtimeEnv[key] ?? buildEnv[key];
	const trimmed = typeof value === "string" ? value.trim() : "";

	return trimmed === "" ? undefined : trimmed;
}
