/**
 * Block registry — the single mapping from a content `type` string to a
 * component.
 *
 * This is the keystone of the whole system. Because every block is addressed by
 * name from JSON/Markdown content, a new client site is authored entirely in
 * data: no page is ever hand-assembled in .astro files. Adding a block to the
 * system means three edits, always in the same places:
 *
 *   1. add the shape to the discriminatedUnion in src/content.config.ts
 *   2. create the component in src/blocks/<family>/
 *   3. register it here
 *
 * If those three are in sync, `astro check` will refuse to build a site whose
 * content references an unknown block or omits a required field — which is what
 * makes AI-generated content safe to accept.
 */

/* Hero */
import HeroSplitPortrait from '../blocks/hero/HeroSplitPortrait.astro';
import HeroSplitOptin from '../blocks/hero/HeroSplitOptin.astro';
import HeroCenteredStatement from '../blocks/hero/HeroCenteredStatement.astro';
import HeroVideoOverlay from '../blocks/hero/HeroVideoOverlay.astro';
import HeroSegmented from '../blocks/hero/HeroSegmented.astro';

/* Proof */
import LogoStrip from '../blocks/proof/LogoStrip.astro';
import CredibilityBar from '../blocks/proof/CredibilityBar.astro';
import CredibilityStack from '../blocks/proof/CredibilityStack.astro';
import AuthorityQuote from '../blocks/proof/AuthorityQuote.astro';
import TestimonialGrid from '../blocks/proof/TestimonialGrid.astro';
import TestimonialSlider from '../blocks/proof/TestimonialSlider.astro';
import AssociationGrid from '../blocks/proof/AssociationGrid.astro';
import ResultsGrid from '../blocks/proof/ResultsGrid.astro';

/* Problem */
import ProblemAgitation from '../blocks/problem/ProblemAgitation.astro';
import EmpathyQuoteWall from '../blocks/problem/EmpathyQuoteWall.astro';
import AudienceQualifier from '../blocks/problem/AudienceQualifier.astro';
import FuturePacing from '../blocks/problem/FuturePacing.astro';
import IconGrid from '../blocks/problem/IconGrid.astro';

/* Mechanism */
import MethodologyPillars from '../blocks/mechanism/MethodologyPillars.astro';
import NumberedFramework from '../blocks/mechanism/NumberedFramework.astro';
import PrincipleZigZag from '../blocks/mechanism/PrincipleZigZag.astro';
import ProcessTimeline from '../blocks/mechanism/ProcessTimeline.astro';

/* Story */
import OriginStory from '../blocks/story/OriginStory.astro';
import CrucibleMoment from '../blocks/story/CrucibleMoment.astro';
import Manifesto from '../blocks/story/Manifesto.astro';
import IdentityCallout from '../blocks/story/IdentityCallout.astro';

/* Offer */
import ServicesGrid from '../blocks/offer/ServicesGrid.astro';
import OfferLadder from '../blocks/offer/OfferLadder.astro';
import HighTicketOffer from '../blocks/offer/HighTicketOffer.astro';
import SpeakingTopics from '../blocks/offer/SpeakingTopics.astro';

/* Content */
import BookShowcase from '../blocks/content/BookShowcase.astro';
import PodcastPromo from '../blocks/content/PodcastPromo.astro';
import VideoGrid from '../blocks/content/VideoGrid.astro';
import MediaFeatures from '../blocks/content/MediaFeatures.astro';
import PostsGrid from '../blocks/content/PostsGrid.astro';
import PersonalStats from '../blocks/content/PersonalStats.astro';

/* Conversion */
import LeadMagnet from '../blocks/conversion/LeadMagnet.astro';
import LeadMagnetBanner from '../blocks/conversion/LeadMagnetBanner.astro';
import DualCtaTransition from '../blocks/conversion/DualCtaTransition.astro';
import FinalCta from '../blocks/conversion/FinalCta.astro';
import ApplicationForm from '../blocks/conversion/ApplicationForm.astro';
import ContactSplit from '../blocks/conversion/ContactSplit.astro';

/* Structure */
import FaqAccordion from '../blocks/structure/FaqAccordion.astro';
import RichText from '../blocks/structure/RichText.astro';
import Gallery from '../blocks/structure/Gallery.astro';

export const blockRegistry = {
  HeroSplitPortrait,
  HeroSplitOptin,
  HeroCenteredStatement,
  HeroVideoOverlay,
  HeroSegmented,

  LogoStrip,
  CredibilityBar,
  CredibilityStack,
  AuthorityQuote,
  TestimonialGrid,
  TestimonialSlider,
  AssociationGrid,
  ResultsGrid,

  ProblemAgitation,
  EmpathyQuoteWall,
  AudienceQualifier,
  FuturePacing,
  IconGrid,

  MethodologyPillars,
  NumberedFramework,
  PrincipleZigZag,
  ProcessTimeline,

  OriginStory,
  CrucibleMoment,
  Manifesto,
  IdentityCallout,

  ServicesGrid,
  OfferLadder,
  HighTicketOffer,
  SpeakingTopics,

  BookShowcase,
  PodcastPromo,
  VideoGrid,
  MediaFeatures,
  PostsGrid,
  PersonalStats,

  LeadMagnet,
  LeadMagnetBanner,
  DualCtaTransition,
  FinalCta,
  ApplicationForm,
  ContactSplit,

  FaqAccordion,
  RichText,
  Gallery,
} as const;

export type BlockType = keyof typeof blockRegistry;

/**
 * Which persuasion stage each block serves. Used by the sequence linter to
 * detect pages that argue in the wrong order (e.g. asking for the sale before
 * establishing a mechanism).
 */
export const blockStage: Record<BlockType, string> = {
  HeroSplitPortrait: 'attention',
  HeroSplitOptin: 'attention',
  HeroCenteredStatement: 'attention',
  HeroVideoOverlay: 'attention',
  HeroSegmented: 'attention',

  LogoStrip: 'credibility',
  CredibilityBar: 'credibility',
  CredibilityStack: 'credibility',
  AuthorityQuote: 'credibility',
  TestimonialGrid: 'proof',
  TestimonialSlider: 'proof',
  AssociationGrid: 'credibility',
  ResultsGrid: 'proof',

  ProblemAgitation: 'problem',
  EmpathyQuoteWall: 'problem',
  AudienceQualifier: 'qualification',
  FuturePacing: 'aspiration',
  IconGrid: 'explanation',

  MethodologyPillars: 'mechanism',
  NumberedFramework: 'mechanism',
  PrincipleZigZag: 'mechanism',
  ProcessTimeline: 'risk-reduction',

  OriginStory: 'trust',
  CrucibleMoment: 'trust',
  Manifesto: 'trust',
  IdentityCallout: 'qualification',

  ServicesGrid: 'offer',
  OfferLadder: 'offer',
  HighTicketOffer: 'offer',
  SpeakingTopics: 'offer',

  BookShowcase: 'credibility',
  PodcastPromo: 'nurture',
  VideoGrid: 'proof',
  MediaFeatures: 'credibility',
  PostsGrid: 'nurture',
  PersonalStats: 'trust',

  LeadMagnet: 'capture',
  LeadMagnetBanner: 'capture',
  DualCtaTransition: 'transition',
  FinalCta: 'close',
  ApplicationForm: 'close',
  ContactSplit: 'close',

  FaqAccordion: 'objection',
  RichText: 'explanation',
  Gallery: 'proof',
};
