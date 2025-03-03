import React from 'react';
import { Link } from 'react-router-dom';

export default function CollectionCard({ collection }) {
  return (
    <Link to={`/collections/${collection.handle}`} className="group">
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
        {collection.image ? (
          <img
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            className="w-full h-full object-center object-cover group-hover:opacity-75"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">{collection.title}</span>
          </div>
        )}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{collection.title}</h3>
    </Link>
  );
}