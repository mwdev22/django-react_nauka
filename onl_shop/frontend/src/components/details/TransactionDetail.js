import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../auth/AuthContext';
import jwtDecode from 'jwt-decode';

export const TransactionDetail = () => {
  const [transaction, setTransaction] = useState({});
  const transID = useParams().id;
  const { authTokens } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");
  let user_id = 0
  
  if(token){
    const decoded = jwtDecode(token)
    user_id = decoded.user_id;
  }

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/sales/transaction_detail/${transID}`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      })
      .then((response) => {
        console.log("Transaction data:", response.data);
        setTransaction(response.data);
      })
      .catch((error) => {
        console.error('Error while getting transaction', error);
        console.log(error.response);
      });
  }, [transID, authTokens]);

  return (
    <div>
      <main className='main-detail trs-m'>
        <section className='user-i'>
          <h1>
            Sold by{' '}
            <Link to={transaction.seller?.id === user_id ? (`/profile/${user_id}`) : (`/seller/${transaction.seller?.id}`)}>
      {transaction.seller?.username}
    </Link>
          </h1>
        </section>
        <section className='sale-s'>
          <img src={transaction.sale?.img} width={250} height={250} alt={transaction.sale?.name} />
          <p style={{margin: '3rem', fontSize:'2rem'}}><strong>Transaction date:</strong> {new Date(transaction.transaction_date).toLocaleString()}</p>
          <p style={{fontSize:'2rem'}}>Price: {transaction.sale?.price}$</p>
        </section>
        <section className='user-i'>
  <h1>
    Bought by{' '}
    <Link to={transaction.buyer?.id === user_id ? (`/profile/${user_id}`) : (`/seller/${transaction.buyer?.id}`)}>
      {transaction.buyer?.username}
    </Link>
  </h1>
</section>
      </main>
    </div>
  );
};
