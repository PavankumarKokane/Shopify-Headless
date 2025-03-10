# Shopify Headless Store

This is a headless Shopify store built using **React + Vite** for a fast and modern eCommerce experience. The store uses **GraphQL API** to fetch data from Shopify and provides a seamless shopping experience with **Tailwind CSS** for styling.

## 🚀 Features

- **Headless Shopify Store** powered by React and Vite
- **GraphQL API** integration using `graphql-request`
- **Tailwind CSS** for styling
- **Context API** for state management
- **React Slick + Slick Carousel** for banner slider
- **Fully functional eCommerce pages** including home, product, search, cart, and collections

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **State Management**: Context API (CartContext)
- **Styling**: Tailwind CSS
- **Data Fetching**: `graphql-request`
- **Slider**: `react-slick` + `slick-carousel`

## 📂 Project Structure

```
├── src
│   ├── components       # Reusable components
│   ├── context          # CartContext for state management
│   ├── lib              # Shopify API functions
│   ├── pages            # Pages (Home, Product, Search, Cart, etc.)
│   ├── App.js           # Main App component
│   ├── main.jsx         # Entry file
│   ├── index.css        # Global styles
│   ├── router.js        # React Router configuration
│
├── public               # Static assets
├── .gitignore           # Git ignore file
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md            # Project documentation
```

## 📦 Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/PavankumarKokane/Shopify-Headless.git
   ```
2. Navigate to the project folder:
   ```sh
   cd shopify-headless-store
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file and add your Shopify Storefront API credentials:
   ```env
   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-access-token
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## 📌 Shopify API Integration

The API functions are located in `lib/shopify.js` and include:

- `searchProducts(query)` - Search for products
- `getFeaturedProducts()` - Fetch featured products
- `getCollections()` - Fetch all collections
- `getProductsByCollection(collectionHandle)` - Get products by collection
- `getProductByHandle(handle)` - Get product details
- `createCheckout()` - Create a checkout session
- `updateCheckout(checkoutId, lineItems)` - Update cart items

## 📜 Pages Implemented

- **Home Page** - Displays featured products and a banner slider
- **Product Page** - Shows product details with `getProductByHandle`
- **Search Page** - Allows searching for products
- **Cart Page** - Manages cart items and checkout
- **Collection Listing Page** - Lists all collections
- **Collection Detail Page** - Displays products in a selected collection

## 🎨 Styling with Tailwind CSS

All components and pages are styled using **Tailwind CSS**, ensuring a clean and responsive design.

## 🛒 State Management

The cart is managed using **React Context API** (`CartContext.js`), which allows easy addition, removal, and updating of cart items.

## 🖼️ Banner Section

The homepage features a banner slider using `react-slick` and `slick-carousel`.

## 🚀 Build for Production

To build the project for production, run:
```sh
npm run build
```