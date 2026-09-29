export type LegalDocSlug = 'privacy-policy' | 'terms-of-use' | 'community-guidelines';

export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  isRTL?: boolean;
}

export const SUPPORTED_LEGAL_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
];

export interface TocItem {
  id: string;
  label: string;
}

export interface LegalDocumentManifest {
  product: string;
  operator: string;
  contact: string;
  website: string;
  canonicalLanguage: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  documents: string[];
  languages: string[];
  translationPolicy: string;
  fallbackLanguage: string;
}

export interface LegalDocumentData {
  slug: LegalDocSlug;
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  contactEmail: string;
  requestedLanguage: string;
  resolvedLanguage: string;
  languageName: string;
  isFallback: boolean;
  isRTL: boolean;
  rawMarkdown: string;
  toc: TocItem[];
  manifest: LegalDocumentManifest;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
