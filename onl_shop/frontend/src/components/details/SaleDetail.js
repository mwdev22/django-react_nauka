import React, { useContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import AuthContext from '../../auth/AuthContext';
import swal from 'sweetalert2';

const SaleDetail = () => {

  // pobieranie parametrów i inicjalizowanie obiektów
  const id = useParams().id;
  const { authTokens } = useContext(AuthContext);
  const [sale, setSale] = useState({});
  const [seller_id, setSellerID] = useState(0)
  const token = localStorage.getItem("authTokens");
  let user_id = 0;
  
  if (token) {
    const decoded = jwt_decode(token);
    user_id = decoded.user_id;
  }

  const navigate = useNavigate(); 

  // pobieranie atrybutów sale
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/sales/sale_detail/${id}`)
      .then((response) => {
        setSale(response.data);
        console.log(response.data);
        console.log(user_id)
        setSellerID(response.data.seller.id)
      })
      .catch((error) => {
        console.log('error getting sales', error);
      });
  }, [id,user_id]);

  // tworzenie transakcji w przypadku zakupu
  const doTransaction = () => {
    axios
      .post('http://127.0.0.1:8000/api/sales/new_transaction', {
        sale: sale.id,
        price: sale.price,
        seller: sale.seller,
      }, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        swal.fire({
          title: "Successful bought item!",
          icon: "success",
          toast: true,
          timer: 6000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
        });
        navigate('/');
      })
      .catch((error) => {
        console.error('Failed to buy an item', error);
        console.log(error.response.data)
      });
  };


// możliwość usunięcia sale, gdy właścicielem aukcji jest użytkownik
  const deleteSale = () => {
    axios.delete(`http://127.0.0.1:8000/api/sales/sale_delete/${id}`, {
      headers: {
        Authorization: `Bearer ${authTokens.access}`,
      },
    }).then( (response) => {
      console.log(response.data)
      swal.fire({
        title: "Successful deleted sale!",
        icon: "success",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      });
      navigate('/')
    }).catch((error) => {
      console.error('error while deleting sale', error)
    })
  }

  return (
    <div className='contt'>
      <div className='sale-cnt'>
        <div className="sale-img" style={{backgroundImage: `url(${sale.img})`}}>
        </div>

        <section className="sale-info">
          <h1 style={{fontSize: '4rem'}}>{sale.name}</h1>
          <p style={{fontSize: '3rem'}}>COST: {sale.price}$</p>
          <p style={{fontSize: '1.8rem'}}>{sale.description}</p>
          {user_id ? (
              user_id === seller_id ? (
                <button id='delete-btn' className='s-bb' onClick={deleteSale}>
                  DELETE SALE
                </button>
              ) : (
                <div className='actions-d'>
                  <Link className='l-act' to={`/seller/${seller_id}`}>View Seller</Link>
                  <button id='submit-btn' className='s-bb' onClick={doTransaction}>
                    BUY NOW
                  </button>
                </div>
              )
            ) : (
              <Link to={`/login`}>Login to buy item!</Link>
            )}
        </section>
      </div>
    </div>
  );
};


export default SaleDetail;
