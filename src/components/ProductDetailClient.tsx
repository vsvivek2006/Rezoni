'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { mobileDeviceBrands } from '@/data/deviceMenuData';
import { variantToModelMap, modelToBrandMap } from '@/data/variantModelMap';

// Brand Options matching Rezoni Live PDP Switcher exactly
const brandOptions = [
  { label: 'iPhone', handle: 'anti-yellow-magsafe-clear-case', brandKey: 'iPhone Cases' },
  { label: 'Samsung', handle: 'anti-yellow-magsafe-clear-case-samsung', brandKey: 'Samsung Cases' },
  { label: 'OnePlus', handle: 'anti-yellow-magsafe-case-oneplus', brandKey: 'OnePlus Cases' },
  { label: 'Google Pixel', handle: 'anti-yellow-magsafe-clear-case-google-pixel', brandKey: 'Google Pixel Cases' },
  { label: 'Nothing', handle: 'anti-yellow-magsafe-clear-case-nothing', brandKey: 'Nothing Cases' },
  { label: 'Vivo', handle: 'anti-yellow-magsafe-clear-case-vivo', brandKey: 'Vivo Cases' },
  { label: 'iQOO', handle: 'anti-yellow-magsafe-clear-case-iqoo', brandKey: 'iQOO Cases' },
  { label: 'Oppo', handle: 'anti-yellow-magsafe-clear-case-oppo-x-series', brandKey: 'Oppo Cases' },
  { label: 'Realme', handle: 'anti-yellow-magsafe-clear-case-realme', brandKey: 'Realme Cases' },
  { label: 'Redmi', handle: 'anti-yellow-magsafe-clear-case-redmi', brandKey: 'Redmi Cases' },
  { label: 'Xiaomi', handle: 'anti-yellow-magsafe-clear-case-xiaomi', brandKey: 'Xiaomi Cases' },
  { label: 'Motorola', handle: 'anti-yellow-magsafe-clear-case-motorola', brandKey: 'Motorola Cases' },
];

// Pre-compute Brand Models Map from authentic mobile catalog
const brandModelsMap: Record<string, string[]> = {};
mobileDeviceBrands.forEach((b) => {
  brandModelsMap[b.brand] = b.items.map((it) => it.name.replace(/^New!\s*/i, ''));
});



// Authentic Loox Reviews by Brand and Device Media Map from rezoni.com
import { brandReviewsData, CustomerReview } from '@/data/brandReviewsData';
import { getDeviceMedia, DeviceMedia } from '@/data/deviceMediaMap';

export function normalizeBrandKey(key?: string | null): string {
  if (!key) return 'iPhone Cases';
  const k = key.toLowerCase();
  if (k.includes('samsung') || k.includes('galaxy')) return 'Samsung Cases';
  if (k.includes('iphone') || k.includes('apple')) return 'iPhone Cases';
  if (k.includes('oneplus') || k.includes('nord')) return 'OnePlus Cases';
  if (k.includes('pixel') || k.includes('google')) return 'Google Pixel Cases';
  if (k.includes('nothing') || k.includes('cmf')) return 'Nothing Cases';
  if (k.includes('vivo')) return 'Vivo Cases';
  if (k.includes('iqoo')) return 'iQOO Cases';
  if (k.includes('oppo') || k.includes('find n')) return 'Oppo Cases';
  if (k.includes('realme') || k.includes('narzo')) return 'Realme Cases';
  if (k.includes('redmi')) return 'Redmi Cases';
  if (k.includes('xiaomi') || k.includes('mi ') || k.includes('mi-') || k.includes('mi10') || k.includes('mi11')) return 'Xiaomi Cases';
  if (k.includes('motorola') || k.includes('moto') || k.includes('razr')) return 'Motorola Cases';
  return 'iPhone Cases';
}

// Accurately detect authentic brand from initialModel, handle, title, or models list
export function detectInitialBrand(product: ProductDetailProps['product'], initialModel?: string | null): string {
  // 1. From model param / initialModel
  if (initialModel) {
    const clean = initialModel.replace(/^New!\s*/i, '').trim().toLowerCase();
    const fromMap = modelToBrandMap[clean];
    if (fromMap) return normalizeBrandKey(fromMap);
    const directNorm = normalizeBrandKey(clean);
    if (directNorm !== 'iPhone Cases' || clean.includes('iphone')) return directNorm;
  }

  // 2. From product.handle
  const h = (product.handle || '').toLowerCase();
  if (h.includes('samsung') || h.includes('galaxy')) return 'Samsung Cases';
  if (h.includes('oneplus') || h.includes('nord')) return 'OnePlus Cases';
  if (h.includes('pixel') || h.includes('google')) return 'Google Pixel Cases';
  if (h.includes('nothing') || h.includes('cmf')) return 'Nothing Cases';
  if (h.includes('vivo')) return 'Vivo Cases';
  if (h.includes('iqoo')) return 'iQOO Cases';
  if (h.includes('oppo')) return 'Oppo Cases';
  if (h.includes('realme') || h.includes('narzo')) return 'Realme Cases';
  if (h.includes('redmi')) return 'Redmi Cases';
  if (h.includes('xiaomi') || h.includes('mi-')) return 'Xiaomi Cases';
  if (h.includes('motorola') || h.includes('moto')) return 'Motorola Cases';

  // 3. From product.title
  const t = (product.title || '').toLowerCase();
  if (t.includes('samsung') || t.includes('galaxy')) return 'Samsung Cases';
  if (t.includes('oneplus') || t.includes('nord')) return 'OnePlus Cases';
  if (t.includes('pixel') || t.includes('google')) return 'Google Pixel Cases';
  if (t.includes('nothing') || t.includes('cmf')) return 'Nothing Cases';
  if (t.includes('vivo')) return 'Vivo Cases';
  if (t.includes('iqoo')) return 'iQOO Cases';
  if (t.includes('oppo')) return 'Oppo Cases';
  if (t.includes('realme')) return 'Realme Cases';
  if (t.includes('redmi')) return 'Redmi Cases';
  if (t.includes('xiaomi')) return 'Xiaomi Cases';
  if (t.includes('motorola') || t.includes('moto')) return 'Motorola Cases';

  // 4. From product.models list
  if (product.models && product.models.length > 0) {
    for (const m of product.models) {
      const clean = m.replace(/^New!\s*/i, '').trim().toLowerCase();
      const fromMap = modelToBrandMap[clean];
      if (fromMap) return normalizeBrandKey(fromMap);
      const norm = normalizeBrandKey(clean);
      if (norm !== 'iPhone Cases' || clean.includes('iphone')) return norm;
    }
  }

  // 5. From product.brand
  if (product.brand) return normalizeBrandKey(product.brand);

  return 'iPhone Cases';
}

