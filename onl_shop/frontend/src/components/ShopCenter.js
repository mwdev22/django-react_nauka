import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../auth/AuthContext';
import axios from 'axios';

function ShopCenter() {
  const { authTokens } = useContext(AuthContext);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search');

  useEffect(() => {
    setLoading(true);

    axios
      .get(`http://127.0.0.1:8000/api/sales/list?search=${searchQuery}`)
      .then((response) => {
        setSales(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error while getting sales', error);
        setLoading(false);
      });
  }, [searchQuery]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <section className="sale-list">
          {sales.map((sale, index) => (
            <Link key={index} to={`/sale_detail/${sale.id}`} className="sale-link">
              <div className="sale-card">
                <div className="img-dv" style={{ background: `url(${sale.img}) no-repeat center`,
              backgroundSize: 'cover',
              backgroundPosition: '50% 50%'}} />
                <div className="sale-desc">
                  <h5>{sale.name}</h5>
                  <p>Price: {sale.price}</p>
                  <p>Seller: {sale.seller.username}</p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}

export default ShopCenter;
