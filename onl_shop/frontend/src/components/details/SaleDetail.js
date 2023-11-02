import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../auth/AuthContext';
import swal from 'sweetalert2';

const SaleDetail = () => {
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [sale, setSale] = useState({}); // Początkowa wartość to pusty obiekt

  let user_id = 0;
  // dekodowanie tokenu jeśli user jset zalogowany
  if (token) {
    const decoded = jwt_decode(token);
    user_id = decoded.user_id;
  }

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

  const doTransaction = () =>{
    console.log(sale)
    console.log(sale.price)
    console.log(sale.seller)
    console.log(user_id)
    axios.
      post(`http://127.0.0.1:8000/api/sales/new_transaction`, {
        'seller' : sale.seller,
        'buyer' : user_id,
        'price' : sale.price,
        'sale_id' : id
      }).then((response) => {
        console.log(response.data)
        useNavigate('/')
        swal.fire({
          title: "Succesfull bought item!",
          icon: "success",
          toast: true,
          timer: 6000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
      })
      }).catch((error) => {
        console.error('failed to buy an item', error)
      })
  }

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
          <button id='submit-btn' onClick={doTransaction}>
            BUY NOW
          </button>
        </section>
      </div>
     
    </div>
  );
};

export default SaleDetail;
