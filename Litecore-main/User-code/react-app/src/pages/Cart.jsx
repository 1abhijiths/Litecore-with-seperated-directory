import React, { useState, useEffect } from 'react';
import { apiGet, apiDelete } from '../api';
import Header from '../components/Header';
import { useSearchParams } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [removeName, setRemoveName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  // --------------------------------------------------
  // Load cart on page load
  // --------------------------------------------------
  useEffect(() => {
    loadCart();
  }, []);

  // --------------------------------------------------
  // Auto search if URL has ?q=
  // --------------------------------------------------
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      searchItem(q);
    }
  }, [searchParams]);

  const loadCart = async () => {
    const data = await apiGet('/cart');
    setCartItems(Array.isArray(data) ? data : []);
  };

  // --------------------------------------------------
  // SEARCH ITEM (updates URL)
  // --------------------------------------------------
  const searchItem = async (overrideQuery) => {
    const query = (overrideQuery ?? searchQuery).trim();

    if (!query) {
      alert('enter search query');
      return;
    }

    // ✅ Update URL
    setSearchParams({ q: query });

    setIsSearching(true);
    try {
      const data = await apiGet(`/cart/search?q=${encodeURIComponent(query)}`);
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // --------------------------------------------------
  // CLEAR SEARCH (clears URL)
  // --------------------------------------------------
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchParams({});
  };

  // --------------------------------------------------
  // REMOVE BY INPUT BOX
  // --------------------------------------------------
  const removeItem = async () => {
    const name = removeName.trim();
    if (!name) {
      alert('enter product name');
      return;
    }

    const res = await apiDelete('/cart/remove', { product: name });
    if (res.status === 'success') {
      loadCart();
      setRemoveName('');
      clearSearch();
    } else {
      alert(res.error || 'Failed to remove');
    }
  };

  // --------------------------------------------------
  // REMOVE FROM LIST
  // --------------------------------------------------
  const removeItemFromList = async (product) => {
    const res = await apiDelete('/cart/remove', { product });
    if (res.status === 'success') {
      loadCart();
      clearSearch();
    } else {
      alert(res.error || 'Failed to remove');
    }
  };

  return (
    <>
      <Header />
      <div className="container">

        {/* SEARCH */}
        <div className="card">
          <h3>Search Items</h3>
          <p className="small">
            Find items in your cart by name or partial match.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="input"
              placeholder="Search for item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />

            <button
              className="btn"
              onClick={() => searchItem()}
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>

            {searchQuery && (
              <button className="btn ghost" onClick={clearSearch}>
                Clear
              </button>
            )}
          </div>

          {/* SEARCH RESULTS */}
          {searchResults.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h4>Search Results</h4>
              <ul className="cart-list">
                {searchResults.map((item, idx) => (
                  <li key={idx}>
                    <span>{item.product}</span>
                    <button
                      className="btn ghost"
                      onClick={() => removeItemFromList(item.product)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CART */}
        <div className="card">
          <h3>Your Cart</h3>
          <ul className="cart-list">
            {cartItems.length === 0 ? (
              <li>Your cart is empty.</li>
            ) : (
              cartItems.map((item, idx) => (
                <li key={idx}>
                  <span>{item.product}</span>
                  <button
                    className="btn ghost"
                    onClick={() => removeItemFromList(item.product)}
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>

          {/* REMOVE BY NAME */}
          <div style={{ marginTop: '16px' }}>
            <h4>Remove by Name</h4>
            <input
              type="text"
              className="input"
              placeholder="Product name"
              value={removeName}
              onChange={(e) => setRemoveName(e.target.value)}
            />
            <button className="btn" onClick={removeItem}>
              Remove
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
