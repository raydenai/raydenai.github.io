# Custom Domain and Contact Form Production Runbook

This AURA deployment is a static Astro site served from GitHub Pages. It is already live on `https://raydenai.github.io/`. The custom domain and contact backend are deliberately **not activated** until the domain owner and form recipient are confirmed.

> **Why the pause matters:** A domain must be verified and controlled by its owner, while a production form endpoint sends visitor information to a named recipient. Those are user-controlled production decisions, not safe defaults for a fictional demo.

## 1. What is ready now

| Capability | Status | Where it is configured |
|---|---|---|
| Canonical site URL | Ready | `PUBLIC_SITE_URL` build variable |
| Custom GitHub Pages domain | Ready for owner-provided domain | GitHub Pages custom-domain setting + DNS |
| HTTPS | Available after valid DNS and Pages provisioning | GitHub Pages setting |
| Contact form UI | Ready | `ContactSplit` and shared `Form.astro` primitive |
| Safe pre-activation behavior | Active | `config://contact` resolves to non-collecting demo mode until endpoint exists |
| Form backend integration | Ready for Formspree endpoint | `PUBLIC_FORM_ENDPOINT` repository variable |
| Form metadata / bot trap | Active | `_aura_form`, `_aura_source`, and hidden honeypot fields |
| Form analytics event | Active after successful submission | `form_submit` data-layer event |

## 2. Recommended production architecture

For a static GitHub Pages site, use **Formspree** as the contact-form backend. Its standard endpoint accepts a normal HTML form post, so AURA retains progressive enhancement and does not need to expose a mail password, server key, or SMTP credential in static code. Formspree also offers validation, submission storage, notifications, integrations, and spam controls. [1]

| Layer | Recommended choice | Reason |
|---|---|---|
| Website | Astro static build + GitHub Pages | Already deployed, version-controlled, and automatically built |
| Domain | Your registrar / DNS host | You retain ownership and DNS control |
| Contact delivery | Formspree form endpoint | Works from static HTML without a server-side secret |
| Booking | Calendar URL in `brand.json` / `contact.json` | Separate scheduling from open-ended contact |
| CRM / notifications | Formspree integration or webhook after delivery is verified | Avoids complexity before the basic path works |
| Spam protection | Formspree domain restriction + reCAPTCHA, then provider filtering | Provider documentation identifies reCAPTCHA as the most effective control. [2] |

The public Formspree endpoint has the format `https://formspree.io/f/YOUR_FORM_ID`. The ID is intended to be included in the static form action. Do **not** put a private Formspree API token, mailbox password, or private CRM token into the Astro repository or build variables. [1]

## 3. Custom domain activation: information needed

Send the following items before activation.

| Needed from you | Example | Why |
|---|---|---|
| Exact primary domain | `yourname.com` or `www.yourname.com` | Determines canonical URL and the Pages setting |
| Preferred canonical hostname | `www.yourname.com` or `yourname.com` | GitHub Pages redirects the counterpart when both are correctly configured. [3] |
| DNS provider | Cloudflare, Squarespace Domains, Namecheap, GoDaddy, etc. | Determines the exact screen / automation path |
| Confirmation that you control the DNS account | Yes | Required to add verification and routing records |
| Whether email already uses the domain | Yes / no | Prevents us from disturbing MX, SPF, DKIM, or existing mail records |

### Recommended domain pattern

Use `www.yourdomain.com` as the canonical hostname and route the apex `yourdomain.com` to it, or use the apex as canonical and route `www` to it. GitHub recommends configuring an apex and its `www` variant together for HTTPS-secured sites. [3]

### DNS records for this repository

This repository is a user site at `raydenai.github.io`. Once you provide the actual domain, replace `YOURDOMAIN.COM` below with the approved value.

| Purpose | Record | Host / name | Value |
|---|---|---|---|
| Apex web routing | `A` | `@` | `185.199.108.153` |
| Apex web routing | `A` | `@` | `185.199.109.153` |
| Apex web routing | `A` | `@` | `185.199.110.153` |
| Apex web routing | `A` | `@` | `185.199.111.153` |
| `www` routing | `CNAME` | `www` | `raydenai.github.io` |
| Ownership verification | `TXT` | Value supplied by the GitHub Pages verified-domain flow | Value supplied by GitHub |

GitHub documents the four apex `A` records and the `www` CNAME target above. It recommends verifying a domain before attaching it and explicitly advises against wildcard DNS records because of takeover risk. [3] [4]

### Activation sequence

