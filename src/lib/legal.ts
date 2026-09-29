import fs from 'fs';
import path from 'path';
import {
  LegalDocSlug,
  LegalDocumentManifest,
  LegalDocumentData,
  SUPPORTED_LEGAL_LANGUAGES,
  TocItem,
  slugifyHeading,
} from './legal-types';

export * from './legal-types';

const LEGAL_ROOT = path.join(process.cwd(), 'content', 'legal');

export function getLegalManifest(): LegalDocumentManifest {
  try {
    const manifestPath = path.join(LEGAL_ROOT, 'manifest.json');
    const content = fs.readFileSync(manifestPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {
      product: 'EventUAlly',
      operator: 'Rajat Deep Singh',
      contact: 'developers.mindfulapps@gmail.com',
      website: 'https://eventuallyapp.in/',
      canonicalLanguage: 'en',
      version: '1.0',
      effectiveDate: '2026-09-29',
      lastUpdated: '2026-09-29',
      documents: ['privacy-policy', 'terms-of-use', 'community-guidelines'],
      languages: ['en', 'fr', 'de', 'hi', 'ar', 'ru', 'ja', 'ko'],
      translationPolicy: 'English is canonical.',
      fallbackLanguage: 'en',
    };
  }
}

export function getLegalDocument(
  slug: LegalDocSlug,
  requestedLang?: string | null
): LegalDocumentData {
  const manifest = getLegalManifest();
  const rawRequested = (requestedLang || 'en').toLowerCase().trim();
  const langMeta = SUPPORTED_LEGAL_LANGUAGES.find((l) => l.code === rawRequested);
  const targetLang = langMeta ? langMeta.code : 'en';

  let filePath = path.join(LEGAL_ROOT, targetLang, `${slug}.md`);
  let resolvedLanguage = targetLang;
  let isFallback = rawRequested !== 'en';

  // If a non-English language was requested, check if valid file exists and is not empty
  if (targetLang !== 'en') {
    if (!fs.existsSync(filePath)) {
      filePath = path.join(LEGAL_ROOT, 'en', `${slug}.md`);
      resolvedLanguage = 'en';
      isFallback = true;
    } else {
      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        filePath = path.join(LEGAL_ROOT, 'en', `${slug}.md`);
        resolvedLanguage = 'en';
        isFallback = true;
      } else {
        // Translation file exists and has content
        resolvedLanguage = targetLang;
        isFallback = false;
      }
    }
  } else {
    // English requested
    if (rawRequested === 'en') {
      isFallback = false;
    } else {
      // An unrecognized language like ?lang=xyz was passed
      isFallback = true;
    }
  }

  // Fallback check: if filePath does not exist, use en
  if (!fs.existsSync(filePath)) {
    filePath = path.join(LEGAL_ROOT, 'en', `${slug}.md`);
    resolvedLanguage = 'en';
    isFallback = rawRequested !== 'en';
  }

  const rawMarkdown = fs.readFileSync(filePath, 'utf-8');

  // Parse Title & TOC
  let title = '';
  const toc: TocItem[] = [];
  const lines = rawMarkdown.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!title && trimmed.startsWith('# ')) {
      title = trimmed.replace(/^#\s+/, '').trim();
    } else if (trimmed.startsWith('## ')) {
      const headingText = trimmed.replace(/^##\s+/, '').trim();
      const id = slugifyHeading(headingText);
      toc.push({ id, label: headingText });
    }
  }

  const activeLangMeta =
    SUPPORTED_LEGAL_LANGUAGES.find((l) => l.code === resolvedLanguage) || SUPPORTED_LEGAL_LANGUAGES[0];
  const displayLangName = langMeta ? langMeta.name : rawRequested;

  return {
    slug,
    title:
      title ||
      (slug === 'privacy-policy'
        ? 'Privacy Policy'
        : slug === 'terms-of-use'
        ? 'Terms of Use'
        : 'Community Guidelines & Safety Policy'),
    effectiveDate: manifest.effectiveDate,
    lastUpdated: manifest.lastUpdated,
    contactEmail: manifest.contact,
    requestedLanguage: targetLang,
    resolvedLanguage,
    languageName: displayLangName,
    isFallback,
    isRTL: Boolean(activeLangMeta.isRTL),
    rawMarkdown,
    toc,
    manifest,
  };
}
