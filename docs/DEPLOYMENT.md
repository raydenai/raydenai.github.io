# AURA Deployment and Operations Guide

## Current durable deployment

The demo is published at **[https://raydenai.github.io/](https://raydenai.github.io/)** from the public repository **[raydenai/raydenai.github.io](https://github.com/raydenai/raydenai.github.io)**. GitHub Pages is configured for workflow deployment. Every push to `main` runs the production pipeline:

```text
checkout → pnpm install → block lint → image verification → Astro build → Pages artifact → deploy
```

The workflow lives at `.github/workflows/deploy-pages.yml`. GitHub Pages supports deployment through GitHub Actions workflows, and the action deployment creates the static public endpoint. [1]

| Gate | Command / action | Prevents |
|---|---|---|
| Dependency install | `pnpm install --frozen-lockfile` | Unreviewed dependency drift during deploy |
| Block sequence | `pnpm lint:blocks` | Missing close blocks, proof-free high-intent pages, CTA diffusion, bad page beginnings |
| Image integrity | `pnpm verify:images` | Missing assets and incorrect image dimensions |
| Site build | `pnpm build` | Schema, routing, static generation, and asset-build failures |
| Publish | `actions/deploy-pages` | Manual file transfer and untraceable production changes |

## Local development

| Task | Command | Expected result |
|---|---|---|
| Install | `pnpm install` | Reproduces locked dependency tree |
| Develop | `pnpm dev` | Local Astro server at `http://localhost:4321` |
| Validate block strategy | `pnpm lint:blocks` | Warnings and errors for persuasion / CTA structural issues |
| Validate images | `pnpm verify:images` | Confirms all declared content image files exist and dimensions match |
| Regenerate web photo derivatives | `pnpm photos:build` | Produces named responsive WebP/PNG files from private masters |
| Run visual QA | `pnpm qa:visual` | Captures mobile/desktop screenshots and writes a machine-readable report |
| Build | `pnpm build` | Static output in `dist/` |
| Preview production build | `pnpm preview` | Serves the exact production output locally |

## Environment configuration

The Astro config reads `PUBLIC_SITE_URL`. The deployment workflow sets this to the production origin so sitemap, canonical links, and Open Graph URLs are correct.

```bash
PUBLIC_SITE_URL=https://example.com pnpm build
```

Do not store private form keys, API secrets, or CRM credentials in a static Astro project. The sample form mode uses `demo://…` endpoints and intentionally stores nothing. A real production form should use a secure SaaS endpoint or a server-capable deployment architecture.

| Configuration | Where it belongs | Notes |
|---|---|---|
| Production origin | `PUBLIC_SITE_URL` environment variable | Used at build time only. |
| Analytics public IDs | Brand content / public config | Keep only values safe for the browser. |
| Form endpoint | Brand/page content | Use a provider endpoint or secure backend; test consent and notification flows. |
| API secret | Host environment / server layer | Never commit to repo or expose in `PUBLIC_*`. |
| Custom domain | GitHub Pages settings + DNS provider | Requires DNS verification and appropriate CNAME records. [2] |

## Custom-domain handoff

The current `raydenai.github.io` URL is durable. To use a branded domain, configure GitHub Pages Custom Domain in repository settings and then make the DNS changes at the domain registrar. Follow GitHub’s current custom-domain instructions; exact records depend on whether the domain is an apex/root domain or a subdomain. [2]

| Desired URL | Typical DNS approach | Required handoff |
|---|---|---|
| `www.example.com` | CNAME from `www` to `raydenai.github.io` | Set `www.example.com` in GitHub Pages custom-domain settings. |
| `example.com` | Provider-supported apex records / GitHub IP records | Configure apex records as specified by GitHub; enable HTTPS after verification. |
| `brand.example.com` | CNAME from `brand` to `raydenai.github.io` | Set subdomain in GitHub Pages custom-domain settings. |

After DNS is live, update the workflow’s `PUBLIC_SITE_URL`, deploy once, and verify canonical URL, sitemap, Open Graph preview, redirects, and HTTPS. Avoid changing DNS before the repository is ready to serve the custom host.

## Launch checklist

| Area | Required verification |
|---|---|
| Truth | Client has approved every public claim, quote, metric, media logo, photo caption, and testimonial. |
| Privacy | Form endpoint, consent wording, privacy policy, retention, and notifications are configured. |
| Links | All internal links, external links, calendar links, social profiles, and legal links resolve. |
| SEO | Site title, description, canonical URL, Open Graph image, sitemap, structured data, and robots policy are reviewed. |
| Mobile | Home, offer, contact, and blog pages are reviewed at 390px and 768px widths. |
| Accessibility | Heading hierarchy, focus state, image alt text, form labels, contrast, keyboard navigation, and reduced-motion behavior are reviewed. |
| Analytics | Primary CTA, form completion, calendar click, and key content routes are tracked. |
| Operations | At least one owner can access GitHub, DNS, form provider, and analytics accounts. |

## Rollback and incident response

Git history is the deployment history. If a production change must be reversed, identify the last healthy commit and revert it on `main`; the deployment workflow will publish the prior static state.

```bash
# Example: create a revert commit for a problematic SHA
# git revert <sha>
# git push origin main
```

For content errors such as inaccurate claims, remove or correct the affected content first, then deploy. For form or privacy incidents, disable the form endpoint immediately, update public contact instructions, and follow the client’s privacy and legal response process.

## Security model

The static site has no server-side secret surface by default. That is a benefit, not a limitation: most personal-brand marketing sites do not require a custom server to deliver fast content, collect emails via a provider, or link to a calendar. Add a backend only where there is a clear data-handling need, then treat it as a separate security boundary.

## References

[1]: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages "Using custom workflows with GitHub Pages"
[2]: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site "Configuring a custom domain for your GitHub Pages site"
