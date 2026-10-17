import React from 'react';
import productsData from '@/data/products.json';
import CollectionClient from '@/components/CollectionClient';

export function generateStaticParams() {
  return [
    { handle: 'all' },
    { handle: 'iphone-cases' },
    { handle: 'anti-yellow-case' },
    { handle: 'football' },
    { handle: 'best-sellers' },
    { handle: 'custom-photo-case' },
    { handle: 'mixtape' },
    { handle: 'featured-prints' },
  ];
}

interface PageProps {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ q?: string }>;
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { handle } = await params;
  const sp = searchParams ? await searchParams : {};
  const query = sp?.q?.trim();

  let filtered = [...productsData];

  // If query is present (e.g. from search drawer /collections/all?q=iphone)
  if (query) {
    const cleanQ = query.toLowerCase();
    const rawTokens = cleanQ.split(/[\s\-_\/]+/).filter(Boolean);
    const stopWords = new Set(['a', 'an', 'the', 'for', 'with', 'case', 'cases', 'cover', 'covers']);
    const tokens = rawTokens.filter((t: string) => !stopWords.has(t));
    const tokensToUse = tokens.length > 0 ? tokens : rawTokens;

    filtered = filtered.filter((p: any) => {
      const title = (p.title || '').toLowerCase();
      const pHandle = (p.handle || '').toLowerCase();
      const cat = (p.category_tag || '').toLowerCase();
      const sub = (p.sub_title || '').toLowerCase();
      const modelsStr = (p.models || []).join(' ').toLowerCase();

      // Contiguous match
      if (
        title.includes(cleanQ) ||
        pHandle.includes(cleanQ) ||
        cat.includes(cleanQ) ||
        sub.includes(cleanQ) ||
        modelsStr.includes(cleanQ)
      ) {
        return true;
      }

      // Token match
      return tokensToUse.some(
        (t: string) =>
          title.includes(t) ||
          pHandle.includes(t) ||
          cat.includes(t) ||
          sub.includes(t) ||
          modelsStr.includes(t)
      );
    });
  } else if (handle !== 'all' && handle !== 'best-sellers') {
    const term = handle.replace(/-/g, ' ').toLowerCase();
    filtered = filtered.filter(
      (p: any) =>
        p.handle.includes(handle) ||
        p.title.toLowerCase().includes(term) ||
        p.category_tag.toLowerCase().includes(term) ||
        (p.sub_title && p.sub_title.toLowerCase().includes(term))
    );
  }

  return (
    <CollectionClient
      handle={handle}
      searchQuery={query}
      initialProducts={filtered}
    />
  );
}
