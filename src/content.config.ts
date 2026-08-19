import { defineCollection, z, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';

/* ============================================================================
   AURA CONTENT MODEL
   ----------------------------------------------------------------------------
   This is the heart of the system. Everything a client site needs to say is
   expressed as typed data, not as hand-built page-builder layouts.

   Three collections:
     brand  — one file per client: identity, positioning, proof, offers, theme
     pages  — composed page definitions (ordered list of blocks + props)
     posts  — MDX articles

   Because pages are data, an AI agent (or a human) can author a complete site
   by writing JSON/YAML that the schema validates at build time. A malformed
   site fails the build instead of shipping broken.
   ========================================================================= */

/* --- Shared primitives ---------------------------------------------------- */

const image = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  /** Focal point for art-directed crops, e.g. "50% 20%" */
  position: z.string().optional(),
});

const cta = z.object({
  label: z.string(),
  href: z.string(),
  /** Conversion tier this CTA belongs to — drives analytics + hierarchy rules */
  intent: z.enum(['primary', 'secondary', 'tertiary']).default('primary'),
  variant: z.enum(['primary', 'secondary', 'ghost', 'inverse']).optional(),
  /** Opens a lightbox instead of navigating (video CTAs) */
  modal: z.enum(['video', 'form', 'none']).default('none'),
  external: z.boolean().default(false),
  /** dataLayer event name for measurement */
  event: z.string().optional(),
});

const stat = z.object({
  value: z.string(),
  label: z.string(),
  detail: z.string().optional(),
});

const testimonial = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
  company: z.string().optional(),
  avatar: image.optional(),
  /** Concrete outcome — the corpus's strongest testimonials always have one */
  result: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  videoUrl: z.string().optional(),
  featured: z.boolean().default(false),
});

const logo = z.object({
  src: z.string(),
  alt: z.string(),
  href: z.string().optional(),
  /** Render width in px for optical balancing of mixed-weight logos */
  width: z.number().optional(),
});

const tone = z.enum(['default', 'raised', 'inverse', 'accent']).default('default');
const pad = z.enum(['none', 'tight', 'default', 'loose']).default('default');
const containerWidth = z.enum(['narrow', 'content', 'base', 'wide', 'full']).default('base');

/** Every block shares this envelope. */
const blockBase = {
  /** Anchor id for in-page nav */
  id: z.string().optional(),
  tone: tone,
  pad: pad,
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  /** Word(s) inside `heading` to emphasise, plus how */
  mark: z
    .object({
      word: z.string(),
      style: z.enum(['accent', 'underline', 'script', 'outline']).default('accent'),
    })
    .optional(),
  subheading: z.string().optional(),
  body: z.string().optional(),
  align: z.enum(['start', 'center']).default('start'),
  width: containerWidth,
  ctas: z.array(cta).default([]),
  /** Turn on scroll reveal for this block */
  reveal: z.boolean().default(true),
};

/* --- The block union ----------------------------------------------------- */
/* Each variant is discriminated by `type`, so authoring is type-safe and the
   renderer can switch exhaustively. Grouped by the nine block families. */

