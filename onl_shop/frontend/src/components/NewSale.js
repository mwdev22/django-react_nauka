import React, { useState, useContext } from 'react';
import AuthContext from '../auth/AuthContext';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const NewSale = () => {
  const [newSale, setNewSale] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    img: null,
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const { authTokens } = useContext(AuthContext);

  const navigate = useNavigate();

  const token = localStorage.getItem('authTokens');
  let user_id = 0;

  if (token) {
    const decoded = jwt_decode(token);
    user_id = decoded.user_id;
  }

  const handleSaveClick = () => {
    // form data umożliwia poprawne przesłanie pliku
    const formData = new FormData();
    formData.append('name', newSale.name);
    formData.append('description', newSale.description);
    formData.append('price', newSale.price);
    formData.append('category', newSale.category);
    formData.append('img', newSale.img);

    console.log(formData)
    axios
      .post('http://127.0.0.1:8000/api/sales/new_sale', formData, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error while creating sale', error);
        console.log(error.response.data);
      });
  };

  // przypisywanie atrybutów nowej aukcji
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSale({ ...newSale, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setSelectedCategory(value);
    setNewSale({ ...newSale, category: value });
  };

  const handleSalePicture = (e) => {
    const file = e.target.files[0];
    setNewSale({ ...newSale, img: file });
  };

  return (
    <div>
      <section className="main-detail">
        <div>
          <label htmlFor="name">Name:</label>
          <input name="name" onChange={handleInputChange} />
          <label htmlFor="description">Description:</label>
          <textarea name="description" onChange={handleInputChange} />
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            name="price"
            onChange={handleInputChange}
          />
          <label htmlFor="category">Category:</label>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Select a category</option>
            <option value="Clothes">Clothes</option>
            <option value="Electronics">Electronics</option>
            <option value="Food">Food</option>
          </select>
          <label htmlFor="img">Photo:</label>
          <input
            type="file"
            name="img"
            onChange={handleSalePicture}
          />
          <button onClick={handleSaveClick}>Add Sale!</button>
        </div>
        <div></div>
      </section>
    </div>
  );
};
