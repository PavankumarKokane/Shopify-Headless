import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getCollections } from '../lib/shopify';
import ProductCard from '../components/ProductCard';
import CollectionCard from '../components/CollectionCard';

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
        console.log(collectionsData);
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

  return (
    <div className="space-y-16">
      {/* Hero section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Store hero"
          />
          <div className="absolute inset-0 bg-gray-600 mix-blend-multiply" aria-hidden="true"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Welcome to our Store
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Discover our curated collection of premium products.
          </p>
          <div className="mt-10">
            <Link
              to="/collections"
              className="inline-block bg-white py-3 px-8 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

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
            className="text-base font-medium text-indigo-600 hover:text-indigo-500"
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
            className="text-base font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all products
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}