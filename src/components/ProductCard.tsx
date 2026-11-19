import React, { useState } from 'react';
import { Heart, Minus, Plus, Package, Check } from 'lucide-react';
import { CartItem, Product } from '../types/catalog';
import { StarRating } from './StarRating';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  isSaved: boolean;
  onToggleSave: (productId: string) => void;
  onOpenProduct: (product: Product, variantId: string) => void;
  cartItems: CartItem[];
  onAddToCart: (productId: string, variantId: string) => void;
  onUpdateCartQuantity: (
    productId: string,
    variantId: string,
    purchaseType: 'one-time' | 'autoship',
    delta: number
  ) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  isSaved,
  onToggleSave,
  onOpenProduct,
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState(product.defaultVariantId);
  const [imgError, setImgError] = useState(false);

  const variant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const cartEntry = cartItems.find(
    (item) =>
      item.productId === product.id &&
      item.variantId === variant.id &&
      item.purchaseType === 'one-time'
  );

  const discountPct =
    variant.listPriceSgd && variant.listPriceSgd > variant.priceSgd
      ? Math.round(((variant.listPriceSgd - variant.priceSgd) / variant.listPriceSgd) * 100)
      : 0;

  const perServingSgd = variant.priceSgd / Math.max(1, variant.servings);
  const autoShipSgd = variant.priceSgd * (1 - product.autoShipDiscountPct / 100);

  const kickerLabel =
    product.kicker || (discountPct >= 15 ? `Save ${discountPct}%` : undefined);

  const kickerStyles =
    kickerLabel === 'Super Special' || kickerLabel?.startsWith('Save')
      ? 'bg-[#C93B2B] text-white'
      : kickerLabel === 'iHerb Quality Pick'
        ? 'bg-[#2D5900] text-white'
        : kickerLabel === 'New'
          ? 'bg-[#1D5B79] text-white'
          : 'bg-[#E58900] text-white';

  const renderImage = (boxClass: string) => (
    <div
      onClick={() => onOpenProduct(product, variant.id)}
      className={`relative bg-[#F8F9FA] overflow-hidden cursor-pointer flex items-center justify-center ${boxClass}`}
    >
      {kickerLabel && (
        <span
          className={`absolute top-0 left-0 z-10 px-2.5 py-1 text-[11px] font-bold tracking-tight rounded-br-md ${kickerStyles}`}
        >
          {kickerLabel}
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(product.id);
        }}
        aria-label={isSaved ? 'Remove from saved' : 'Save item'}
        className="absolute top-1.5 right-1.5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-[#5A6266] hover:text-[#C93B2B] shadow-xs transition-colors cursor-pointer"
      >
        <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#C93B2B] text-[#C93B2B]' : ''}`} />
      </button>

      {!imgError ? (
        <img
          src={product.imageUrl}
          alt={`${product.brand} ${product.shortTitle}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-4 group-hover:scale-[1.03] transition-transform duration-200"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#F2F7EC] to-[#E6ECE2] w-full h-full">
          <Package className="w-10 h-10 text-[#458500] mb-2" />
          <span className="text-xs font-semibold text-[#2D5900] line-clamp-2">
            {product.shortTitle}
          </span>
        </div>
      )}

      {!variant.inStock && (
        <div className="absolute inset-x-0 bottom-0 bg-white/95 border-t border-[#E4E7E9] py-1 text-center">
          <span className="text-xs font-semibold text-[#C93B2B]">Currently Out of Stock</span>
        </div>
      )}
    </div>
  );

  const renderActionControl = () => {
    if (!variant.inStock) {
      return (
        <button
          type="button"
          onClick={() => onOpenProduct(product, variant.id)}
          className="w-full h-10 border border-[#D4D8DC] bg-[#F5F6F7] text-[#5A6266] text-xs font-semibold rounded-md hover:bg-[#ECEFF1] transition-colors cursor-pointer"
        >
          View Details
        </button>
      );
    }

    if (cartEntry) {
      return (
        <div className="flex items-center justify-between h-10 bg-[#F2F7EC] border border-[#458500] rounded-md px-1.5">
          <button
            type="button"
            onClick={() => onUpdateCartQuantity(product.id, variant.id, 'one-time', -1)}
            aria-label="Decrease quantity"
            className="w-8 h-8 flex items-center justify-center text-[#2D5900] hover:bg-[#458500]/15 rounded transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="flex items-center gap-1 text-xs font-bold text-[#2D5900] tabular-nums">
            <Check className="w-3.5 h-3.5" />
            {cartEntry.quantity} in Cart
          </span>
          <button
            type="button"
            onClick={() => onUpdateCartQuantity(product.id, variant.id, 'one-time', 1)}
            aria-label="Increase quantity"
            className="w-8 h-8 flex items-center justify-center text-[#2D5900] hover:bg-[#458500]/15 rounded transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onAddToCart(product.id, variant.id)}
        className="w-full h-10 bg-[#458500] hover:bg-[#366a00] active:scale-[0.99] text-white text-[13px] font-bold rounded-md transition-all cursor-pointer whitespace-nowrap"
      >
        Add to Cart
      </button>
    );
  };

  if (viewMode === 'list') {
    return (
      <article className="group bg-white border border-[#E4E7E9] hover:border-[#C5CCD1] rounded-lg overflow-hidden transition-all duration-150 hover:shadow-md flex flex-col sm:flex-row">
        {renderImage('sm:w-52 md:w-56 aspect-square sm:aspect-auto shrink-0 border-b sm:border-b-0 sm:border-r border-[#ECEFF1]')}

        <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#5A6266]">
              <span className="font-semibold text-[#458500]">{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{product.form}</span>
              <span aria-hidden="true">·</span>
              <span>{product.source}</span>
            </div>

            <h3 className="font-display text-[15px] font-semibold text-[#1A1D1E] leading-snug">
              <button
                type="button"
                onClick={() => onOpenProduct(product, variant.id)}
                className="text-left hover:text-[#458500] hover:underline cursor-pointer"
              >
                {product.title}
              </button>
            </h3>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} showNumeric />
              <span className="text-xs text-[#5A6266]">{product.soldRecentlyText}</span>
            </div>

            <p className="text-xs text-[#5A6266] line-clamp-2 pt-0.5">{product.description}</p>

            {/* Size Selector */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer whitespace-nowrap ${
                    v.id === variant.id
                      ? 'border-[#458500] bg-[#F2F7EC] text-[#2D5900] font-semibold'
                      : 'border-[#DDE1E4] bg-white text-[#5A6266] hover:border-[#AEB4B9]'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:w-52 shrink-0 flex flex-col justify-between sm:border-l sm:border-[#ECEFF1] sm:pl-5 pt-2 sm:pt-0">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-lg font-bold text-[#1A1D1E] tabular-nums">
                  SG${variant.priceSgd.toFixed(2)}
                </span>
                {variant.listPriceSgd && (
                  <span className="text-xs text-[#7B8287] line-through tabular-nums">
                    SG${variant.listPriceSgd.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5A6266] tabular-nums">
                SG${perServingSgd.toFixed(2)} / serving ({variant.servings} servings)
              </p>
              <p className="text-xs text-[#2D5900] font-medium tabular-nums">
                Auto-Ship: SG${autoShipSgd.toFixed(2)} (-{product.autoShipDiscountPct}%)
              </p>
            </div>

            <div className="pt-3">{renderActionControl()}</div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-white border border-[#E4E7E9] hover:border-[#C5CCD1] rounded-lg overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md flex flex-col">
      {renderImage('aspect-square border-b border-[#ECEFF1]')}

      <div className="p-4 flex-1 flex flex-col">
        {/* Brand & Form metadata line (unboxed) */}
        <div className="flex items-center gap-1.5 text-xs text-[#5A6266] mb-1 truncate">
          <span className="font-semibold text-[#366a00] truncate">{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span className="shrink-0">{product.form}</span>
        </div>

        {/* Product Title */}
        <h3 className="font-display text-[14px] font-semibold text-[#1A1D1E] leading-snug mb-2 line-clamp-2 min-h-[40px]">
          <button
            type="button"
            onClick={() => onOpenProduct(product, variant.id)}
            className="text-left hover:text-[#458500] hover:underline cursor-pointer"
          >
            {product.title}
          </button>
        </h3>

        {/* Rating & Popularity */}
        <div className="space-y-0.5 mb-2.5">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <p className="text-[11px] text-[#6B7276]">{product.soldRecentlyText}</p>
        </div>

        {/* Size Variants */}
        {product.variants.length > 1 ? (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariantId(v.id)}
                className={`px-2 py-0.5 text-[11px] rounded border transition-colors cursor-pointer whitespace-nowrap ${
                  v.id === variant.id
                    ? 'border-[#458500] bg-[#F2F7EC] text-[#2D5900] font-semibold'
                    : 'border-[#DDE1E4] bg-white text-[#5A6266] hover:border-[#AEB4B9]'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-[#5A6266] mb-3">{variant.weightText}</p>
        )}

        {/* Pricing Block anchored at bottom */}
        <div className="mt-auto pt-2 border-t border-[#F1F3F5] space-y-2.5">
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-[17px] font-extrabold tabular-nums ${
                  discountPct > 0 ? 'text-[#C93B2B]' : 'text-[#1A1D1E]'
                }`}
              >
                SG${variant.priceSgd.toFixed(2)}
              </span>
              {variant.listPriceSgd && (
                <span className="text-xs text-[#7B8287] line-through tabular-nums">
                  SG${variant.listPriceSgd.toFixed(2)}
                </span>
              )}
              {discountPct > 0 && (
                <span className="text-[11px] font-bold text-[#C93B2B] tabular-nums">
                  -{discountPct}%
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 text-[11px] text-[#5A6266] mt-0.5 tabular-nums">
              <span>SG${perServingSgd.toFixed(2)}/serving</span>
              <span className="text-[#2D5900] font-medium">
                Auto-Ship SG${autoShipSgd.toFixed(2)}
              </span>
            </div>
          </div>

          {renderActionControl()}
        </div>
      </div>
    </article>
  );
};
