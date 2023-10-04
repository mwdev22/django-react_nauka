import React from 'react'
import AuthContext from '../auth/AuthContext'
import useAxios from '../utils/useAxios'


const ProductDetail = () => {

  const {user, logoutUser} = useContext(AuthContext)
  const token = localStorage.getItem("authTokens")


//   dekodowanie tokenu, jeśli użytkownik jest zalogowany
  if (token){
    const decoded = jwt_decode(token) 
    var user_id = decoded.user_id
  }

  get_product = () => axios.get("http://127.0.0.1:8000/api/sales/")
  return (
    <div>ProductDetail</div>
  )
}

export default ProductDetail