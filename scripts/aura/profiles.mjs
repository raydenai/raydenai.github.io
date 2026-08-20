export const PROFILES = {
  'private-signal': {
    label: 'Private Signal Advisory',
    signals: ['confidential', 'advisory', 'executive', 'board', 'founder', 'operator', 'private', 'high-touch'],
    requiredBriefPaths: ['buyer.primary_person', 'buyer.high_stakes_moment', 'buyer.private_tension', 'position.central_thesis', 'commercial.primary_offer.name'],
    homeRoles: ['hero', 'problem_mirror', 'named_method', 'proof', 'fit', 'final_conversion'],
    defaultPages: ['/', '/about/', '/method/', '/work-with-me/', '/case-studies/', '/contact/'],
    primaryConversion: 'private_conversation',
    formFields: ['name', 'email', 'company', 'decision_context', 'timing', 'desired_outcome'],
    photoRoles: ['P02', 'P05', 'P06', 'P09', 'P12'],
    proofPosture: 'Permissioned case anatomy or an explicit confidential-work standard.',
  },
  'authority-speaking': {
    label: 'Authority + Speaking',
    signals: ['speaker', 'keynote', 'workshop', 'event', 'audience', 'talk', 'stage'],
    requiredBriefPaths: ['buyer.primary_person', 'position.central_thesis', 'commercial.primary_offer.name'],
    homeRoles: ['hero', 'proof', 'story', 'named_method', 'offer', 'final_conversion'],
    defaultPages: ['/', '/about/', '/speaking/', '/method/', '/contact/'],
    primaryConversion: 'speaking_inquiry',
    formFields: ['name', 'email', 'organization', 'event_date', 'audience_size', 'format', 'budget_range', 'desired_outcome'],
    photoRoles: ['P02', 'P07', 'P05', 'P06'],
    proofPosture: 'Topic outcomes, contextual credentials and permissioned organizer evidence.',
  },
  'creator-education': {
    label: 'Creator / Education',
    signals: ['course', 'cohort', 'community', 'newsletter', 'masterclass', 'program', 'students'],
    requiredBriefPaths: ['buyer.primary_person', 'position.central_thesis', 'commercial.primary_offer.name'],
    homeRoles: ['hero', 'lead_magnet', 'named_method', 'proof', 'offer', 'final_conversion'],
    defaultPages: ['/', '/start-here/', '/programs/', '/about/', '/insights/', '/contact/'],
    primaryConversion: 'start_here',
    formFields: ['email', 'buyer_stage'],
    photoRoles: ['P02', 'P05', 'P06', 'P09'],
    proofPosture: 'Learning outcomes, program mechanics and permissioned participant context.',
  },
  'niche-specialist': {
    label: 'Niche Specialist',
    signals: ['specialist', 'diagnostic', 'assessment', 'vertical', 'industry', 'process', 'eligibility'],
    requiredBriefPaths: ['buyer.primary_person', 'buyer.high_stakes_moment', 'position.central_thesis', 'commercial.primary_offer.name'],
    homeRoles: ['hero', 'problem_mirror', 'named_method', 'proof', 'offer', 'final_conversion'],
    defaultPages: ['/', '/method/', '/services/', '/case-studies/', '/insights/', '/contact/'],
    primaryConversion: 'assessment',
    formFields: ['name', 'email', 'company', 'business_type', 'scale', 'timing', 'service_need'],
    photoRoles: ['P02', 'P05', 'P08', 'P09'],
    proofPosture: 'Specific diagnosis, operational proof and case anatomy.',
  },
  'manifesto-movement': {
    label: 'Manifesto / Movement',
    signals: ['movement', 'manifesto', 'mission', 'change', 'enemy', 'cause', 'community'],
    requiredBriefPaths: ['buyer.primary_person', 'position.central_thesis', 'position.category_enemy_or_default'],
    homeRoles: ['hero', 'problem_mirror', 'story', 'named_method', 'proof', 'final_conversion'],
    defaultPages: ['/', '/manifesto/', '/method/', '/stories/', '/about/', '/join/'],
    primaryConversion: 'apply_or_join',
    formFields: ['name', 'email', 'context', 'reason_for_joining'],
    photoRoles: ['P02', 'P04', 'P08', 'P10'],
    proofPosture: 'Real-world relevance, lived stories and clear mission boundaries.',
  },
  'enterprise-b2b': {
    label: 'Enterprise B2B Expert Platform',
    signals: ['enterprise', 'procurement', 'security', 'implementation', 'buying committee', 'roi', 'platform', 'integration'],
    requiredBriefPaths: ['buyer.primary_person', 'buyer.high_stakes_moment', 'position.central_thesis', 'commercial.primary_offer.name'],
    homeRoles: ['hero', 'problem_mirror', 'named_method', 'proof', 'offer', 'final_conversion'],
    defaultPages: ['/', '/solutions/', '/method/', '/case-studies/', '/resources/', '/company/', '/contact/'],
    primaryConversion: 'enterprise_discovery',
    formFields: ['name', 'work_email', 'company', 'role', 'team_size', 'initiative', 'timing'],
    photoRoles: ['P02', 'P05', 'P08', 'P09'],
    proofPosture: 'Permissioned operational outcomes, implementation constraints, buying-committee relevance and scoped case anatomy.',
  },
  'portfolio-ip': {
    label: 'Portfolio / Intellectual Property',
    signals: ['portfolio', 'ventures', 'book', 'podcast', 'investor', 'media', 'companies'],
    requiredBriefPaths: ['buyer.primary_person', 'position.central_thesis'],
    homeRoles: ['hero', 'proof', 'story', 'offer', 'final_conversion'],
    defaultPages: ['/', '/about/', '/ventures/', '/books-and-media/', '/work-with-me/', '/contact/'],
    primaryConversion: 'route_to_relevant_path',
    formFields: ['name', 'email', 'inquiry_type', 'context'],
    photoRoles: ['P02', 'P04', 'P07', 'P09'],
    proofPosture: 'Organized venture and IP context, not an unstructured status collage.',
  },
};

export function getByKey(key) {
  return PROFILES[key];
}

export function recommendArchitecture(brief) {
  const corpus = JSON.stringify(brief).toLowerCase();
  const scored = Object.entries(PROFILES).map(([key, profile]) => {
    const score = profile.signals.reduce((total, signal) => total + (corpus.includes(signal) ? 1 : 0), 0);
    return { key, score };
  }).sort((a, b) => b.score - a.score);
  const first = scored[0];
  const second = scored[1];
  const confidence = first.score === 0 ? 'low' : first.score - second.score >= 2 ? 'high' : 'medium';
  return { recommended: first.key, confidence, ranked: scored };
}
