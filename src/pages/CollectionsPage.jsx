import React, { useState, useEffect } from 'react';
import { getCollections } from '../lib/shopify';
import CollectionCard from '../components/CollectionCard';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoading(true);
        const collectionsData = await getCollections();
        setCollections(collectionsData);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Failed to load collections. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
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

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:max-w-full 2xl:px-[5%]">
        <div className="py-16">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Collections
          </h1>
          <p className="mt-4 max-w-xl text-sm text-gray-700">
            Browse our collections and find the perfect products for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {collections.map((collection) => (
            collection.products.nodes[0] && <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  );
}