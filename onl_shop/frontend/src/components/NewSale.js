import React from 'react'
import { useEffect, useState, useContext } from 'react'
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
      
        })
        .catch((error) => {
          console.error('Error while creating sale', error);
      
        });
    
      };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile({ ...editedProfile, [name]: value });
      };
    
      const handlePictureChange = (e) => {
        const file = e.target.files[0];
        setNewProfilePicture(file);
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
              onChange={handlePictureChange}
            />
            <button onClick={handleSaveClick}>Save</button>
          </div>
          <div>
          </div>
      </section>

    </div>
  )
}
