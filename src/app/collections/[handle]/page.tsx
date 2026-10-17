import React from 'react';
import productsData from '@/data/products.json';
import collectionMappingsRaw from '@/data/collectionMappings.json';
import CollectionClient from '@/components/CollectionClient';

const collectionMappings: Record<string, string[]> = collectionMappingsRaw as Record<string, string[]>;

// Build lookup map of products by handle
const productByHandle = new Map(productsData.map((p) => [p.handle, p]));

export function generateStaticParams() {
  const handles = Object.keys(collectionMappings);
  return ['all', ...handles].map((h) => ({ handle: h }));
}

interface PageProps {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ q?: string }>;
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { handle } = await params;
  const sp = searchParams ? await searchParams : {};
  const query = sp?.q?.trim();

  let filtered: any[] = [];

  // If search query is present (e.g. from search drawer /collections/all?q=iphone)
  if (query) {
    const cleanQ = query.toLowerCase();
    const rawTokens = cleanQ.split(/[\s\-_\/]+/).filter(Boolean);
    const stopWords = new Set(['a', 'an', 'the', 'for', 'with', 'case', 'cases', 'cover', 'covers']);
    const tokens = rawTokens.filter((t: string) => !stopWords.has(t));
    const tokensToUse = tokens.length > 0 ? tokens : rawTokens;

    filtered = productsData.filter((p: any) => {
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
  } else if (handle === 'all') {
    filtered = [...productsData];
  } else {
    // 1. Direct collection mapping matching rezoni.com 1:1
    const mappedHandles = collectionMappings[handle];
    if (mappedHandles && mappedHandles.length > 0) {
      mappedHandles.forEach((h: string) => {
        const p = productByHandle.get(h);
        if (p) filtered.push(p);
      });
    }

    // 2. Filter by p.collections
    if (filtered.length === 0) {
      filtered = productsData.filter((p: any) => p.collections && p.collections.includes(handle));
    }

    // 3. Fallback: normalized keyword/tag matching
    if (filtered.length === 0) {
      const cleanHandle = handle.toLowerCase();
      const term = cleanHandle.replace(/[-_]+/g, ' ').trim();
      const tokens = term.split(/\s+/).filter((t) => !['cases', 'case', 'covers', 'cover'].includes(t));

      filtered = productsData.filter((p: any) => {
        const title = (p.title || '').toLowerCase();
        const pHandle = (p.handle || '').toLowerCase();
        const cat = (p.category_tag || '').toLowerCase();
        const sub = (p.sub_title || '').toLowerCase();

        if (pHandle.includes(cleanHandle) || title.includes(term) || cat.includes(term) || sub.includes(term)) {
          return true;
        }

        if (tokens.length > 0 && tokens.every((tok) => title.includes(tok) || pHandle.includes(tok) || cat.includes(tok) || sub.includes(tok))) {
          return true;
        }

        return false;
      });
    }

    // 4. Default fallback if still empty (safety net: show popular products rather than empty page)
    if (filtered.length === 0) {
      filtered = productsData.slice(0, 24);
    }
  }

  return (
    <CollectionClient
      handle={handle}
      searchQuery={query}
      initialProducts={filtered}
    />
  );
}
