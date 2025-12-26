import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../api';
import Header from '../components/Header';

const Home = () => {
  const [quickProduct, setQuickProduct] = useState('');
  const [cart, setCart] = useState([]);

  const sampleProducts = [
    {
      id: 1,
      title: 'Organic Milk',
      price: '₹ 50',
      img: 'https://via.placeholder.com/160x120?text=Milk',
    },
    {
      id: 2,
      title: 'Brown Bread',
      price: '₹ 40',
      img: 'https://via.placeholder.com/160x120?text=Bread',
    },
    {
      id: 3,
      title: 'Salted Butter',
      price: '₹ 120',
      img: 'https://via.placeholder.com/160x120?text=Butter',
    },
    {
      id: 4,
      title: 'Cheddar Cheese',
      price: '₹ 220',
      img: 'https://via.placeholder.com/160x120?text=Cheese',
    },
  ];

  useEffect(() => {
    refreshCart();
  }, []);

  const quickAdd = async () => {
    if (!quickProduct) {
      alert('select');
      return;
    }
    const res = await apiPost('/cart/add', { product: quickProduct });
    alert(res.status === 'success' ? 'Added' : res.error || 'Failed');
    refreshCart();
    setQuickProduct('');
  };

  const refreshCart = async () => {
    const list = await apiGet('/cart');
    if (Array.isArray(list) && list.length) {
      setCart(list);
    } else {
      setCart([]);
    }
  };

  const addFromCard = async (product) => {
    await apiPost('/cart/add', { product });
    refreshCart();
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="card">
          <h3>Quick Add</h3>
          <p className="small">Choose a product and add to your cart instantly.</p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              className="input"
              style={{ flex: 1, marginTop: 0 }}
              value={quickProduct}
              onChange={(e) => setQuickProduct(e.target.value)}
            >
              <option value="">Select product...</option>
              <option>Milk</option>
              <option>Bread</option>
              <option>Butter</option>
              <option>Cheese</option>
              <option>Eggs</option>
              <option>Chocolate</option>
            </select>
            <button className="btn" onClick={quickAdd}>
              Add
            </button>
          </div>

          <div style={{ marginTop: '14px' }}>
            <button className="btn ghost" onClick={refreshCart}>
              Refresh Cart
            </button>
          </div>

          <div style={{ marginTop: '12px' }}>
            <h4>Your Cart</h4>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {cart.length > 0
                ? cart.map((x) => '• ' + x.product).join('\n')
                : 'Cart empty'}
            </pre>
          </div>
        </div>

        <div className="card">
          <h3>Featured Products</h3>
          <div className="grid">
            {sampleProducts.map((p) => (
              <div key={p.id} className="product">
                <img src={p.img} alt={p.title} />
                <h4>{p.title}</h4>
                <div className="small">{p.price}</div>
                <div style={{ marginTop: '10px' }}>
                  <button className="btn" onClick={() => addFromCard(p.title)}>
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
