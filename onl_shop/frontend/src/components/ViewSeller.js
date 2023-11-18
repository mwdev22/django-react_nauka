import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'

export const ViewSeller = () => {

    const sellerID = useParams().id

    const [seller, setSeller] = useState({})
    const [sales, setSales] = useState([])

    useEffect = () => {
        axios.
            get(`http://127.0.0.1:8000/api/accounts/profile_detail/${sellerID}`)
            .then((response) => {
                console.log(response.data)
                setSeller(response.data)
            }).catch((error) => {
              console.error('Error while creating seller', error);
            });
      
        axios.
            get(`http://127.0.0.1:8000/api/sales
            /user_sales`)
            .then((response) => {
              console.log(response.data)
              setSales(response.data)
            }).catch((error) => {
              console.error('error while getting sales', error)
            })
    }

  return (
    <div>
      <section className='main-detail'>
      <div className='detail-box'>
            <div className='d-col'>
              <img id="detail-img" src={seller.img} />
              <h2>{seller.username}</h2>
              <p>{seller.bio}</p>
            </div>
            <div className='items-col'>
            {sales.map((sale, index) => (
                 <Link to={`/sale_detail/${sale.id}`} key={index}>
                  <div className='card'>
                    <div className="card-body">
                      <img src={sale.img} height={400} width={250} />
                        <h5 className="card-title">{sale.name}</h5>
                    </div>
                  </div>
                  </Link>
                ))}
            </div>
          </div>
      </section>
    </div>
  )
}
