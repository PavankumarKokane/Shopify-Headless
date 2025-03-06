import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { searchProducts } from '../lib/shopify';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const results = await searchProducts(query);
        setProducts(results);
      } catch (err) {
        console.error('Error searching products:', err);
        setError('Failed to search products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

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

  if (!query) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Search Products</h2>
        <p className="mt-2 text-gray-500">Enter a search term to find products</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Search Results
        </h1>
        <p className="mt-4 text-gray-500">
          {products.length} results for "{query}"
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-medium text-gray-900">No results found</h2>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or browse our{' '}
            <Link to="/collections" className="text-indigo-600 hover:text-indigo-500">
              collections
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-3 gap-x-6 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}