import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductByHandle } from '../lib/shopify';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { convertSchemaToHtml } from '@thebeyondgroup/shopify-rich-text-renderer'

export default function ProductPage() {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState("description");

  
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      if (!handle) return;
      
      try {
        setLoading(true);
        const productData = await getProductByHandle(handle);
        setProduct(productData);
        
        // Set default selected options (first value of each option)
        const defaultOptions = {};
        productData.options.forEach((option) => {
          defaultOptions[option.name] = option.values[0];
        });
        setSelectedOptions(defaultOptions);
        
        // Set default variant
        if (productData.variants.edges.length > 0) {
          setSelectedVariant(productData.variants.edges[0].node);
        }
        
        // Set default active image
        if (productData.images.edges.length > 0) {
          setActiveImage(productData.images.edges[0].node.url);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [handle]);

  // Find the right variant when options change
  useEffect(() => {
    if (!product) return;
    
    // Find variant that matches all selected options
    const matchedVariant = product.variants.edges.find((edge) => {
      const variant = edge.node;
      return variant.selectedOptions.every((option) => 
        selectedOptions[option.name] === option.value
      );
    });
    
    if (matchedVariant) {
      setSelectedVariant(matchedVariant.node);
    }
  }, [selectedOptions, product]);

  function handleOptionChange(optionName, value) {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  }

  async function handleAddToCart() {
    if (!selectedVariant) return;
    
    setAddingToCart(true);
    try {
      const item = {
        id: selectedVariant.id,
        variantId: selectedVariant.id,
        title: product.title,
        handle: product.handle,
        image: product.images.edges[0]?.node.url || '',
        price: selectedVariant.price.amount,
        quantity: quantity
      };
      
      await addToCart(item);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  }

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

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-700 mb-8">The product you're looking for doesn't exist.</p>
        <Link
          to="/collections"
          className="inline-block bg-indigo-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedVariant?.price.currencyCode || 'USD',
  });

  const productDetails = product?.metafields?.find(metafield => metafield.key === "product_details")?.value;
  const productDetailsHTML = convertSchemaToHtml(productDetails);
  const productCare = product?.metafields?.find(metafield => metafield.key === "product_care")?.value;
  const productCareHTML = convertSchemaToHtml(productCare);
  const brand = product?.metafields?.find(metafield => metafield.key === "brand")?.value;
  const age_group = product?.metafields?.find(metafield => metafield.key === "age_group")?.value;
  const gender = product?.metafields?.find(metafield => metafield.key === "gender")?.value;
  //console.log(gender);
  const genderMetaObjects = {
    "gid://shopify/Metaobject/82952585273": "Male",
    "gid://shopify/Metaobject/82952618041": "Female",
    "gid://shopify/Metaobject/82953175097": "Unisex",
  };

  const gender_string = gender.replace(/\[|\]|"/g, "");
  const genderArray = gender_string.split(",");
  const genderLables = genderArray.map((item)=>{
    return genderMetaObjects[item];
  });

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product images */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-center object-cover aspect-[3/4]"
              />
            </div>
            
            {/* Image gallery */}
            {product.images.edges.length > 1 && (
              <div className="mt-4 grid grid-cols-6 gap-2">
                {product.images.edges.map((edge, idx) => (
                  <div 
                    key={idx}
                    className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden cursor-pointer ${
                      activeImage === edge.node.url ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => setActiveImage(edge.node.url)}
                  >
                    <img
                      loading='lazy'
                      src={edge.node.url}
                      alt={edge.node.altText || `Product image ${idx + 1}`}
                      className="w-full h-full object-center object-cover aspect-[3/4]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="mt-10 lg:mt-0 lg:col-start-2 lg:row-span-2 lg:self-start">
            <div className="max-w-lg">
              <div className="mt-4">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  {product.title}
                </h1>
              </div>

              <section aria-labelledby="information-heading" className="mt-4">
                <h2 id="information-heading" className="sr-only">
                  Product information
                </h2>

                <div className="flex items-center">
                  <p className="text-lg text-gray-900 sm:text-xl">
                    {selectedVariant && formatter.format(parseFloat(selectedVariant.price.amount))}
                  </p>
                </div>

                <div className="mt-4 space-y-6">
                  <div
                    className="text-base text-gray-700"
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                  />
                </div>

                <div className="mt-6">
                  {product.options.map((option) => (
                    <div key={option.id} className="mt-4">
                      <h3 className="text-sm text-gray-600">{option.name}</h3>
                      <div className="mt-2">
                        <div className="flex items-center flex-wrap gap-3">
                          {option.values.map((value) => (
                            <button
                              key={value}
                              type="button"
                              className={`
                                px-3 py-2 text-sm border rounded-md
                                ${
                                  selectedOptions[option.name] === value
                                    ? 'bg-indigo-600 text-white'
                                    : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                                }
                              `}
                              onClick={() => handleOptionChange(option.name, value)}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="flex items-center">
                    <h3 className="text-sm text-gray-600">Quantity</h3>
                    <div className="ml-4 flex items-center">
                      <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-gray-500"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <span className="sr-only">Decrease</span>
                        <span className="text-lg font-medium">-</span>
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="mx-2 w-12 text-center border-gray-300 rounded-md"
                      />
                      <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-gray-500"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <span className="sr-only">Increase</span>
                        <span className="text-lg font-medium">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex">
                  <button
                    type="button"
                    className="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    onClick={handleAddToCart}
                    disabled={addingToCart || !selectedVariant?.availableForSale}
                  >
                    {addingToCart ? (
                      <span className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                        Adding...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
                      </span>
                    )}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div className="p-10">
      {/* Tab Navigation */}
      <div className="flex border-b">
        {["description", "more-info", "care", "customer-care"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 text-gray-500 ${
              activeTab === tab ? "text-black font-semibold border-b-2 border-black" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab
              .replace("-", " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "description" && (
          <div className="p-4 border rounded">
            <div className="text-gray-600">
              <div dangerouslySetInnerHTML={{ __html: productDetailsHTML }} />
            </div>
          </div>
        )}

        {activeTab === "more-info" && (
          <div className="p-4 border rounded">
            <table className="w-full border">
              <tbody>
                {
                  brand && (
                    <tr className="border-b">
                      <td className="p-2 font-semibold">Brand</td>
                      <td className="p-2">{brand}</td>
                    </tr>
                  )
                }
                <tr className="border-b">
                  <td className="p-2 font-semibold">Manufacturer</td>
                  <td className="p-2">Rupa Corporate</td>
                </tr>
                {
                  product.productType && (
                    <tr className="border-b">
                      <td className="p-2 font-semibold">Type</td>
                      <td className="p-2">{product.productType}</td>
                    </tr>
                  )
                }
                {
                  genderLables.length > 0 && (
                    <tr className="border-b">
                      <td className="p-2 font-semibold">Gender</td>
                      <td className="p-2">{ genderLables.join(", ") }</td>
                    </tr>
                  )
                }
                {
                  age_group && age_group != "undefined" && (
                    <tr>
                      <td className="p-2 font-semibold">Age Group</td>
                      <td className="p-2">{age_group}</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "care" && (
          <div className="p-4 border rounded">
            <div className="text-gray-600">
              <div dangerouslySetInnerHTML={{ __html: productCareHTML }} />
            </div>
          </div>
        )}

        {activeTab === "customer-care" && (
          <div className="p-4 border rounded">
            <div className="text-gray-600">
            <p><strong>Customer care details :</strong></p>
            <p>E-Mail : <a href="mailto:customer.care@rupa.co.in" title="mailto:customer.care@rupa.co.in">customer.care@rupa.co.in</a></p>
            <p>SMS RUPA to 53456 or Call Toll Free No. <a href="tel:18001235001" title="tel:18001235001">1800 1235 001</a></p>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}