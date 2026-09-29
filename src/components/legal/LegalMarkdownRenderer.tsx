import React from 'react';
import { slugifyHeading } from '@/lib/legal-types';

interface LegalMarkdownRendererProps {
  content: string;
}

// Helper to format inline bold, links, and emails
function renderInlineContent(text: string): React.ReactNode[] {
  // Regex pattern for bold **text**, markdown links [text](url), raw urls https://..., and emails
  const tokens: React.ReactNode[] = [];
  
  // Split by markdown bold first: **bold**
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);

  boldParts.forEach((part, partIdx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const innerText = part.slice(2, -2);
      tokens.push(
        <strong key={`bold-${partIdx}`} className="font-semibold text-text-primary">
          {renderLinksAndEmails(innerText, `b-${partIdx}`)}
        </strong>
      );
    } else {
      tokens.push(...renderLinksAndEmails(part, `txt-${partIdx}`));
    }
  });

  return tokens;
}

function renderLinksAndEmails(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match markdown links [text](url), urls https?://\S+, and emails
  const linkRegex = /(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const matchedStr = match[0];
    const itemKey = `${keyPrefix}-${match.index}`;

    if (matchedStr.startsWith('[') && matchedStr.includes('](')) {
      const closeBracket = matchedStr.indexOf('](');
      const label = matchedStr.slice(1, closeBracket);
      const url = matchedStr.slice(closeBracket + 2, -1);
      nodes.push(
        <a
          key={itemKey}
          href={url}
          target={url.startsWith('http') ? '_blank' : undefined}
          rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        >
          {label}
        </a>
      );
    } else if (matchedStr.startsWith('http://') || matchedStr.startsWith('https://')) {
      // Clean trailing punctuation if any
      const cleanUrl = matchedStr.replace(/[.,;:]$/, '');
      const trailing = matchedStr.slice(cleanUrl.length);
      nodes.push(
        <a
          key={itemKey}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        >
          {cleanUrl}
        </a>
      );
      if (trailing) nodes.push(trailing);
    } else if (matchedStr.includes('@')) {
      const cleanEmail = matchedStr.replace(/[.,;:]$/, '');
      const trailing = matchedStr.slice(cleanEmail.length);
      nodes.push(
        <a
          key={itemKey}
          href={`mailto:${cleanEmail}`}
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        >
          {cleanEmail}
        </a>
      );
      if (trailing) nodes.push(trailing);
    }

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

export function LegalMarkdownRenderer({ content }: LegalMarkdownRendererProps) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: string[] = [];
  let blockKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      const listItems = [...currentList];
      currentList = [];
      elements.push(
        <ul key={`list-${blockKey++}`} className="my-3 list-disc space-y-2 pl-6 text-text-secondary">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineContent(item)}
            </li>
          ))}
        </ul>
      );
    }
  };

  let skippingHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Skip the main document title and metadata header (Effective date, etc. which are rendered by LegalPage header)
    if (skippingHeader) {
      if (trimmed.startsWith('# ')) {
        continue;
      }
      if (trimmed.startsWith('**Effective Date:**') || trimmed.startsWith('**Last Updated:**')) {
        continue;
      }
      if (trimmed === '') {
        continue;
      }
      skippingHeader = false;
    }

    if (trimmed === '') {
      flushList();
      continue;
    }

    // Heading 2 (## ...)
    if (trimmed.startsWith('## ')) {
      flushList();
      const headingText = trimmed.replace(/^##\s+/, '').trim();
      const id = slugifyHeading(headingText);
      elements.push(
        <section key={`sec-${id}-${blockKey++}`} className="pt-6">
          <h2
            id={id}
            className="font-heading text-xl font-bold tracking-tight text-text-primary scroll-mt-24 border-b border-border/40 pb-2"
          >
            {headingText}
          </h2>
        </section>
      );
      continue;
    }

    // Heading 3 (### ...)
    if (trimmed.startsWith('### ')) {
      flushList();
      const headingText = trimmed.replace(/^###\s+/, '').trim();
      const id = slugifyHeading(headingText);
      elements.push(
        <h3
          key={`h3-${id}-${blockKey++}`}
          id={id}
          className="font-heading text-lg font-semibold text-text-primary mt-4 scroll-mt-24"
        >
          {headingText}
        </h3>
      );
      continue;
    }

    // List item (- ...)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(trimmed.slice(2).trim());
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${blockKey++}`} className="mt-3 text-[15px] sm:text-base leading-relaxed text-text-secondary">
        {renderInlineContent(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-4">{elements}</div>;
}
