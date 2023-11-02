import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../auth/AuthContext'

export const NewSale = () => {

    const [newSale, setNewSale] = useState({})
    const {authTokens} = useContext(AuthContext)

    let user_id = 0;

    if (token) {
        const decoded = jwt_decode(authTokens);
        user_id = decoded.user_id;
    }

    const handleSaveClick = () => {

        axios.post("http://127.0.0.1:8000/api/sales/new_sale", newSale, {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        })
        .then((response) => {
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error while creating sale', error);
        });
    
      };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSale({ ...newSale, [name]: value });
      };
    
      const handleSalePicture = (e) => {
        const file = e.target.files[0];
        setNewSale({ ...newSale, 'file' : file });
      };
    

  return (
    <div>
        <section className="main-detail">
          <div>
            <input
              name="name"
              value="Name..."
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              value="Description..."
              onChange={handleInputChange}
            />
            <input 
            type="number" 
            name="price" 
            value="00.00" 
            />
             <input
              type="file"
              name="img"
              onChange={handleSalePicture}
            />
            <button onClick={handleSaveClick}>Add Sale!</button>
          </div>
          <div>
          </div>
      </section>

    </div>
  )
}