// Authentic FAQ data from Rezoni Live Store
const faqItems = [
  {
    q: 'How is your case different from others?',
    a: 'Our case features a revolutionary UV Shield™ Technology that prevents yellowing, ensuring your phone stays crystal clear for much longer. This advanced design keeps your phone looking fresh while providing lasting clarity.',
  },
  {
    q: 'What is the anti-yellow guarantee?',
    a: 'We offer a lifetime anti-yellowing guarantee. If your case ever yellows, you are eligible for a free one-time replacement.',
  },
  {
    q: 'How is it different from the Reverb Clear Case?',
    a: 'The Reverb Clear Case is designed for those prioritizing protection with its exceptional 4x military-grade protection. Our anti-yellow case is focused specifically on preventing yellowing, while still offering everyday protection.',
  },
  {
    q: 'Does the case protect from drops and scratches?',
    a: 'Yes, our case offers everyday protection from drops and scratches without adding bulk.',
  },
  {
    q: 'Is the case MagSafe compatible?',
    a: 'Absolutely. Our case uses certified N52M magnets for strong and reliable MagSafe compatibility.',
  },
  {
    q: 'What material is the case made from?',
    a: 'Our case is made from a revolutionary polycarbonate material, engineered with proprietary technology for enhanced clarity and durability.',
  },
  {
    q: 'What’s the best way to keep the case clean and clear?',
    a: 'To maintain clarity, wipe your case with a soft microfiber cloth every 2-3 days to prevent dirt and dust buildup. This simple routine helps keep it looking fresh and clear.',
  },
];

export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
  gallery: string[];
}

export interface ProductDetailProps {
  product: {
    id: number | string;
    title: string;
    price: number;
    compare_at_price: number;
    description?: string;
    primary_image: string;
    images?: string[];
    handle?: string;
    brand?: string;
    models?: string[];
    category?: string;
    color_variants?: ColorVariant[];
    model_variants?: Record<string, { image: string; gallery?: string[] }>;
  };
  initialModel?: string;
}

function getEstimatedDeliveryDates(startDays = 2, endDays = 4) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() + startDays);
  const end = new Date(now);
  end.setDate(now.getDate() + endDays);

  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', opts);
  const endStr = end.toLocaleDateString('en-US', opts);
  return { range: `${startStr} - ${endStr}` };
}

