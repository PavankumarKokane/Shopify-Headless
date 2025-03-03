import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const image = product.images.edges[0]?.node || null;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const currencyCode = product.priceRange.minVariantPrice.currencyCode;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });

  return (
    <Link to={`/products/${product.handle}`} className="group">
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || product.title}
            className="w-full h-full object-center object-cover group-hover:opacity-75"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">
        {formatter.format(price)}
      </p>
    </Link>
  );
}