1. **Verify ownership first.** In GitHub account settings, add the domain under Pages verified domains. GitHub gives you a unique TXT record. Add that TXT record in your DNS host, wait for propagation, and verify. Keep the TXT record after verification. [4]
2. **Add the desired DNS routing records.** For an apex use the four `A` records above (or your DNS host’s `ALIAS` / `ANAME` pointed to `raydenai.github.io`). For `www`, use a CNAME directly to `raydenai.github.io`. Do not point `www` to the apex. [3]
3. **Attach the custom domain in repository Pages settings.** The production site uses a GitHub Actions deployment, so GitHub manages the Pages domain setting and a repository `CNAME` file is not necessary. [3]
4. **Set the canonical build variable.** Replace the workflow variable with the final canonical `https://…` URL.
5. **Wait for HTTPS.** Enable “Enforce HTTPS” once GitHub Pages makes it available. DNS and certificate provisioning can take time. [3]
6. **Verify both hostnames.** Test `https://yourdomain.com`, `https://www.yourdomain.com`, the canonical tag, navigation links, sitemap, social image, and form submission.

### Build variable command

After the canonical domain has been approved, the deployment manager can set the public URL variable with:

```bash
gh variable set PUBLIC_SITE_URL \
  --repo raydenai/raydenai.github.io \
  --body 'https://www.YOURDOMAIN.COM'
```

Then push any harmless source change or manually run the Pages workflow so Astro rebuilds canonical URLs and the sitemap with the final hostname.

## 4. Contact form activation: Formspree

### Step A — Create the form

1. Create a Formspree account under the inbox owner who should receive enquiries.
2. Create a form called `Website contact`.
3. Configure the recipient / notification email and confirm that email address.
4. Copy the unique form action endpoint, such as `https://formspree.io/f/abcdexyz`.
5. In Formspree, restrict the form to the final domain(s), enable reCAPTCHA or the provider’s preferred anti-spam control, and configure notification / auto-response copy. Formspree recommends a form ID URL instead of an email URL, domain restriction, and reCAPTCHA for spam prevention. [2]

### Step B — Set the public build variable

```bash
gh variable set PUBLIC_FORM_ENDPOINT \
  --repo raydenai/raydenai.github.io \
  --body 'https://formspree.io/f/YOUR_FORM_ID'
```

The repository workflow passes this public endpoint to Astro only at build time. `ContactSplit` already uses `config://contact`; the shared form primitive resolves that token to the build-time endpoint. Before this variable exists, the same form remains in no-data-collection demo mode.

### Step C — Deploy and test

```bash
git commit --allow-empty -m "Configure production contact form"
git push
```

Then test using a real, non-sensitive message:

| Test | Expected result |
|---|---|
| Valid submission | Inline success state, provider inbox record, recipient notification |
| Required field missing | Browser native validation prevents submission |
| Invalid email | Browser / provider validation error |
| Honeypot filled | Provider spam rule or provider filter handles it; confirm no lead workflow occurs |
| Direct email link | Opens the approved mailbox without any form dependency |
| Mobile submit | Button remains usable and confirmation text is visible |
| Analytics | One `form_submit` event after a successful response |

Do not run ads, newsletter sends, or other high-volume traffic until the real submission and notification path is verified.

## 5. Change the contact recipient or provider later

The integration point is deliberately provider-neutral. For Formspree, replace `PUBLIC_FORM_ENDPOINT`; for another provider, supply its HTTPS form POST endpoint if it supports cross-origin `multipart/form-data` posts from static HTML. The shared form retains provider-neutral source metadata and honeypot fields. If a provider requires a secret key or a server-side token, do **not** put it into this GitHub Pages site. Move the contact request through a secure serverless endpoint or use the AURA full-stack deployment path.

## 6. Operating checklist

| Event | Required action |
|---|---|
| Domain registrar changes | Re-check DNS, verified domain, HTTPS, and redirects |
| New form endpoint | Set `PUBLIC_FORM_ENDPOINT`, deploy, submit a test lead |
| Team / inbox change | Update Formspree recipient first, then test notification delivery |
| Provider compromise or excess spam | Rotate / recreate the form endpoint, restrict domains, enable stronger anti-spam controls |
| Site shutdown | Remove the custom domain from GitHub Pages and DNS together to avoid stale routing / takeover risk |
| New brand clone | Use a new form per brand and a new domain variable; never re-use another client’s inbox endpoint |

## References

[1]: https://formspree.io/ "Formspree — Custom Forms with No Server Code"
[2]: https://help.formspree.io/articles/troubleshooting/how-to-prevent-spam "Formspree — How to Prevent Spam"
[3]: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site "GitHub Docs — Managing a Custom Domain for Your GitHub Pages Site"
[4]: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages "GitHub Docs — Verifying Your Custom Domain for GitHub Pages"