const blockSchema = z.discriminatedUnion('type', [
  /* ---- A. HERO ---------------------------------------------------------- */
  z.object({
    type: z.literal('HeroSplitPortrait'),
    ...blockBase,
    portrait: image,
    portraitTreatment: z
      .enum(['cutout', 'framed', 'arch', 'duotone'])
      .default('cutout'),
    mediaSide: z.enum(['left', 'right']).default('right'),
    /** Rotating words, e.g. BUSINESS / FAMILY / LEGACY (Scott Jarred pattern) */
    rotatingWords: z.array(z.string()).default([]),
    badges: z.array(z.string()).default([]),
    floatingProof: testimonial.optional(),
    stats: z.array(stat).default([]),
    backdrop: z.enum(['none', 'glow', 'grain', 'both']).default('both'),
  }),
  z.object({
    type: z.literal('HeroSplitOptin'),
    ...blockBase,
    portrait: image,
    mediaSide: z.enum(['left', 'right']).default('left'),
    form: z.object({
      action: z.string(),
      fields: z.array(z.enum(['firstName', 'lastName', 'email', 'phone', 'company'])),
      submitLabel: z.string(),
      consentNote: z.string().optional(),
    }),
    socialProofNote: z.string().optional(),
  }),
  z.object({
    type: z.literal('HeroCenteredStatement'),
    ...blockBase,
    rotatingWords: z.array(z.string()).default([]),
    background: image.optional(),
    overlayOpacity: z.number().min(0).max(1).default(0.62),
    videoUrl: z.string().optional(),
  }),
  z.object({
    type: z.literal('HeroVideoOverlay'),
    ...blockBase,
    background: image,
    videoUrl: z.string(),
    overlayOpacity: z.number().min(0).max(1).default(0.55),
    playLabel: z.string().default('Play film'),
  }),
  z.object({
    type: z.literal('HeroSegmented'),
    ...blockBase,
    background: image.optional(),
    segments: z
      .array(
        z.object({
          label: z.string(),
          description: z.string().optional(),
          href: z.string(),
        }),
      )
      .min(2),
  }),

  /* ---- B. PROOF --------------------------------------------------------- */
  z.object({
    type: z.literal('LogoStrip'),
    ...blockBase,
    logos: z.array(logo).min(1),
    marquee: z.boolean().default(false),
    grayscale: z.boolean().default(true),
  }),
  z.object({
    type: z.literal('CredibilityBar'),
    ...blockBase,
    stats: z.array(stat).min(2),
    /** Animate numbers when scrolled into view */
    animate: z.boolean().default(true),
  }),
  z.object({
    type: z.literal('CredibilityStack'),
    ...blockBase,
    credentials: z
      .array(
        z.object({
          title: z.string(),
          value: z.string(),
          detail: z.string().optional(),
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal('AuthorityQuote'),
    ...blockBase,
    testimonial: testimonial,
  }),
  z.object({
    type: z.literal('TestimonialGrid'),
    ...blockBase,
    testimonials: z.array(testimonial).min(1),
    layout: z.enum(['grid', 'masonry', 'columns']).default('grid'),
    columns: z.number().min(1).max(4).default(3),
  }),
  z.object({
    type: z.literal('TestimonialSlider'),
    ...blockBase,
    testimonials: z.array(testimonial).min(1),
    autoplay: z.boolean().default(false),
  }),
  z.object({
    type: z.literal('AssociationGrid'),
    ...blockBase,
    people: z
      .array(
        z.object({
          name: z.string(),
          role: z.string().optional(),
          thumbnail: image,
          videoUrl: z.string().optional(),
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal('ResultsGrid'),
    ...blockBase,
    results: z
      .array(
        z.object({
          client: z.string(),
          headline: z.string(),
          before: z.string().optional(),
          after: z.string().optional(),
          metric: z.string().optional(),
          image: image.optional(),
          href: z.string().optional(),
        }),
      )
      .min(1),
  }),

  /* ---- C. PROBLEM ------------------------------------------------------- */
  z.object({
    type: z.literal('ProblemAgitation'),
    ...blockBase,
    painPoints: z.array(z.string()).default([]),
    media: image.optional(),
    mediaSide: z.enum(['left', 'right']).default('left'),
  }),
  z.object({
    type: z.literal('EmpathyQuoteWall'),
    ...blockBase,
    /** Verbatim things the audience actually says (Pam Hendrickson pattern) */
    quotes: z.array(z.string()).min(2),
    reaction: z.string().optional(),
  }),
  z.object({
    type: z.literal('AudienceQualifier'),
    ...blockBase,
    forWhom: z.array(z.string()).default([]),
    notForWhom: z.array(z.string()).default([]),
  }),
  z.object({
    type: z.literal('FuturePacing'),
    ...blockBase,
    outcomes: z.array(z.string()).min(1),
    media: image.optional(),
    mediaSide: z.enum(['left', 'right']).default('right'),
  }),
  z.object({
    type: z.literal('IconGrid'),
    ...blockBase,
    items: z
      .array(
        z.object({
          icon: z.string().optional(),
          title: z.string(),
          description: z.string().optional(),
        }),
      )
      .min(2),
    columns: z.number().min(2).max(4).default(3),
  }),

  /* ---- D. MECHANISM ----------------------------------------------------- */
  z.object({
    type: z.literal('MethodologyPillars'),
    ...blockBase,
    methodName: z.string().optional(),
    pillars: z
      .array(
        z.object({
          name: z.string(),
          summary: z.string(),
          detail: z.string().optional(),
          icon: z.string().optional(),
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal('NumberedFramework'),
    ...blockBase,
    methodName: z.string().optional(),
    steps: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
        }),
      )
      .min(2),
    columns: z.number().min(1).max(3).default(3),
  }),
  z.object({
    type: z.literal('PrincipleZigZag'),
    ...blockBase,
    principles: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          image: image.optional(),
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal('ProcessTimeline'),
    ...blockBase,
    steps: z
      .array(
        z.object({
          label: z.string(),
          title: z.string(),
          description: z.string(),
          duration: z.string().optional(),
        }),
      )
      .min(2),
  }),

  /* ---- E. STORY --------------------------------------------------------- */
  z.object({
    type: z.literal('OriginStory'),
    ...blockBase,
    excerpt: z.string(),
    portrait: image.optional(),
    mediaSide: z.enum(['left', 'right']).default('right'),
    signature: image.optional(),
  }),
  z.object({
    type: z.literal('CrucibleMoment'),
    ...blockBase,
    /** The single turning-point vignette. Highest-leverage copy in the corpus. */
    moment: z.string(),
    year: z.string().optional(),
    aftermath: z.string().optional(),
    background: image.optional(),
  }),
  z.object({
    type: z.literal('Manifesto'),
    ...blockBase,
    beliefs: z.array(z.string()).default([]),
    videoUrl: z.string().optional(),
    signature: image.optional(),
    attribution: z.string().optional(),
  }),
  z.object({
    type: z.literal('IdentityCallout'),
    ...blockBase,
    /** Tribe-filtering call-out, e.g. "Are you a High-Frequency Alien?" */
    traits: z.array(z.string()).default([]),
  }),

  /* ---- F. OFFER --------------------------------------------------------- */
  z.object({
    type: z.literal('ServicesGrid'),
    ...blockBase,
    services: z
      .array(
        z.object({
          name: z.string(),
          tagline: z.string().optional(),
          description: z.string(),
          forWhom: z.string().optional(),
          price: z.string().optional(),
          image: image.optional(),
          cta: cta.optional(),
          featured: z.boolean().default(false),
        }),
      )
      .min(1),
    columns: z.number().min(1).max(4).default(3),
  }),
  z.object({
    type: z.literal('OfferLadder'),
    ...blockBase,
    rungs: z
      .array(
        z.object({
          tier: z.enum(['free', 'low', 'mid', 'high']),
          name: z.string(),
          description: z.string(),
          price: z.string().optional(),
          cta: cta,
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal('HighTicketOffer'),
    ...blockBase,
    deliverables: z.array(z.string()).min(1),
    idealFor: z.array(z.string()).default([]),
    investment: z.string().optional(),
    media: image.optional(),
    mediaSide: z.enum(['left', 'right']).default('right'),
  }),
  z.object({
    type: z.literal('SpeakingTopics'),
    ...blockBase,
    topics: z
      .array(
        z.object({
          title: z.string(),
          audience: z.string().optional(),
          description: z.string(),
          takeaways: z.array(z.string()).default([]),
        }),
      )
      .min(1),
    reelUrl: z.string().optional(),
    eventLogos: z.array(logo).default([]),
  }),

  /* ---- G. CONTENT ------------------------------------------------------- */
  z.object({
    type: z.literal('BookShowcase'),
    ...blockBase,
    books: z
      .array(
        z.object({
          title: z.string(),
          subtitle: z.string().optional(),
          description: z.string(),
          cover: image,
          badge: z.string().optional(),
          rating: z.number().optional(),
          reviewCount: z.number().optional(),
          ctas: z.array(cta).default([]),
        }),
      )
      .min(1),
  }),
  z.object({
    type: z.literal('PodcastPromo'),
    ...blockBase,
    showName: z.string(),
    artwork: image.optional(),
    platforms: z.array(z.object({ name: z.string(), href: z.string() })).default([]),
    episodes: z
      .array(
        z.object({
          title: z.string(),
          guest: z.string().optional(),
          href: z.string(),
          thumbnail: image.optional(),
        }),
      )
      .default([]),
  }),
  z.object({
    type: z.literal('VideoGrid'),
    ...blockBase,
    videos: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
          thumbnail: image,
          duration: z.string().optional(),
        }),
      )
      .min(1),
    columns: z.number().min(2).max(4).default(3),
  }),
  z.object({
    type: z.literal('MediaFeatures'),
    ...blockBase,
    features: z
      .array(
        z.object({
          outlet: z.string(),
          title: z.string(),
          href: z.string(),
          date: z.string().optional(),
          image: image.optional(),
        }),
      )
      .min(1),
  }),
  z.object({
    type: z.literal('PostsGrid'),
    ...blockBase,
    /** Empty = latest N posts from the posts collection */
    slugs: z.array(z.string()).default([]),
    limit: z.number().default(3),
  }),
  z.object({
    type: z.literal('PersonalStats'),
    ...blockBase,
    stats: z.array(stat).min(2),
  }),

  /* ---- H. CONVERSION ---------------------------------------------------- */
  z.object({
    type: z.literal('LeadMagnet'),
    ...blockBase,
    magnetName: z.string(),
    benefits: z.array(z.string()).default([]),
    mockup: image.optional(),
    mediaSide: z.enum(['left', 'right']).default('left'),
    form: z.object({
      action: z.string(),
      fields: z.array(z.enum(['firstName', 'lastName', 'email', 'phone', 'company'])),
      submitLabel: z.string(),
      consentNote: z.string().optional(),
    }),
  }),
  z.object({
    type: z.literal('LeadMagnetBanner'),
    ...blockBase,
    magnetName: z.string(),
    form: z.object({
      action: z.string(),
      fields: z.array(z.enum(['firstName', 'lastName', 'email', 'phone', 'company'])),
      submitLabel: z.string(),
      consentNote: z.string().optional(),
    }),
  }),
  z.object({
    type: z.literal('DualCtaTransition'),
    ...blockBase,
  }),
  z.object({
    type: z.literal('FinalCta'),
    ...blockBase,
    background: image.optional(),
    reassurance: z.array(z.string()).default([]),
  }),
  z.object({
    type: z.literal('ApplicationForm'),
    ...blockBase,
    form: z.object({
      action: z.string(),
      fields: z.array(
        z.object({
          name: z.string(),
          label: z.string(),
          type: z.enum(['text', 'email', 'tel', 'textarea', 'select', 'checkbox']),
          required: z.boolean().default(true),
          options: z.array(z.string()).default([]),
          placeholder: z.string().optional(),
        }),
      ),
      submitLabel: z.string(),
      consentNote: z.string().optional(),
    }),
    /** Objection-removal bullets shown beside the form */
    reassurance: z.array(z.string()).default([]),
    /** Explicit statement of what happens after submission */
    afterSubmit: z.string().optional(),
  }),
  z.object({
    type: z.literal('ContactSplit'),
    ...blockBase,
    /** Alternative contact channels shown beside the form */
    channels: z
      .array(z.object({ label: z.string(), value: z.string(), href: z.string() }))
      .default([]),
    responseTime: z.string().optional(),
    portrait: image.optional(),
    form: z.object({
      action: z.string(),
      fields: z.array(
        z.object({
          name: z.string(),
          label: z.string(),
          type: z.enum(['text', 'email', 'tel', 'textarea', 'select', 'checkbox']),
          required: z.boolean().default(true),
          options: z.array(z.string()).default([]),
          placeholder: z.string().optional(),
        }),
      ),
      submitLabel: z.string(),
      consentNote: z.string().optional(),
    }),
  }),

  /* ---- I. STRUCTURAL / UTILITY ------------------------------------------ */
  z.object({
    type: z.literal('FaqAccordion'),
    ...blockBase,
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).min(1),
  }),
  z.object({
    type: z.literal('RichText'),
    ...blockBase,
    /** Markdown string */
    markdown: z.string(),
    dropCap: z.boolean().default(false),
  }),
  z.object({
    type: z.literal('Gallery'),
    ...blockBase,
    images: z.array(image).min(1),
    columns: z.number().min(2).max(4).default(3),
  }),
]);

/* Block data is validated at collection boundaries. The renderer consumes
   the validated collection entry shape directly, so no separate exported
   inference alias is required here. */

/* --- Brand collection ---------------------------------------------------- */

const brand = defineCollection({
  loader: glob({ pattern: '**/*.{json,yaml,yml}', base: './src/content/brand' }),
  schema: z.object({
    /* Identity */
    name: z.string(),
    /** e.g. "Sustainable Success Strategist for CEOs & Founders" */
    title: z.string(),
    tagline: z.string(),
    archetype: z.enum([
      'personal-authority-hub',
      'firm-with-figurehead',
      'coach-transformation',
      'single-offer-funnel',
    ]),
    theme: z
      .enum(['obsidian-gold', 'editorial-ivory', 'institutional-navy', 'signal-cyan', 'insurgent-red'])
      .default('obsidian-gold'),

    /* Compiler provenance — optional for hand-authored sites, required by AURA Compiler release manifests. */
    engine: z.object({
      clientPack: z.string(),
      architecture: z.enum(['private-signal', 'authority-speaking', 'creator-education', 'niche-specialist', 'manifesto-movement', 'portfolio-ip']),
      strategyVersion: z.number().int().positive().default(1),
      siteStatus: z.enum(['concept_demo', 'live_client', 'anonymized_client']).default('concept_demo'),
    }).optional(),

    /* Positioning */
    positioning: z.object({
      /** Who exactly this is for */
      audience: z.string(),
      /** The transformation promised */
      promise: z.string(),
      /** Why them and not someone else */
      differentiator: z.string(),
      /** Named methodology — 67% of the corpus has one */
      methodName: z.string().optional(),
      /** The villain / status quo being fought */
      enemy: z.string().optional(),
    }),

    /* Contact + org */
    contact: z.object({
      email: z.string().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      bookingUrl: z.string().optional(),
    }),
    social: z
      .array(z.object({ platform: z.string(), href: z.string(), followers: z.string().optional() }))
      .default([]),
    company: z
      .object({
        name: z.string(),
        role: z.string(),
        url: z.string().optional(),
      })
      .optional(),

    /* Conversion goal — enforces the one-primary-goal rule */
    conversion: z.object({
      primaryGoal: z.enum(['book-call', 'opt-in', 'apply', 'buy', 'subscribe', 'watch']),
      primaryCta: cta,
      secondaryCta: cta.optional(),
      leadMagnet: z
        .object({
          name: z.string(),
          type: z.enum(['ebook', 'masterclass', 'chapter', 'quiz', 'newsletter', 'toolkit', 'audit']),
          promise: z.string(),
          formAction: z.string(),
        })
        .optional(),
    }),

    /* Shared proof library — referenced by blocks so it is written once */
    proof: z
      .object({
        stats: z.array(stat).default([]),
        mediaLogos: z.array(logo).default([]),
        clientLogos: z.array(logo).default([]),
        testimonials: z.array(testimonial).default([]),
        awards: z.array(z.object({ name: z.string(), year: z.string().optional() })).default([]),
      })
      .default({ stats: [], mediaLogos: [], clientLogos: [], testimonials: [], awards: [] }),

    /* Brand assets */
    assets: z
      .object({
        logo: image.optional(),
        logoInverse: image.optional(),
        favicon: z.string().optional(),
        portrait: image.optional(),
        portraitAlt: image.optional(),
        signature: image.optional(),
        ogImage: image.optional(),
      })
      .default({}),

    /* Navigation */
    nav: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          children: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
        }),
      )
      .default([]),
    footerNav: z
      .array(
        z.object({
          heading: z.string(),
          links: z.array(z.object({ label: z.string(), href: z.string() })),
        }),
      )
      .default([]),
    legal: z
      .object({
        entity: z.string().optional(),
        disclaimer: z.string().optional(),
        links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
      })
      .default({ links: [] }),

    /* Measurement + integrations */
    integrations: z
      .object({
        gtmId: z.string().optional(),
        ga4Id: z.string().optional(),
        metaPixelId: z.string().optional(),
        calendarEmbedUrl: z.string().optional(),
        formEndpoint: z.string().optional(),
      })
      .default({}),

    /* Announcement bar (Vinh Giang pattern) */
    announcement: z
      .object({
        text: z.string(),
        href: z.string(),
        active: z.boolean().default(true),
      })
      .optional(),
  }),
});

/* --- Pages collection ---------------------------------------------------- */

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{json,yaml,yml}', base: './src/content/pages' }),
  schema: z.object({
    /** URL path; "/" for home */
    path: z.string(),
    brand: reference('brand'),
    engine: z.object({
      clientPack: z.string(),
      architecture: z.enum(['private-signal', 'authority-speaking', 'creator-education', 'niche-specialist', 'manifesto-movement', 'portfolio-ip']),
      pagePlanVersion: z.number().int().positive().default(1),
      claimIds: z.array(z.string()).default([]),
    }).optional(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
      ogImage: z.string().optional(),
      noindex: z.boolean().default(false),
      /** Schema.org type emitted for this page */
      schemaType: z
        .enum(['WebPage', 'AboutPage', 'ProfilePage', 'ContactPage', 'Service', 'CollectionPage'])
        .default('WebPage'),
    }),
    /** Page archetype — used by the linter to check block sequence sanity */
    archetype: z
      .enum(['home', 'about', 'services', 'work-with-me', 'speaking', 'book', 'contact', 'landing', 'generic'])
      .default('generic'),
    blocks: z.array(blockSchema),
  }),
});

