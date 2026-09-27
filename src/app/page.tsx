import React from 'react';
import HeroSlider from '@/components/HeroSlider';
import CollectionCarousel from '@/components/CollectionCarousel';
import ProductGridSection from '@/components/ProductGridSection';
import VideoBanner from '@/components/VideoBanner';
import InstagramGallery from '@/components/InstagramGallery';
import TextWithIcons from '@/components/TextWithIcons';
import Newsletter from '@/components/Newsletter';
import {
  antiYellowCards,
  reverbCards,
  featuredCollectionsCards,
  personaliseCards,
  bestSellers,
  newArrivals,
} from '@/data/siteData';

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero Banner Slider (Desktop & Mobile sets) */}
      <HeroSlider />

      {/* 2. Anti-Yellow Case Collection Carousel */}
      <CollectionCarousel title="Anti-Yellow Case" items={antiYellowCards} />

      {/* 3. Reverb 2.0 Case Collection Carousel */}
      <CollectionCarousel title="Reverb 2.0 Case" items={reverbCards} />

      {/* 4. Best Sellers Product Grid */}
      <ProductGridSection title="Best Sellers" products={bestSellers} />

      {/* 5. Featured Collections Carousel */}
      <CollectionCarousel title="Featured Collections" items={featuredCollectionsCards} />

      {/* 6. New Arrivals (Football cases) */}
      <ProductGridSection title="New Arrivals" products={newArrivals} />

      {/* 7. Autoplay Video Banner (iPhone Cases) */}
      <VideoBanner />

      {/* 8. Personalise Your Case Carousel */}
      <CollectionCarousel title="Personalise Your Case" items={personaliseCards} />

      {/* 9. Instagram Community Showcase */}
      <InstagramGallery />

      {/* 10. Value Perks Strip (Free Shipping, Support, Security, Email) */}
      <TextWithIcons />

      {/* 11. Newsletter Subscription Block */}
      <Newsletter />
    </div>
  );
}
