import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../api';
import Header from '../components/Header';

const Products = () => {
  const [products, setProducts] = useState([
    { title: 'Organic Milk', price: '₹50', img: 'images/milk.png' },
    { title: 'Brown Bread', price: '₹40', img: 'images/bread.png' },
    { title: 'Salted Butter', price: '₹120', img: 'images/butter.png' },
    { title: 'Eggs (6 pcs)', price: '₹60', img: 'images/eggs.png' },
    { title: 'Cheddar Cheese', price: '₹220', img: 'images/cheese.png' },
  ]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    // Products are already in state
  };

  const add = async (title) => {
    const res = await apiPost('/cart/add', { product: title });
    if (res.status === 'success') {
      alert('Added to cart');
    } else {
      alert(res.error || 'Error');
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="card">
          <h3>Products</h3>
          <div className="grid">
            {products.map((p, idx) => (
              <div key={idx} className="product">
                <img src={p.img} alt={p.title} />
                <h4>{p.title}</h4>
                <div className="small">{p.price}</div>
                <div style={{ marginTop: '10px' }}>
                  <button className="btn" onClick={() => add(p.title)}>
                    Add to Cart
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

export default Products;
