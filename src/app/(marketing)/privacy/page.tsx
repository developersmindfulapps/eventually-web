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
  const doc = getLegalDocument('privacy-policy', lang);

  return {
    title: 'Privacy Policy - EventUAlly',
    description:
      'EventUAlly Privacy Policy. Learn what information is collected, how it is used, stored, disclosed, and deleted.',
    alternates: {
      canonical: 'https://eventuallyapp.in/privacy',
    },
    openGraph: {
      title: 'Privacy Policy - EventUAlly',
      description:
        'EventUAlly Privacy Policy. Learn what information is collected, how it is used, stored, disclosed, and deleted.',
      url: 'https://eventuallyapp.in/privacy',
      type: 'website',
    },
  };
}

export default async function PrivacyPolicyPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const lang = typeof searchParams?.lang === 'string' ? searchParams.lang : undefined;
  const doc = getLegalDocument('privacy-policy', lang);

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
