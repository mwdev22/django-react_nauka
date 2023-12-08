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




// pobieranie atrybutów użytkownika, listę jego aukcji oraz listę transakcji
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
      // przypisywanie atrybutów elementom state, aby można było z nich wygodnie korzystać w komponencie
      Promise.all(requests)
        .then(([profileResponse, transactionsResponse, salesResponse]) => {

          setProfile(profileResponse.data);
          setTransactions(transactionsResponse.data);
          setSales(salesResponse.data)
        })
        .catch((error) => {
          console.error('Error while fetching data', error);
          console.log(error.request.response.data)
        });
    }else{
      console.log('you are not logged in')
    }
  }, [user_id, authTokens]);
  
// funkcja umożliwiająca edycję
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  // zapisywanie edytowanego profilu do bazy danych
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
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error while saving user profile', error);
        console.log(error.response.data)
      });
  };

  // aktualizowanie edytowanego profilu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setNewProfilePicture(file);
    setEditedProfile({ ...editedProfile, img: file }); 
  };

  return (
    <div>
      <main className="main-detail">
        {isEditing ? (
          <div className='edit-box'>
            <div className='e-form'>
            <label htmlFor='username'>Username:</label>
            <input
              type="text"
              name="username"
              value={editedProfile.username}
              onChange={handleInputChange}
            />
            <label htmlFor='bio'>Bio:</label>
            <textarea
              name="bio"
              value={editedProfile.bio}
              onChange={handleInputChange}
            />
            <label htmlFor='img'></label>
             <input
              type="file"
              name="img"
              onChange={handlePictureChange}
            />
            <button onClick={handleSaveClick}>Save</button>
            </div>
          </div>
        ) : (
          <div className='detail-box'>
            <div className='d-col'>
              <img src={profile.img} alt={profile.username} id="prof-img" style={{margin: '3rem'}} />
              <h2 style={{fontSize:'3rem', fontWeight: '700', marginTop: '2rem'}}>{profile.username}</h2>
              <p style={{height:'fit-content', fontSize: '2rem', marginBottom: '4rem'}}>{profile.bio}</p>
              <button className='e-btn' onClick={handleEditClick}>Edit</button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', height:'inherit'}}>
              <span style={{textAlign: 'center', fontSize: '4rem', fontWeight: '600', margin: '3rem'}}>Your sales</span>
            <div className='items-col'>
            {sales.map((sale, index) => (
                 <Link className='s-item' to={`/sale_detail/${sale.id}`} key={index} style={{ backgroundImage: `url(${sale.img})`}}>
                  </Link>
                ))}
            </div>
            </div>
          </div>
        )}
      </main>

      <section className='trs-sect'>
              <p style={{textAlign:'center', fontSize: '3rem', fontWeight:'800'}}>Your Transactions</p>

      {transactions.map((transaction, index) => (
                (transaction.seller.id===user_id) ? (
                 <Link to={`/transaction/${transaction.id}`} key={index}>
                  
                  <div className='trs-card' style={{ backgroundColor: 'rgb(139, 186, 208)' }}>
                      <img src={transaction.sale.img} height={400} width={250} alt={transaction.sale.name} />  
                        <h5>{transaction.sale.name}</h5>
                        <h5>{new Date(transaction.transaction_date).toLocaleString()}</h5>
                  </div>
                  </Link>
                  ) : (<Link to={`/transaction/${transaction.id}`} key={index} className=''>
                  <div className='trs-card' style={{ backgroundColor: 'rgb(104, 194, 111)' }}>
                      <img src={transaction.sale.img} height={400} width={250} alt={transaction.sale.name} />  
                        <h5>{transaction.sale.name}</h5>
                        <h5>{new Date(transaction.transaction_date).toLocaleString()}</h5>
                  </div>
                  </Link>)
                ))}
      </section>
    </div>
  );
};
