import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../auth/AuthContext'

export const ViewSeller = () => {

    const sellerID = useParams().id

    const [seller, setSeller] = useState({})

    useEffect = () => {
        axios.
            get(`http://127.0.0.1:8000/api/sales/profile_detail/${sellerID}`)
            .then((response) => {
                console.log(response.data)
            })

    }

  return (
    <div>ViewSeller</div>
  )
}
