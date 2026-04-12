'use client';

import Link from 'next/link';
import { getBreadcrumbSchema } from '../utils/schema-helpers';

interface BreadcrumbProps {
  items: { name: string; item: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbProps) {
  const schema = getBreadcrumbSchema(items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb-list">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          {items.map((it, idx) => (
            <li key={idx} className="breadcrumb-item">
              <span className="separator">/</span>
              <Link href={it.item}>{it.name}</Link>
            </li>
          ))}
        </ol>
        <style jsx>{`
          .breadcrumb-nav { margin-bottom: 2rem; }
          .breadcrumb-list { list-style: none; display: flex; gap: 0.5rem; font-size: 0.9rem; color: #64748b; padding: 0; }
          .breadcrumb-item a { color: inherit; text-decoration: none; transition: 0.2s; }
          .breadcrumb-item a:hover { color: var(--p); }
          .separator { color: #cbd5e1; }
        `}</style>
      </nav>
    </>
  );
}