export default function ProductDetailClient({ product, initialModel }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const cleanInitialModel = initialModel ? initialModel.replace(/^New!\s*/i, '').trim() : null;

  // Color Variants
  const colorVariants: ColorVariant[] = product.color_variants || [];
  const [selectedColor, setSelectedColor] = useState<string>(
    colorVariants.length > 0 ? colorVariants[0].name : ''
  );

  // Brand dropdown state: accurately initialized to the product's authentic brand
  const initialBrandKey = detectInitialBrand(product, cleanInitialModel);
  const [selectedBrandKey, setSelectedBrandKey] = useState<string>(initialBrandKey);

  // Model dropdown state - sanitized clean model names (NO "New!" prefix)
  const currentBrandModels =
    brandModelsMap[selectedBrandKey] ||
    (product.models ? product.models.map((m) => m.replace(/^New!\s*/i, '')) : []);

  const [selectedDevice, setSelectedDevice] = useState<string>(() => {
    if (cleanInitialModel) return cleanInitialModel;
    if (currentBrandModels.length > 0) return currentBrandModels[0];
    return 'iPhone 16 Pro Max';
  });

  // Variant Switcher state: Non-MagSafe (clear) by default (1:1 with Rezoni)
  const [selectedVariantType, setSelectedVariantType] = useState<'magsafe' | 'clear'>('clear');

  // Loox Reviews Dynamic Interactive States: show 5 reviews initially (matching rezoni data-limit="5")
  const [visibleReviewCount, setVisibleReviewCount] = useState<number>(5);
  const [activePhotoModal, setActivePhotoModal] = useState<CustomerReview | null>(null);
  const [writeReviewOpen, setWriteReviewOpen] = useState<boolean>(false);

  // ================= Pre-select model and brand from URL search params & variant ID =================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const modelParam = params.get('model');
    const variantParam = params.get('variant');

    let resolvedModel: string | undefined;
    let resolvedBrand: string | undefined;

    if (modelParam) {
      resolvedModel = decodeURIComponent(modelParam).replace(/^New!\s*/i, '').trim();
      resolvedBrand = modelToBrandMap[resolvedModel.toLowerCase()] || normalizeBrandKey(resolvedModel);
    } else if (variantParam && variantToModelMap[variantParam]) {
      resolvedModel = variantToModelMap[variantParam];
      resolvedBrand = modelToBrandMap[resolvedModel.toLowerCase()] || normalizeBrandKey(resolvedModel);
    } else {
      // Check pathname
      const path = window.location.pathname.toLowerCase();
      const matched = currentBrandModels.find((m) => {
        const cleanM = m.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanP = path.replace(/[^a-z0-9]/g, '');
        return cleanM.length > 3 && cleanP.includes(cleanM);
      });
      if (matched) {
        resolvedModel = matched;
        resolvedBrand = modelToBrandMap[matched.toLowerCase()] || normalizeBrandKey(matched);
      }
    }

    if (resolvedModel) {
      setSelectedDevice(resolvedModel);
      if (resolvedBrand) {
        setSelectedBrandKey(normalizeBrandKey(resolvedBrand));
      }
      const media = getDeviceMedia(resolvedModel);
      if (media) {
        const initImg = selectedVariantType === 'clear' ? (media.clear || media.magsafe) : (media.magsafe || media.clear);
        if (initImg) setSelectedImage(initImg);
      } else if (product.model_variants && product.model_variants[resolvedModel]?.image) {
        setSelectedImage(product.model_variants[resolvedModel].image);
      }
    }
  }, [product, currentBrandModels, selectedVariantType]);

  const activeColorVariant =
    colorVariants.find(
      (c) => c.name.toLowerCase() === selectedColor.toLowerCase()
    ) || (colorVariants.length > 0 ? colorVariants[0] : null);

  const currentModelVariant =
    product.model_variants && selectedDevice && product.model_variants[selectedDevice]
      ? product.model_variants[selectedDevice]
      : null;

  const currentMedia: DeviceMedia | null = getDeviceMedia(selectedDevice);

  const activeGallery: string[] =
    activeColorVariant &&
    activeColorVariant.gallery &&
    activeColorVariant.gallery.length > 0
      ? activeColorVariant.gallery
      : currentMedia
      ? (selectedVariantType === 'clear'
          ? (currentMedia.clearGallery && currentMedia.clearGallery.length > 0 ? currentMedia.clearGallery : currentMedia.magsafeGallery)
          : (currentMedia.magsafeGallery && currentMedia.magsafeGallery.length > 0 ? currentMedia.magsafeGallery : currentMedia.clearGallery))
      : currentModelVariant &&
        currentModelVariant.gallery &&
        currentModelVariant.gallery.length > 0
      ? currentModelVariant.gallery
      : product.images && product.images.length > 0
      ? product.images
      : [product.primary_image];

  const [selectedImage, setSelectedImage] = useState<string>(
    activeColorVariant
      ? activeColorVariant.image
      : currentMedia
      ? ((selectedVariantType === 'clear' ? (currentMedia.clear || currentMedia.magsafe) : (currentMedia.magsafe || currentMedia.clear)) || product.primary_image)
      : currentModelVariant
      ? currentModelVariant.image
      : product.primary_image || (product.images && product.images[0]) || ''
  );

  // Synchronize main image whenever model or variant changes
  useEffect(() => {
    if (activeColorVariant) {
      setSelectedImage(activeColorVariant.image);
      return;
    }
    const media = getDeviceMedia(selectedDevice);
    if (media) {
      const nextImg = selectedVariantType === 'clear' ? (media.clear || media.magsafe) : (media.magsafe || media.clear);
      if (nextImg) setSelectedImage(nextImg);
    }
  }, [selectedDevice, selectedVariantType, activeColorVariant]);

  const [deliveryDateRange, setDeliveryDateRange] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>('desc');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const { range } = getEstimatedDeliveryDates(2, 4);
    setDeliveryDateRange(range);
  }, []);

  const handleBrandChange = (brandKey: string) => {
    const normBrand = normalizeBrandKey(brandKey);
    setSelectedBrandKey(normBrand);
    setVisibleReviewCount(5);
    const models = brandModelsMap[normBrand] || [];
    if (models.length > 0) {
      const firstModel = models[0];
      setSelectedDevice(firstModel);
      const media = getDeviceMedia(firstModel);
      if (media) {
        const nextImg = selectedVariantType === 'clear' ? (media.clear || media.magsafe) : (media.magsafe || media.clear);
        if (nextImg) setSelectedImage(nextImg);
      }
    }
    const targetBrand = brandOptions.find((b) => b.brandKey === normBrand || b.brandKey === brandKey);
    if (targetBrand && targetBrand.handle !== product.handle) {
      router.push(`/products/${targetBrand.handle}`, { scroll: false });
    }
  };

  const handleColorChange = (variant: ColorVariant) => {
    setSelectedColor(variant.name);
    setSelectedImage(variant.image);
  };

  const handleModelChange = (model: string) => {
    setSelectedDevice(model);
    const media = getDeviceMedia(model);
    if (media) {
      const nextImg = selectedVariantType === 'clear' ? (media.clear || media.magsafe) : (media.magsafe || media.clear);
      if (nextImg) setSelectedImage(nextImg);
    } else if (product.model_variants && product.model_variants[model]?.image) {
      setSelectedImage(product.model_variants[model].image);
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('model', model);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const switchVariantType = (type: 'magsafe' | 'clear') => {
    setSelectedVariantType(type);
    const media = getDeviceMedia(selectedDevice);
    if (media) {
      const nextImg = type === 'clear' ? (media.clear || media.magsafe) : (media.magsafe || media.clear);
      if (nextImg) setSelectedImage(nextImg);
    }
  };

  // Check if product is a mobile phone (all mobile phone cases support MagSafe and Non-MagSafe)
  const isPhoneCase =
    !product.handle?.toLowerCase().includes('airpod') &&
    !product.title?.toLowerCase().includes('airpod');

  // Dynamic variant pricing: MagSafe = ₹399 (compare @ ₹999), Non-MagSafe = ₹299 (compare @ ₹799)
  const isMagSafe = selectedVariantType === 'magsafe';
  const effectivePrice = isPhoneCase ? (isMagSafe ? 399 : 299) : (product.price || 299);
  const effectiveComparePrice = isPhoneCase ? (isMagSafe ? 999 : 799) : (product.compare_at_price || 699);
  const savePercentage = Math.max(10, Math.round(((effectiveComparePrice - effectivePrice) / effectiveComparePrice) * 100));

  const handleAddToCart = () => {
    const device =
      selectedDevice || (currentBrandModels.length > 0 ? currentBrandModels[0] : 'Standard');
    const hasColors = colorVariants.length > 0;
    const variantTag = isPhoneCase
      ? selectedVariantType === 'magsafe'
        ? 'MagSafe'
        : 'Non-MagSafe'
      : '';
    addToCart({
      id: `${product.id}-${device}-${selectedColor}-${selectedVariantType}`,
      title: hasColors
        ? (variantTag ? `${product.title} (${variantTag}) - ${selectedColor}` : `${product.title} - ${selectedColor}`)
        : (variantTag ? `${product.title} (${variantTag})` : product.title),
      price: effectivePrice,
      image:
        selectedImage ||
        (activeColorVariant ? activeColorVariant.image : (currentMedia?.magsafe || product.primary_image)),
      device: device,
      color: hasColors ? selectedColor : undefined,
      quantity: 1,
    });
  };

  const scrollToGuarantee = () => {
    const el = document.getElementById('guaranteeSection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToReviews = () => {
    const el = document.getElementById('reviews-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Authentic brand-specific customer reviews (loads incrementally via Show more reviews)
  const activeReviews: CustomerReview[] =
    brandReviewsData[selectedBrandKey] ||
    brandReviewsData['iPhone Cases'] ||
    [];
  const displayedReviews = activeReviews.slice(0, visibleReviewCount);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh', fontFamily: 'Montserrat, sans-serif', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* ================= 100% ANTI-YELLOW GUARANTEE TOP BANNER (1:1 with Rezoni live store) ================= */}
      <div className="rezoni-anti-yellow-header">
        100% Anti-Yellow Guarantee - Free Replacement if it ever Yellows.
      </div>

      <div className="container pdp-container" style={{ paddingTop: '20px', paddingBottom: '80px' }}>
        {/* Breadcrumb matching Rezoni */}
        <div
          style={{
            fontSize: '12px',
            color: '#888888',
            marginBottom: '20px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <Link href="/" style={{ color: '#888888', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#111111' }}>{product.title}</span>
        </div>

        {/* 2-Column Product Layout matching Rezoni live store */}
        <div className="pdp-main-grid">
          {/* ================= LEFT COLUMN: 1:1 SQUARE MEDIA GALLERY ================= */}
          <div className="pdp-media-sticky">
            {/* Primary Square Media Box */}
            <div
              style={{
                position: 'relative',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                aspectRatio: '1 / 1',
                marginBottom: '16px',
                border: '1px solid #f0f0f0',
                width: '100%',
                maxWidth: '100%',
              }}
            >
              <img
                src={selectedImage || product.primary_image}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Square Thumbnails Row matching Rezoni with Hidden Scrollbars */}
            {activeGallery.length > 1 && (
              <div
                className="hide-scrollbar"
                style={{
                  display: 'flex',
                  gap: '10px',
                  overflowX: 'auto',
                  paddingBottom: '6px',
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {activeGallery.map((img, idx) => {
                  const isCurrent = selectedImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '4px',
                        border: isCurrent ? '2px solid #000000' : '1px solid #e0e0e0',
                        padding: '2px',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'border-color 0.2s ease',
                      }}
                    >
                      <img
                        src={img}
                        alt={`${product.title} - thumbnail ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ================= RIGHT COLUMN: 1:1 PRODUCT DETAILS MATCHING REZONI ================= */}
          <div style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
            {/* 1. Loox Reviews Star Rating Header */}
            <div
              onClick={scrollToReviews}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              <span style={{ color: '#FBBE01', fontSize: '16px', letterSpacing: '2px' }}>
                ★★★★★
              </span>
              <span style={{ marginLeft: '6px', fontSize: '14px', color: '#333333', fontWeight: 500 }}>
                3,624 Reviews
              </span>
            </div>

            {/* 2. Lifetime Anti Yellow Guarantee Pill Button */}
            <div style={{ marginBottom: '14px' }}>
              <button
                type="button"
                className="guarantee-button"
                id="scrollButton"
                onClick={scrollToGuarantee}
              >
                <img
                  src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/Asset_53_4x_94d81475-4e57-4186-b939-ebfdad7fadb4.png?v=1741422507"
                  alt="Guarantee Icon"
                />
                LIFETIME Anti Yellow Guarantee
              </button>
            </div>

            {/* 3. Product Title matching Rezoni live store exactly 1:1 */}
            <h1
              className="pdp-product-title"
              style={{
                fontSize: '26px',
                fontWeight: 900,
                color: '#111111',
                letterSpacing: '-0.5px',
                margin: '0 0 10px',
                lineHeight: 1.25,
                wordBreak: 'break-word',
              }}
            >
              {product.title}
            </h1>

            {/* 4. Price Line matching Rezoni live store */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px 12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#111111' }}>
                Rs. {effectivePrice.toFixed(2)}
              </span>
              <span style={{ fontSize: '16px', color: '#888888', textDecoration: 'line-through' }}>
                Rs. {effectiveComparePrice.toFixed(2)}
              </span>
              <span
                style={{
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '3px',
                  letterSpacing: '0.5px',
                }}
              >
                Save {savePercentage}%
              </span>
            </div>

            {/* 5. Banner Image 1 (High Quality Anti-Yellow Banner from Rezoni) */}
            <div style={{ marginBottom: '14px', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
              <img
                src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/antiyellow_banner_1.jpg?v=1778741440"
                alt="Anti-Yellow High Quality Banner"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            {/* 6. Banner Image 2 (Free Gifts Panel from Rezoni) */}
            <div style={{ marginBottom: '16px', borderRadius: '6px', overflow: 'hidden' }}>
              <img
                src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/free_gifts_copy_2_jpg.jpg?v=1778750717"
                alt="Free Gifts Offer"
                style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
              />
            </div>

            {/* 7. Why You’ll Love It Section with Authentic Icons */}
            <div style={{ margin: '18px 0', padding: '12px 0', borderTop: '1px solid #eeeeee', borderBottom: '1px solid #eeeeee' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', color: '#111111' }}>
                Why You’ll Love It:
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/Mask_group_2x_d672b274-bddd-4141-b9ee-a32fce415aee.png?v=1728817172"
                      alt="UV-resistant icon"
                      style={{ width: '26px', height: '26px', objectFit: 'contain' }}
                    />
                  </div>
                  <span style={{ fontSize: '14px', color: '#333333', fontWeight: 500 }}>
                    UV Shield Technology™
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/switchgg.png?v=1729017600"
                      alt="Long-lasting clarity icon"
                      style={{ width: '26px', height: '26px', objectFit: 'contain' }}
                    />
                  </div>
                  <span style={{ fontSize: '14px', color: '#333333', fontWeight: 500 }}>
                    Long-Lasting Clarity
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/eyedf.png?v=1729017600"
                      alt="Replacement guarantee icon"
                      style={{ width: '26px', height: '26px', objectFit: 'contain' }}
                    />
                  </div>
                  <span style={{ fontSize: '14px', color: '#333333', fontWeight: 500 }}>
                    Free Replacement if it ever Yellows
                  </span>
                </div>
              </div>
            </div>

            {/* 8. Product Switcher (Brand & Model Dropdowns matching Rezoni - Clean Model Names) */}
            <div className="product-switcher-container">
              <div className="dropdown-section">
                <h2 className="case-type-title">Brand:</h2>
                <select
                  className="product-switcher-dropdown"
                  value={selectedBrandKey}
                  onChange={(e) => handleBrandChange(e.target.value)}
                >
                  {brandOptions.map((b) => (
                    <option key={b.brandKey} value={b.brandKey}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dropdown-section" style={{ marginBottom: 0 }}>
                <h2 className="case-type-title">Model:</h2>
                <select
                  className="product-switcher-dropdown"
                  value={selectedDevice}
                  onChange={(e) => handleModelChange(e.target.value)}
                >
                  {currentBrandModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 9. Variant Selection: MagSafe vs Non-MagSafe Cards (All Mobile Phones - 1:1 with Rezoni) */}
            {isPhoneCase && (
              <>
                <h2 id="variant-title">Variant:</h2>
                <div className="variant-selection-container">
                  <div
                    className={`variant-option ${selectedVariantType === 'magsafe' ? 'selected' : ''}`}
                    onClick={() => switchVariantType('magsafe')}
                    data-switch-type="magsafe"
                  >
                    <img
                      src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/1_6fe2ced4-0f1d-4983-aa68-67431a2044d6.jpg?v=1739175274"
                      alt="MagSafe"
                    />
                    <p>MagSafe</p>
                  </div>
                  <div
                    className={`variant-option ${selectedVariantType === 'clear' ? 'selected' : ''}`}
                    onClick={() => switchVariantType('clear')}
                    data-switch-type="clear"
                  >
                    <img
                      src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/2_bd98202b-ffa4-4f2b-a4b5-d6dd38673b96.jpg?v=1739175274"
                      alt="Non-MagSafe"
                    />
                    <p>Non-MagSafe</p>
                  </div>
                </div>
              </>
            )}

            {/* Color Swatches if available */}
            {colorVariants.length > 0 && (
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '8px' }}>
                  Color: <span style={{ fontWeight: 400, color: '#666' }}>{selectedColor}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  {colorVariants.map((variant) => {
                    const isSelected =
                      selectedColor.toLowerCase() === variant.name.toLowerCase();
                    return (
                      <button
                        key={variant.name}
                        type="button"
                        onClick={() => handleColorChange(variant)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: variant.hex,
                          border:
                            variant.hex.toLowerCase() === '#ffffff'
                              ? '1px solid #cccccc'
                              : 'none',
                          outline: isSelected ? '2px solid #000000' : 'none',
                          outlineOffset: '2px',
                          cursor: 'pointer',
                          display: 'inline-block',
                          padding: 0,
                          transition: 'transform 0.15s ease',
                          transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                        }}
                        title={variant.name}
                        aria-label={`Select color ${variant.name}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* 10. Add to Cart Section with Summer Sale Ribbon */}
            <div style={{ position: 'relative', width: '100%', margin: '18px 0 12px' }}>
              <div
                style={{
                  backgroundColor: '#1c1c1c',
                  color: '#ffffff',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '8px 12px',
                  borderRadius: '8px 8px 0 0',
                  letterSpacing: '0.5px',
                }}
              >
                <b>🔥 BIG SUMMER SALE | LIMITED TIME ONLY</b>
              </div>
              <button
                onClick={handleAddToCart}
                style={{
                  width: '100%',
                  backgroundColor: '#ff6700',
                  color: '#ffffff',
                  border: 'none',
                  height: '50px',
                  borderRadius: '0 0 8px 8px',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e65c00')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff6700')}
              >
                Add to cart
              </button>
            </div>

            {/* 11. Special Offers Box (1:1 with Gokwik Offer Widget & Bundle Deals) */}
            <div
              style={{
                backgroundColor: '#fffaeb',
                border: '1px solid #fbe6c8',
                borderRadius: '8px',
                padding: '12px 16px',
                margin: '12px 0 16px',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#f79009',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px',
                }}
              >
                <span>🏷️</span>
                <span>Special Offers & Deals</span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#444444', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>• <strong>Bundle Offer:</strong> Buy 1 @ ₹299 | Buy 2 @ ₹499 | Buy 3 @ ₹699</div>
                <div>• <strong>100% Free Shipping</strong> on All Orders (Limited Time Sitewide)</div>
                <div>• <strong>Extra 10% Off</strong> on all Prepaid Orders (Auto applied at checkout)</div>
                <div>• <strong>Buy 2 Get 20% Off</strong> — Use Code: <span style={{ color: '#ff6700', fontWeight: 700 }}>BUY2</span></div>
              </div>
            </div>

            {/* 12. Dynamic Delivery Date */}
            <div style={{ fontSize: '13.5px', color: '#444444', margin: '14px 0' }}>
              📦 Ships in 1 day, estimated delivery:{' '}
              <strong style={{ color: '#000000' }} suppressHydrationWarning>
                {deliveryDateRange || getEstimatedDeliveryDates(2, 4).range}
              </strong>
            </div>

            {/* 13. Benefits Wrapper (#benefits-wrapper matching Rezoni) */}
            <div id="benefits-wrapper" className="pdp-benefits-wrapper">
              <div className="pdp-benefit-col">
                <img
                  src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/truck.png?v=1711003297"
                  alt="Express Delivery"
                  className="pdp-benefit-icon"
                />
                <div className="pdp-benefit-title">Express Delivery</div>
                <div className="pdp-benefit-subtitle">Estimated 2-5 Days</div>
              </div>

              <div className="pdp-benefit-col">
                <img
                  src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/exchange.png?v=1711003297"
                  alt="7 Day Risk Free"
                  className="pdp-benefit-icon"
                />
                <div className="pdp-benefit-title">7 Day Risk Free</div>
                <div className="pdp-benefit-subtitle">Returns and Exchanges</div>
              </div>

              <div className="pdp-benefit-col">
                <img
                  src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/SECURE.png?v=1711010153"
                  alt="Secure Payments"
                  className="pdp-benefit-icon"
                />
                <div className="pdp-benefit-title">Secure Payments</div>
                <div className="pdp-benefit-subtitle">SSL Secured</div>
              </div>
            </div>

            {/* 14. 100% Lifetime Anti-Yellow Guarantee Section (#guaranteeSection matching Rezoni) */}
            <div id="guaranteeSection" className="guarantee-container">
              <div className="guarantee-icon">
                <img
                  src="https://cdn.shopify.com/s/files/1/0621/7829/6040/files/anti-yellowjjj.png?v=1729939569"
                  alt="Anti-Yellow Guarantee"
                  style={{ width: '90px' }}
                />
              </div>
              <div className="guarantee-content">
                <p>
                  <span>Lifetime Anti-Yellow Guarantee!</span>
                </p>
                <p>
                  We&apos;re so confident in the quality of our cases and our zero-yellowing technology that we’re offering a free replacement if your case ever yellows.
                </p>
                <a
                  href="/pages/anti-yellow-warranty"
                  style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 700 }}
                >
                  T&amp;C Apply.
                </a>
              </div>
            </div>

            {/* 15. Product Information Accordions matching Rezoni */}
            <div style={{ borderTop: '1px solid #e0e0e0', marginTop: '16px' }}>
              {/* Accordion 1: Description */}
              <div style={{ borderBottom: '1px solid #e0e0e0' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('desc')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 0',
                    background: 'none',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    color: '#111111',
                    textAlign: 'left',
                  }}
                >
                  <span>DESCRIPTION</span>
                  <span style={{ fontSize: '16px', transform: openAccordion === 'desc' ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {openAccordion === 'desc' && (
                  <div style={{ padding: '0 0 16px', fontSize: '13.5px', lineHeight: 1.7, color: '#444444' }}>
                    <p style={{ marginBottom: '10px' }}>
                      Designed to showcase your phone&apos;s natural beauty while providing top-tier protection. Features our proprietary UV-resistant composite formula that prevents yellowing over time.
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0 }}>
                      <li>Certified N52 strong magnets for high-speed MagSafe wireless charging</li>
                      <li>Reinforced Air-Cushion shockproof corner bumpers (8ft drop certified)</li>
                      <li>0.8mm raised camera bezel and 1.2mm raised screen lip protection</li>
                      <li>Scratch-resistant oleophobic coating prevents oil, fingerprints &amp; smudges</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Shipping & Delivery */}
              <div style={{ borderBottom: '1px solid #e0e0e0' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 0',
                    background: 'none',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    color: '#111111',
                    textAlign: 'left',
                  }}
                >
                  <span>SHIPPING &amp; DELIVERY</span>
                  <span style={{ fontSize: '16px', transform: openAccordion === 'shipping' ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {openAccordion === 'shipping' && (
                  <div style={{ padding: '0 0 16px', fontSize: '13.5px', lineHeight: 1.7, color: '#444444' }}>
                    <p style={{ marginBottom: '8px' }}>
                      <strong>Dispatch:</strong> All orders are dispatched within 24 hours of confirmation.
                    </p>
                    <p style={{ marginBottom: '8px' }}>
                      <strong>Metro Cities:</strong> 2-3 business days.
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Rest of India:</strong> 3-5 business days via premium air couriers (BlueDart &amp; Delhivery).
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Returns & Exchanges */}
              <div style={{ borderBottom: '1px solid #e0e0e0' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('returns')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 0',
                    background: 'none',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    color: '#111111',
                    textAlign: 'left',
                  }}
                >
                  <span>RETURNS &amp; EXCHANGES</span>
                  <span style={{ fontSize: '16px', transform: openAccordion === 'returns' ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {openAccordion === 'returns' && (
                  <div style={{ padding: '0 0 16px', fontSize: '13.5px', lineHeight: 1.7, color: '#444444' }}>
                    <p style={{ margin: 0 }}>
                      We offer a 7-day risk-free exchange and return window if you receive a damaged or incorrect size case. Contact our support team for a seamless replacement pickup.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 4: Care Instructions */}
              <div style={{ borderBottom: '1px solid #e0e0e0' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 0',
                    background: 'none',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    color: '#111111',
                    textAlign: 'left',
                  }}
                >
                  <span>CARE INSTRUCTIONS</span>
                  <span style={{ fontSize: '16px', transform: openAccordion === 'care' ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {openAccordion === 'care' && (
                  <div style={{ padding: '0 0 16px', fontSize: '13.5px', lineHeight: 1.7, color: '#444444' }}>
                    <p style={{ margin: 0 }}>
                      Wipe gently with a soft microfiber cloth every 2-3 days to maintain peak optical clarity and remove dust or skin oils. Avoid harsh alcohol solvent rubs on the case surface.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= REAL REVIEWS, FROM REAL CUSTOMERS (1:1 with Rezoni) ================= */}
        <div id="reviews-section" style={{ marginTop: '60px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          <div className="customer-reviews-section">
            <h2 className="customer-reviews-title">Real Reviews, From Real Customers</h2>
          </div>

          {/* Loox Widget Container */}
          <div style={{ marginTop: '30px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            {/* Loox Header Bar (4.9 Rating, 96,241 Reviews, Write a review) */}
            <div className="pdp-reviews-header-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg
                    viewBox="0 0 24 24"
                    style={{ width: '28px', height: '28px', fill: '#FBBE01' }}
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: '#111111' }}>4.9</span>
                </div>
                <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '14px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111111' }}>96,241 Reviews</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setWriteReviewOpen(true)}
                  style={{
                    padding: '8px 18px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #222222',
                    borderRadius: '2px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#111111',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#111111';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#111111';
                  }}
                >
                  Write a review
                </button>
              </div>
            </div>

            {/* Customer Reviews Grid: Authentic 1:1 Responsive Layout with smooth fade-in */}
            <div className="loox-reviews-grid">
              {displayedReviews.map((rev, idx) => (
                <div key={idx} className="loox-review-card-item">
                  {/* Photo at the top of the card if present (1:1 with Loox) */}
                  {rev.img && (
                    <div
                      className="item-img-top"
                      onClick={() => setActivePhotoModal(rev)}
                    >
                      <img
                        src={rev.img}
                        alt={`Review by ${rev.name}`}
                      />
                    </div>
                  )}

                  <div className="box-content">
                    {/* Review Header: Name + Verified Icon */}
                    <div className="block-title">
                      <span>{rev.name}</span>
                      <svg
                        viewBox="0 0 24 24"
                        style={{ width: '15px', height: '15px', fill: '#111111' }}
                        aria-label="Verified Buyer"
                      >
                        <path d="m10.6 16.6 7.05-7.05-1.4-1.4-5.65 5.65-2.85-2.85-1.4 1.4 4.25 4.25ZM12 22a9.738 9.738 0 0 1-3.9-.788 10.099 10.099 0 0 1-3.175-2.137c-.9-.9-1.612-1.958-2.137-3.175A9.738 9.738 0 0 1 2 12a9.74 9.74 0 0 1 .788-3.9 10.099 10.099 0 0 1 2.137-3.175c.9-.9 1.958-1.612 3.175-2.137A9.738 9.738 0 0 1 12 2c1.383 0 2.683.262 3.9.788 1.217.525 2.275 1.237 3.175 2.137.9.9 1.612 1.958 2.137 3.175A9.738 9.738 0 0 1 12 22Z" />
                      </svg>
                    </div>

                    {/* Stars */}
                    <div className="block-stars">
                      {[...Array(5)].map((_, sIdx) => (
                        <svg
                          key={sIdx}
                          viewBox="0 0 24 24"
                          style={{ width: '13px', height: '13px', fill: '#FBBE01' }}
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>

                    {/* Review Body */}
                    <p className="main-text">
                      {rev.body}
                    </p>

                    {/* Date */}
                    <div className="time-meta">
                      {rev.date}
                    </div>
                  </div>

                  {/* Product Box at Bottom */}
                  <div className="product-box-bottom">
                    <img
                      src={selectedImage || product.primary_image}
                      alt={product.title}
                    />
                    <span className="name">
                      {product.title} {selectedDevice ? `• ${selectedDevice}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Reviews Button matching Loox 1:1 */}
            {visibleReviewCount < activeReviews.length && (
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                  type="button"
                  id="loadMore"
                  className="btn lx-btn lx-primary load-more-button"
                  onClick={() => setVisibleReviewCount((prev) => prev + 5)}
                  style={{
                    display: 'inline-block',
                    padding: '9px 24px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #222222',
                    color: '#222222',
                    borderRadius: '2px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#111111';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#222222';
                  }}
                >
                  Show more reviews
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= 4 AUTHENTIC ALTERNATING VIDEO SECTIONS (1:1 with Rezoni) ================= */}
        <div style={{ marginTop: '60px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          {/* Section 1: Black Background (Video Left, Text Right) */}
          <section
            className="rezoni-split-section"
            style={{ backgroundColor: '#000000', color: '#ffffff' }}
          >
            <div className="rezoni-split-video">
              <video autoPlay loop muted playsInline>
                <source src="https://cdn.shopify.com/videos/c/o/v/c48eff385dea465193afbf36a54e8206.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="rezoni-split-text">
              <h2>India’s First Anti-Yellow Case</h2>
              <p>
                Finally, a clear case that stands the test of time. Introducing India’s first anti-yellow case, engineered to stay crystal clear – so your phone always looks fresh out of the box.
              </p>
            </div>
          </section>

          {/* Section 2: Dark Gray #2c2c2c (Text Left, Video Right) */}
          <section
            className="rezoni-split-section reverse"
            style={{ backgroundColor: '#2c2c2c', color: '#ffffff' }}
          >
            <div className="rezoni-split-text">
              <h2>100% Yellow-Free Guarantee</h2>
              <p>
                We’re so confident it won’t yellow, we’re putting our money on it. Compare it with others and see why we offer a 100% money-back guarantee.
              </p>
            </div>
            <div className="rezoni-split-video">
              <video autoPlay loop muted playsInline>
                <source src="https://cdn.shopify.com/videos/c/o/v/a90aced0315c487f8e7066dd555bd0c2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </section>

          {/* Section 3: White Background (Text Left, Video Right) */}
          <section
            className="rezoni-split-section"
            style={{ backgroundColor: '#ffffff', color: '#000000', border: '1px solid #eeeeee' }}
          >
            <div className="rezoni-split-text">
              <h2 style={{ color: '#000000' }}>Everyday Drop Protection</h2>
              <p style={{ color: '#333333' }}>
                Designed for real-life situations, our case offers everyday protection from drops and scratches. Keep your phone safe without the added bulk, ensuring it stays looking new.
              </p>
            </div>
            <div className="rezoni-split-video">
              <video autoPlay loop muted playsInline>
                <source src="https://cdn.shopify.com/videos/c/o/v/640930fbcc234118b37c90d811b84332.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </section>

          {/* Section 4: Orange Background (Video Left, Text Right) */}
          <section
            className="rezoni-split-section"
            style={{ backgroundColor: '#ff6700', color: '#ffffff' }}
          >
            <div className="rezoni-split-video">
              <video autoPlay loop muted playsInline>
                <source src="https://cdn.shopify.com/videos/c/o/v/e3c3c44f2e4e4262bb31358964708caa.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="rezoni-split-text">
              <h2>MagSafe, Reimagined</h2>
              <p>
                Experience the power of certified N52M magnets. Our strongest magnets ensure perfect MagSafe compatibility, delivering a secure attachment every time.
              </p>
            </div>
          </section>
        </div>

        {/* ================= FREQUENTLY ASKED QUESTIONS (FAQ) ================= */}
        <div style={{ marginTop: '60px', maxWidth: '900px', margin: '60px auto 0', width: '100%', boxSizing: 'border-box' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: '28px',
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '-0.5px',
              marginBottom: '28px',
            }}
          >
            Frequently Asked Questions (FAQ)
          </h2>
          <div>
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="faq-box">
                  <button
                    type="button"
                    className="faq-toggle"
                    onClick={() => toggleFaq(idx)}
                  >
                    <span>{item.q}</span>
                    <span style={{ fontSize: '20px', fontWeight: 400, marginLeft: '12px' }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      <p style={{ margin: 0 }}>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= PHOTO ZOOM LIGHTBOX MODAL ================= */}
      {activePhotoModal && (
        <div
          onClick={() => setActivePhotoModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '680px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
              position: 'relative',
              boxSizing: 'border-box',
              maxHeight: '90vh',
            }}
          >
            <button
              type="button"
              onClick={() => setActivePhotoModal(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.6)',
                color: '#ffffff',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              ✕
            </button>
            <div style={{ maxHeight: '60vh', overflow: 'hidden', backgroundColor: '#000000' }}>
              <img
                src={activePhotoModal.img || ''}
                alt={activePhotoModal.name}
                style={{ width: '100%', height: '100%', maxHeight: '60vh', objectFit: 'contain' }}
              />
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '16px', color: '#111111' }}>{activePhotoModal.name}</strong>
                  <span style={{ fontSize: '11px', color: '#2e7d32', backgroundColor: '#e8f5e9', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    ✓ Verified Buyer
                  </span>
                </div>
                <span style={{ color: '#FBBE01', fontSize: '16px' }}>★★★★★</span>
              </div>
              <p style={{ fontSize: '14px', color: '#444444', lineHeight: 1.6, margin: 0 }}>
                {activePhotoModal.body}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= WRITE A REVIEW MODAL ================= */}
      {writeReviewOpen && (
        <div
          onClick={() => setWriteReviewOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px 20px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              position: 'relative',
              boxSizing: 'border-box',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              type="button"
              onClick={() => setWriteReviewOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111', margin: '0 0 8px' }}>
              Write a Review
            </h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
              Share your experience with <strong>{product.title}</strong>
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Overall Rating</label>
              <div style={{ fontSize: '24px', color: '#FBBE01', cursor: 'pointer' }}>★★★★★</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Your Review</label>
              <textarea
                rows={4}
                placeholder="What did you like about the clarity, fit, and protection?"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', resize: 'vertical' }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                alert('Thank you! Your review has been submitted for moderation.');
                setWriteReviewOpen(false);
              }}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#ff6700',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: 'pointer',
              }}
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
