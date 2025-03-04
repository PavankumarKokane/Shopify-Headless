import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getProductsByCollection } from '../lib/shopify';
import ProductCard from '../components/ProductCard';

export default function CollectionPage() {
  const { handle } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCollection() {
      if (!handle) return;
      
      try {
        setLoading(true);
        const collectionData = await getProductsByCollection(handle);
        setCollection(collectionData);
      } catch (err) {
        console.error('Error fetching collection:', err);
        setError('Failed to load collection. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchCollection();
  }, [handle]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Collection Not Found</h2>
        <p className="text-gray-700 mb-8">The collection you're looking for doesn't exist.</p>
        <Link
          to="/collections"
          className="inline-block bg-indigo-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700"
        >
          View All Collections
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {collection.title}
          </h1>
          <div className="mt-4 flex items-center justify-between">
            <p className="max-w-xl text-sm text-gray-700">
              {collection.products.length} products
            </p>
            <Link
              to="/collections"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              ← Back to collections
            </Link>
          </div>
        </div>

        {collection.products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-700">No products found in this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {collection.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}