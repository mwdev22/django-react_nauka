import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuthContext from '../../auth/AuthContext';

const SaleDetail = () => {
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [sale, setSale] = useState({}); // Początkowa wartość to pusty obiekt

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/sales/sale_detail/${id}`)
      .then((response) => {
        setSale(response.data); // Zaktualizuj stan komponentu
        console.log(response.data)
      })
      .catch((error) => {
        console.log(sale, error)
      });
  }, [id]);


  return (
    <div>
      <div className='container'>
        <section className="sale-desc">
        <img src={sale.img} alt="" srcset="" />
        <p>{sale.description}</p>
        </section>

        <section className="sale-info">
          <h1>{sale.name}</h1>
          <p>{sale.price}</p>


        </section>
      </div>
     
    </div>
  );
};

export default SaleDetail;
