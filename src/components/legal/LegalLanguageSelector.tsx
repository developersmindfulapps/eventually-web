'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Globe, ChevronDown } from 'lucide-react';
import { SUPPORTED_LEGAL_LANGUAGES } from '@/lib/legal-types';

interface LegalLanguageSelectorProps {
  currentLanguage: string;
}

export function LegalLanguageSelector({ currentLanguage }: LegalLanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newLang === 'en') {
      params.delete('lang');
    } else {
      params.set('lang', newLang);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl);
  };

  return (
    <div className="relative inline-flex items-center">
      <Globe className="pointer-events-none absolute left-3 h-4 w-4 text-text-muted" />
      <select
        value={currentLanguage}
        onChange={handleLanguageChange}
        aria-label="Select legal document language"
        className="appearance-none rounded-xl border border-border bg-surface py-2 pl-9 pr-8 text-sm font-medium text-text-primary shadow-sm transition hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
      >
        {SUPPORTED_LEGAL_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-text-muted" />
    </div>
  );
}
