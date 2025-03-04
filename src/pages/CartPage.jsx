import React from 'react';
import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cart, cartCount, checkoutUrl, loading, updateQuantity, removeFromCart } = useCart();

  const subtotal = cart.reduce((total, item) => {
    return total + parseFloat(item.price) * item.quantity;
  }, 0);

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-0">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900">
            Your cart is empty
          </h1>
          <p className="mt-2 text-base text-gray-500">
            You haven't added any items to your cart yet.
          </p>
          <div className="mt-6">
            <Link
              to="/collections"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8 2xl:max-w-full 2xl:px-[5%]">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        Shopping Cart
      </h1>
      <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <h2 id="cart-heading" className="sr-only">
            Items in your shopping cart
          </h2>

          <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.id} className="py-6 flex">
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 rounded-md object-center object-cover sm:w-32 sm:h-32"
                  />
                </div>

                <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                  <div>
                    <div className="flex justify-between">
                      <h4 className="text-sm">
                        <Link
                          to={`/products/${item.handle}`}
                          className="font-medium text-gray-700 hover:text-gray-800"
                        >
                          {item.title}
                        </Link>
                      </h4>
                      <p className="ml-4 text-sm font-medium text-gray-900">
                        {formatter.format(parseFloat(item.price) * item.quantity)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatter.format(parseFloat(item.price))} each
                    </p>
                  </div>

                  <div className="mt-4 flex-1 flex items-end justify-between">
                    <div className="flex items-center">
                      <label htmlFor={`quantity-${item.id}`} className="sr-only">
                        Quantity, {item.quantity}
                      </label>
                      <select
                        id={`quantity-${item.id}`}
                        name={`quantity-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="summary-heading"
          className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
        >
          <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
            Order summary
          </h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">{formatter.format(subtotal)}</dd>
            </div>
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <dt className="text-base font-medium text-gray-900">Order total</dt>
              <dd className="text-base font-medium text-gray-900">{formatter.format(subtotal)}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-red-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Checkout
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
