import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionPage from "./pages/CollectionPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <BrowserRouter>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/:handle" element={<CollectionPage />} />
              <Route path="/products/:handle" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </Layout>
        </CartProvider>
    </BrowserRouter>
  );
}

export default App;
