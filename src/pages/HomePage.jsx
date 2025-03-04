import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getFeaturedProducts, getCollections } from '../lib/shopify';
import ProductCard from '../components/ProductCard';
import CollectionCard from '../components/CollectionCard';
import Banner from '../components/Banner';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsData, collectionsData] = await Promise.all([
          getFeaturedProducts(),
          getCollections()
        ]);
        setFeaturedProducts(productsData);
        setCollections(collectionsData.slice(0, 4)); // Only show first 3 collections
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
    <div className="space-y-16">
      {/* Hero section */}
      <Banner />

      {/* Featured collections */}
      <div className='px-4 sm:px-6 lg:px-8'>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Featured Collections
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/collections"
            className="text-base font-medium text-red-600 hover:text-red-500"
          >
            View all collections
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Featured products */}
      <div className='px-4 sm:px-6 lg:px-8'>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Featured Products
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/collections"
            className="text-base font-medium text-red-600 hover:text-red-500"
          >
            View all products
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}