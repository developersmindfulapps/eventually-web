import { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { LegalMarkdownRenderer } from '@/components/legal/LegalMarkdownRenderer';
import { getLegalDocument } from '@/lib/legal';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const lang = typeof searchParams?.lang === 'string' ? searchParams.lang : undefined;
  const doc = getLegalDocument('community-guidelines', lang);

  return {
    title: 'Community Guidelines & Safety Policy - EventUAlly',
    description:
      'EventUAlly Community Guidelines & Safety Policy. Standards for safe, respectful participation, real-world safety, reporting, and moderation.',
    alternates: {
      canonical: 'https://eventuallyapp.in/community-guidelines',
    },
    openGraph: {
      title: 'Community Guidelines & Safety Policy - EventUAlly',
      description:
        'EventUAlly Community Guidelines & Safety Policy. Standards for safe, respectful participation, real-world safety, reporting, and moderation.',
      url: 'https://eventuallyapp.in/community-guidelines',
      type: 'website',
    },
  };
}

export default async function CommunityGuidelinesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const lang = typeof searchParams?.lang === 'string' ? searchParams.lang : undefined;
  const doc = getLegalDocument('community-guidelines', lang);

  return (
    <LegalPage
      title={doc.title}
      effectiveDate={doc.effectiveDate}
      lastUpdated={doc.lastUpdated}
      toc={doc.toc}
      requestedLanguage={doc.requestedLanguage}
      resolvedLanguage={doc.resolvedLanguage}
      languageName={doc.languageName}
      isFallback={doc.isFallback}
      isRTL={doc.isRTL}
    >
      <LegalMarkdownRenderer content={doc.rawMarkdown} />
    </LegalPage>
  );
}
