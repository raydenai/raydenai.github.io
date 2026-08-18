/**
 * Structured data builders.
 * ---------------------------------------------------------------------------
 * This module is the system's single largest competitive advantage over the
 * source corpus. Of the 30 sites analysed, the great majority ship no Person or
 * FAQPage structured data at all — which means that when an AI answer engine or
 * a knowledge panel tries to establish "who is this person and what are they
 * known for", it has to guess from prose.
 *
 * Every page built with this system emits, automatically:
 *   - Person        (the brand owner, with sameAs identity links)
 *   - WebSite       (with SearchAction where a search page exists)
 *   - Organization  (when the brand operates under a company name)
 *   - FAQPage       (harvested from any FaqAccordion blocks on the page)
 *   - BreadcrumbList
 *   - Article       (blog posts)
 *   - Service       (from ServicesGrid entries)
 *
 * Nothing here requires the content author to think about SEO: the schema is a
 * by-product of the typed content model.
 */

type Json = Record<string, unknown>;

interface BrandLike {
  person: {
    name: string;
    jobTitle?: string;
    tagline?: string;
    bio?: string;
    knowsAbout?: string[];
    portraitUrl?: string;
    alumniOf?: string[];
    awards?: string[];
  };
  organization?: {
    name?: string;
    legalName?: string;
    logoUrl?: string;
    foundingDate?: string;
    email?: string;
    telephone?: string;
    address?: Json;
  };
  social?: { platform: string; url: string }[];
  site: { url: string; name: string; searchPath?: string };
}

const abs = (base: string, path?: string) => {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path, base).href;
};

export function personSchema(brand: BrandLike): Json {
  const base = brand.site.url;
  return {
    '@type': 'Person',
    '@id': `${base}#person`,
    name: brand.person.name,
    jobTitle: brand.person.jobTitle,
    description: brand.person.bio ?? brand.person.tagline,
    url: base,
    image: abs(base, brand.person.portraitUrl),
    knowsAbout: brand.person.knowsAbout,
    alumniOf: brand.person.alumniOf?.map((name) => ({ '@type': 'Organization', name })),
    award: brand.person.awards,
    sameAs: brand.social?.map((s) => s.url),
    worksFor: brand.organization?.name
      ? { '@id': `${base}#organization` }
      : undefined,
  };
}

export function organizationSchema(brand: BrandLike): Json | null {
  const org = brand.organization;
  if (!org?.name) return null;
  const base = brand.site.url;
  return {
    '@type': 'Organization',
    '@id': `${base}#organization`,
    name: org.name,
    legalName: org.legalName,
    url: base,
    logo: abs(base, org.logoUrl),
    foundingDate: org.foundingDate,
    email: org.email,
    telephone: org.telephone,
    address: org.address,
    founder: { '@id': `${base}#person` },
    sameAs: brand.social?.map((s) => s.url),
  };
}

export function websiteSchema(brand: BrandLike): Json {
  const base = brand.site.url;
  return {
    '@type': 'WebSite',
    '@id': `${base}#website`,
    url: base,
    name: brand.site.name,
    publisher: { '@id': `${base}#person` },
    potentialAction: brand.site.searchPath
      ? {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${base}${brand.site.searchPath}?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        }
      : undefined,
  };
}

export function webPageSchema(opts: {
  brand: BrandLike;
  url: string;
  title: string;
  description: string;
  breadcrumbs?: { name: string; url: string }[];
}): Json {
  const base = opts.brand.site.url;
  return {
    '@type': 'WebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.title,
    description: opts.description,
    isPartOf: { '@id': `${base}#website` },
    about: { '@id': `${base}#person` },
    breadcrumb:
      opts.breadcrumbs && opts.breadcrumbs.length > 1
        ? {
            '@type': 'BreadcrumbList',
            itemListElement: opts.breadcrumbs.map((crumb, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: crumb.name,
              item: crumb.url,
            })),
          }
        : undefined,
  };
}

/** Harvest FAQPage entries from any FaqAccordion blocks present on a page. */
export function faqSchema(blocks: { type: string; faqs?: { question: string; answer: string }[] }[]): Json | null {
  const faqs = blocks
    .filter((b) => b.type === 'FaqAccordion')
    .flatMap((b) => b.faqs ?? []);
  if (faqs.length === 0) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/** Harvest Service entries from ServicesGrid blocks. */
export function servicesSchema(
  brand: BrandLike,
  blocks: { type: string; services?: { name: string; description: string; price?: string }[] }[],
): Json[] {
  const base = brand.site.url;
  return blocks
    .filter((b) => b.type === 'ServicesGrid')
    .flatMap((b) => b.services ?? [])
    .map((service) => ({
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: { '@id': `${base}#person` },
      areaServed: 'Worldwide',
      offers: service.price
        ? { '@type': 'Offer', price: service.price, priceCurrency: 'USD' }
        : undefined,
    }));
}

export function articleSchema(opts: {
  brand: BrandLike;
  url: string;
  title: string;
  description: string;
  publishDate: Date;
  updatedDate?: Date;
  imageUrl?: string;
  category?: string;
  tags?: string[];
}): Json {
  const base = opts.brand.site.url;
  return {
    '@type': 'BlogPosting',
    '@id': `${opts.url}#article`,
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.publishDate.toISOString(),
    dateModified: (opts.updatedDate ?? opts.publishDate).toISOString(),
    image: abs(base, opts.imageUrl),
    articleSection: opts.category,
    keywords: opts.tags?.join(', '),
    author: { '@id': `${base}#person` },
    publisher: { '@id': `${base}#person` },
    isPartOf: { '@id': `${base}#website` },
    mainEntityOfPage: { '@id': `${opts.url}#webpage` },
  };
}

/** Strip undefined/null recursively and wrap in an @graph document. */
export function graph(nodes: (Json | null | undefined)[]): string {
  const clean = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      const arr = value.map(clean).filter((v) => v !== undefined);
      return arr.length ? arr : undefined;
    }
    if (value && typeof value === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value)) {
        const cleaned = clean(v);
        if (cleaned !== undefined && cleaned !== null && cleaned !== '') out[k] = cleaned;
      }
      return Object.keys(out).length ? out : undefined;
    }
    return value ?? undefined;
  };

  const graphNodes = nodes.map(clean).filter(Boolean);
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graphNodes });
}
