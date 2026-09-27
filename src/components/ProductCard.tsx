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
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `${product.id}-${selectedSwatch}`,
      title: `${product.title} - ${product.category_tag}`,
      price: product.price,
      image: product.primary_image,
      device: 'iPhone 15 Pro Max',
      quantity: 1,
    });
  };

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
            aspectRatio: '0.85',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '12px',
          }}
        >
          {/* Primary Image */}
          <img
            src={product.primary_image}
            alt={product.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: isHovered && product.secondary_image ? 0 : 1,
              transition: 'opacity 0.25s ease-in-out',
            }}
          />

          {/* Secondary Image (Hover transition) */}
          {product.secondary_image && (
            <img
              src={product.secondary_image}
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

          {/* Quick Add Overlay on Hover */}
          <button
            onClick={handleQuickAdd}
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              height: '36px',
              backgroundColor: '#ff6700',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              borderRadius: '3px',
              border: 'none',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Quick Add
          </button>
        </div>

        {/* Product Details (Exact Rezoni CSS styles matching 05_perks_and_footer.png) */}
        <div style={{ padding: '0 4px' }}>
          {/* meta__title in orange */}
          <div
            style={{
              color: '#ff6700',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.4px',
              lineHeight: 1.4,
              marginBottom: '3px',
            }}
          >
            {product.category_tag}
          </div>

          {/* pre_title in black */}
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#111111',
              margin: '0 0 2px',
              lineHeight: 1.3,
            }}
          >
            {product.title}
          </h4>

          {/* pro__title in grey */}
          <div
            style={{
              fontSize: '12px',
              color: '#888888',
              marginBottom: '6px',
              lineHeight: 1.3,
            }}
          >
            {product.sub_title}
          </div>

          {/* Price display: sale price in red accent, compare price in strikethrough */}
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
            <span style={{ color: '#e53935', marginRight: '6px', fontWeight: 600 }}>
              Rs. {product.price.toFixed(2)}
            </span>
            <span style={{ color: '#888888', textDecoration: 'line-through', fontSize: '12px', fontWeight: 400 }}>
              Rs. {product.compare_at_price.toFixed(2)}
            </span>
          </div>

          {/* Color Swatch Circles with concentric outline ring */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center' }}>
            {product.swatches.map((color, idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSwatch(idx);
                }}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: color.toLowerCase() === '#ffffff' ? '1px solid #ccc' : 'none',
                  outline: selectedSwatch === idx ? '1.5px solid #000000' : 'none',
                  outlineOffset: '2px',
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              />
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
