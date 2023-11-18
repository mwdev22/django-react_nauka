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
    <div>
      <div className='main-detail'>
        <section className="sale-desc">
          <img id='sale-det-img' src={sale.img} alt="" srcSet="" />
          <p>{sale.description}</p>
        </section>

        <section className="sale-info">
          <h1>{sale.name}</h1>
          <p>{sale.price}</p>
          {user_id ? (
              user_id === seller_id ? (
                <button id='delete-btn' onClick={deleteSale}>
                  DELETE SALE
                </button>
              ) : (
                <div>
                  <Link to={`/seller/${seller_id}`}>View Seller</Link>
                  <button id='submit-btn' onClick={doTransaction}>
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
