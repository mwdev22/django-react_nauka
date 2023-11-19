import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../auth/AuthContext';

export const ViewSeller = () => {
  const sellerID = useParams().id;

  const { authTokens } = useContext(AuthContext);
  const [seller, setSeller] = useState({});
  const [sales, setSales] = useState([]);
  

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/accounts/profile_detail/${sellerID}`,{
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setSeller(response.data);
      })
      .catch((error) => {
        console.error('Error while creating seller', error);
      });

    axios
      .get(`http://127.0.0.1:8000/api/sales/seller_sales/${sellerID}`,{
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setSales(response.data);
      })
      .catch((error) => {
        console.error('error while getting sales', error);
      });
  }, [sellerID]);

  return (
    <div>
      <section className='main-detail'>
        <div className='detail-box'>
          <div className='d-col'>
            <img src={seller.img} alt={seller.username} id="prof-img" style={{margin: '3rem'}} />
              <h2 style={{fontSize:'3rem', fontWeight: '700', marginTop: '2rem', marginBottom: '4rem'}}>{seller.username}</h2>
              <p style={{height:'fit-content', fontSize: '2rem', marginBottom: '4rem'}}>{seller.bio}</p>
          </div>
          <div className='items-col'>
          <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
              <span style={{textAlign: 'center', fontSize: '4rem', fontWeight: '600'}}>User Sales</span>
            <div className='items-col'>
            {sales.map((sale, index) => (
                 <Link className='s-item' to={`/sale_detail/${sale.id}`} key={index} style={{ backgroundImage: `url(${sale.img})`,
                 backgroundRepeat: 'no-repeat',
                 backgroundSize: 'contain',
                 backgroundPosition: 'center center', }}>
                  </Link>
                ))}
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
