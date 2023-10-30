import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../auth/AuthContext';
import axios from 'axios';

export const ProfileDetail = () => {
  const [profile, setProfile] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [sales, setSales] = useState([]);

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
  
/*
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/accounts/profile_detail/${user_id}`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setProfile(response.data);
      })
      .catch((error) => {
        console.error('Error while getting user profile', error);
      });
  }, [user_id, authTokens]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/accounts/transactions_list', {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error while getting user transactions', error);
      });

  }, [authTokens])

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/accounts/user_sales', {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error while getting user sales', error);
      });

  }, [authTokens])
*/

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSaveClick = () => {

    axios.patch(`http://127.0.0.1:8000/api/accounts/profile_detail/${user_id}/`, editedProfile, {
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
      },
    })
    .then((response) => {
      setProfile(response.data);
      setIsEditing(false);
    })
    .catch((error) => {
      console.error('Error while saving user profile', error);
      setIsEditing(false);
    });

    setIsEditing(false);
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
        <img src={profile.img} alt={profile.username} />
        {isEditing ? (
          <div>
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
              <img id="detail-img" src={profile.img} />
              <h2>{profile.username}</h2>
              <p>{profile.bio}</p>
              <button onClick={handleEditClick}>Edit</button>
            </div>
            <div className='items-col'>
              
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
