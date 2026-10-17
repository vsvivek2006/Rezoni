'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/data/siteData';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSwatch, setSelectedSwatch] = useState(0);

  const activeVariant =
    product.color_variants && product.color_variants[selectedSwatch]
      ? product.color_variants[selectedSwatch]
      : null;

  const displayPrimary = activeVariant?.image || product.primary_image;
  const displaySecondary =
    (activeVariant?.gallery && activeVariant.gallery.length > 1 ? activeVariant.gallery[1] : null) ||
    product.secondary_image;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.handle}`} style={{ display: 'block' }}>
        {/* Media Container matching Focal theme aspect ratio */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '0.95',
            backgroundColor: '#ffffff',
            borderRadius: '0px',
            overflow: 'hidden',
            marginBottom: '10px',
          }}
        >
          {/* Primary Image */}
          <img
            src={displayPrimary}
            alt={product.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: isHovered && displaySecondary ? 0 : 1,
              transition: 'opacity 0.25s ease-in-out',
            }}
          />

          {/* Secondary Image (Hover transition) */}
          {displaySecondary && (
            <img
              src={displaySecondary}
              alt={`${product.title} alternate`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.25s ease-in-out',
              }}
            />
          )}
        </div>

        {/* Product Details (Exact Live Rezoni CSS styles) */}
        <div style={{ padding: '0 4px', textAlign: 'center' }}>
          {/* meta__title in orange */}
          <div
            style={{
              color: '#ff6700',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: 1.4,
              marginBottom: '1px',
            }}
          >
            {product.category_tag}
          </div>

          {/* pre_title in #282828 */}
          <h4
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#282828',
              fontFamily: 'Montserrat, sans-serif',
              margin: '2px 0 0',
              lineHeight: 1.3,
            }}
          >
            {product.title}
          </h4>

          {/* pro__title in #282828 */}
          <div
            style={{
              fontSize: '11px',
              color: '#282828',
              fontFamily: 'Montserrat, sans-serif',
              margin: '2px 0 0',
              lineHeight: 1.3,
            }}
          >
            {product.sub_title}
          </div>

          {/* Price display: sale price in red accent, compare price in strikethrough */}
          <div style={{ fontSize: '11px', fontFamily: 'Montserrat, sans-serif', margin: '4px 0 6px' }}>
            <span style={{ color: '#de2a2a', marginRight: '8px', fontWeight: 500 }}>
              Rs. {Number(product.price || 699).toFixed(2)}
            </span>
            {product.compare_at_price && (
              <span style={{ color: '#282828', textDecoration: 'line-through', fontWeight: 400 }}>
                Rs. {Number(product.compare_at_price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Color Swatch Circles with concentric outline ring */}
          {product.swatches && product.swatches.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', alignItems: 'center', minHeight: '18px' }}>
              {product.swatches.map((color, idx) => (
                <span
                  key={idx}
                  onMouseEnter={() => setSelectedSwatch(idx)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSwatch(idx);
                  }}
                  style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: color.toLowerCase() === '#ffffff' ? '1px solid #ddd' : 'none',
                    outline: selectedSwatch === idx ? '1.5px solid #000000' : 'none',
                    outlineOffset: '2px',
                    cursor: 'pointer',
                    display: 'inline-block',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
