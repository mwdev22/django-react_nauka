import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../../auth/AuthContext';
import axios from 'axios';

export const ProfileDetail = () => {
  const [profile, setProfile] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [sales, setSales] = useState([]);

  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  const { authTokens } = useContext(AuthContext);
  const params = useParams();
  const user_id = parseInt(params.id, 10);

  useEffect(() => {
    if (authTokens) {
      const requests = [
        axios.get(`http://127.0.0.1:8000/api/accounts/profile_detail/${user_id}`, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }),
        axios.get('http://127.0.0.1:8000/api/sales/transactions_list', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }),
        axios.get('http://127.0.0.1:8000/api/sales/user_sales', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }),
      ];
      Promise.all(requests)
        .then(([profileResponse, transactionsResponse, salesResponse]) => {
          console.log(profileResponse.data);
          setProfile(profileResponse.data);
          console.log(transactionsResponse.data);
          setTransactions(transactionsResponse.data);
          console.log(salesResponse.data);
          setSales(salesResponse.data)
        })
        .catch((error) => {
          console.error('Error while fetching data', error);
        });
    }
  }, [user_id, authTokens]);
  

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSaveClick = () => {
    const formData = new FormData();
    formData.append('username', editedProfile.username);
    formData.append('bio', editedProfile.bio);
    if (newProfilePicture) {
      formData.append('img', newProfilePicture);
    }

    axios
      .patch(`http://127.0.0.1:8000/api/accounts/profile_detail/${user_id}/`, formData, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setProfile(response.data);
        console.log(response.data)
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error while saving user profile', error);
        console.log(error.response.data)
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setNewProfilePicture(file);
    setEditedProfile({ ...editedProfile, img: file }); // Use "img" as a string
    console.log(editedProfile.img);
  };

  return (
    <div>
      <main className="main-detail">
        {isEditing ? (
          <div className='edit-box'>
            <input
              type="text"
              name="username"
              value={editedProfile.username}
              onChange={handleInputChange}
            />
            <textarea
              name="bio"
              value={editedProfile.bio}
              onChange={handleInputChange}
            />
             <input
              type="file"
              name="img"
              onChange={handlePictureChange}
            />
            <button onClick={handleSaveClick}>Save</button>
          </div>
        ) : (
          <div className='detail-box'>
            <div className='d-col'>
              <img src={profile.img} alt={profile.username} id="prof-img" />
              <h2>{profile.username}</h2>
              <p>{profile.bio}</p>
              <button onClick={handleEditClick}>Edit</button>
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
        )}
      </main>

      <section className='trs-sect'>
      {transactions.map((transaction, index) => (
                 <Link to={`/transaction/${transaction.id}`} key={index}>
                  <div className='trs-card'>
                      <img src={transaction.sale.img} height={400} width={250} alt={transaction.sale} />
                        <h5 className="card-title">{transaction.transaction_date}</h5>
                  </div>
                  </Link>
                ))}
      </section>
    </div>
  );
};