/* --- Case studies collection --------------------------------------------- */

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.{json,yaml,yml}', base: './src/content/case-studies' }),
  schema: z.object({
    brand: reference('brand'),
    title: z.string(),
    description: z.string(),
    client: z.object({
      name: z.string(),
      industry: z.string(),
      role: z.string().optional(),
      location: z.string().optional(),
      confidential: z.boolean().default(false),
    }),
    category: z.string().default('Consulting engagement'),
    year: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    cover: image,
    heroMetric: z
      .object({ value: z.string(), label: z.string(), detail: z.string().optional() })
      .optional(),
    challenge: z.string(),
    stakes: z.array(z.string()).default([]),
    engagement: z.object({
      label: z.string(),
      duration: z.string().optional(),
      scope: z.array(z.string()).default([]),
    }),
    methodology: z.array(z.object({ step: z.string(), title: z.string(), description: z.string(), output: z.string().optional() })).min(1),
    outcomes: z.array(z.object({ value: z.string(), label: z.string(), detail: z.string().optional() })).min(1),
    testimonial: z
      .object({
        quote: z.string(),
        name: z.string(),
        role: z.string().optional(),
        company: z.string().optional(),
        avatar: image.optional(),
      })
      .optional(),
    gallery: z.array(image).default([]),
    nextStep: z
      .object({
        eyebrow: z.string().optional(),
        heading: z.string(),
        body: z.string().optional(),
        cta: cta,
      })
      .optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      noindex: z.boolean().default(false),
    }).default({ noindex: false }),
  }),
});

/* --- Posts collection ---------------------------------------------------- */

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    cover: image.optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    readingTime: z.string().optional(),
  }),
});

export const collections = { brand, pages, caseStudies, posts };
