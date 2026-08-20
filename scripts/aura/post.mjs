import { join } from 'node:path';
import { clientFile, parseArgs, readYaml, safeSlugFromArg, writeText } from './lib.mjs';
import { getByKey } from './profiles.mjs';

const args = parseArgs();
const clientSlug = safeSlugFromArg(args);
const title = args.title;
if (!title || title === true) throw new Error('Provide --title "A specific, decision-relevant article title".');
const articleSlug = String(args.postSlug || title)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
if (!articleSlug) throw new Error('Could not make an MDX slug from --title. Provide --postSlug in kebab-case.');

const brief = readYaml(clientFile(clientSlug, '00-intake', 'client-brief.yaml'));
const evidence = readYaml(clientFile(clientSlug, '00-intake', 'evidence-register.yaml'));
const strategy = readYaml(clientFile(clientSlug, '01-strategy', 'strategy.yaml'));
const profile = getByKey(strategy.architecture);
if (!profile) throw new Error(`Unknown architecture: ${strategy.architecture}`);

const editorial = {
  'private-signal': { series: 'Field Notes', job: 'Make private judgment legible without turning the author into a content performer.', cta: 'Request a private conversation', category: 'Executive Authority' },
  'authority-speaking': { series: 'Rehearsal Notes', job: 'Help an event buyer and leadership audience understand a behavior change before booking.', cta: 'Check speaking availability', category: 'Leadership Communication' },
  'creator-education': { series: 'Working Sessions', job: 'Teach a useful first move and route the reader to an appropriate learning path.', cta: 'Start here', category: 'Learning' },
  'niche-specialist': { series: 'Constraint Notes', job: 'Name the buyer’s diagnostic problem and show rigorous operating insight.', cta: 'Start a decision-flow assessment', category: 'Product Operations' },
  'manifesto-movement': { series: 'Manifesto Letters', job: 'Strengthen the point of view and gather aligned readers.', cta: 'Join the work', category: 'Point of View' },
  'enterprise-b2b': { series: 'Implementation Notes', job: 'Help a buying committee surface operating constraints before a major implementation decision.', cta: 'Request a discovery brief', category: 'Enterprise Operations' },
  'portfolio-ip': { series: 'Build Notes', job: 'Make ideas, ventures and intellectual property navigable.', cta: 'Explore the work', category: 'Ideas and Ventures' },
}[strategy.architecture];

const allowedClaims = (evidence.claims || [])
  .filter((claim) => ['approved', 'approved_anonymized', 'concept_only'].includes(claim.status))
  .map((claim) => `- ${claim.claim_id}: ${claim.claim_text} (${claim.status}; ${claim.scope})`)
  .join('\n') || '- No publishable claims currently exist.';

const category = args.category || editorial.category;
const intent = args.intent || editorial.job;
const today = new Date().toISOString().slice(0, 10);
const body = `---
title: ${JSON.stringify(title)}
description: "[NEEDS APPROVAL: Write a specific reader promise consistent with the article thesis.]"
publishDate: ${today}
author: ${JSON.stringify(brief.project?.brand_name || '[NEEDS APPROVAL: author]')}
category: ${JSON.stringify(category)}
tags: ${JSON.stringify([strategy.architecture, category.toLowerCase(), 'aura-compiler'])}
readingTime: "[NEEDS APPROVAL: reading time]"
featured: false
cover:
  src: "/images/${clientSlug}/[NEEDS-APPROVAL]-cover.webp"
  alt: "[NEEDS APPROVAL: meaningful cover description]"
  width: 1920
  height: 1280
---

<!--
AURA Compiler MDX candidate
Client pack: ${clientSlug}
Architecture: ${strategy.architecture}
Series: ${editorial.series}
Intent: ${intent}
Primary CTA: ${editorial.cta}

Allowed evidence:
${allowedClaims}

Do not invent client names, metrics, endorsements, published media, events, credentials, testimonials or results.
-->

# ${title}

[NEEDS APPROVAL: Open with the precise situation your primary buyer recognizes. Do not start with biography or a generic trend statement.]

## The pattern worth noticing

[NEEDS APPROVAL: Explain the observed pattern in clear language. For ${strategy.architecture}, the editorial job is: ${editorial.job}]

## What the default gets wrong

[NEEDS APPROVAL: Name the status quo or category enemy only as strongly as the approved thesis supports.]

## A better operating move

[NEEDS APPROVAL: Teach one actionable move connected to ${brief.position?.named_method?.name || 'the named method'}. Use only allowed claim IDs above.] 

## Where this applies—and where it does not

[NEEDS APPROVAL: Add a candid fit / exclusion boundary.]

## The next useful step

[NEEDS APPROVAL: Close with the primary action “${editorial.cta}” only when the reader has the readiness described in the client pack.]
`;

const path = join(clientFile(clientSlug, '03-production', 'mdx'), `${articleSlug}.mdx`);
writeText(path, body);
console.log(`Generated archetype-aware MDX candidate: ${path}`);
console.log(`Series: ${editorial.series} | Architecture: ${strategy.architecture} | Primary CTA: ${editorial.cta}`);
