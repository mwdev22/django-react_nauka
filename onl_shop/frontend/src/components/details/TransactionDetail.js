import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../../auth/AuthContext'


export const TransactionDetail = () => {

  const [transaction, setTransaction] = useState({})

  const transID = useParams().id

  const { authTokens } = useContext(AuthContext)

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/sales/transaction_detail/${transID}`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setTransaction(response.data);
      })
      .catch((error) => {
        console.error('error while getting transaction', error);
        console.log(error.respone)
      });
  }, [transID]); 
  

  return (
    <div>TransactionDetail</div>
  )
}
