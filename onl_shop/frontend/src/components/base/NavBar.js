import { useContext, useState } from 'react';
import jwt_decode from "jwt-decode";
import AuthContext from '../../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  // autoryzacja przy użyciu kontekstu
  const [searchInput, setSearchInput] = useState('');
  const { user, logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");
  let user_id = 0;

  // dekodowanie tokenu jeśli user jset zalogowany
  if (token) {
    const decoded = jwt_decode(token);
    user_id = decoded.user_id;
  }
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const navigate = useNavigate()

  const handleSearchButtonClick = () => {
    navigate(`/shop_center?search=${searchInput}`);
  };
  
  return (
    <div>
      <nav id='navb' className="navbar navbar-expand-lg sticky-top bg-dark">
        <div className="container-fluid nawigacja">
          <a className="navbar-brand" href="#">
            <img style={{ width: "120px", padding: "6px" }} src="" alt="" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">Home</a>
              </li>
              {token === null &&
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>

                </>
              }

              {token !== null &&
                <>
                  <li className="nav-item">
                    <Link className='nav-link' to={`/profile/${user_id}`}>Profile</Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }}>Logout</a>
                  </li>

                  <li className="nav-item">
                    <Link className='nav-link' to={`/new_sale`}>Sell item</Link>
                  </li>
                  
                </>
              }

              <li>
                <div id='search'>
                    <input type="search" id="nav-search" onChange={handleSearchInputChange} />
                    <button id="search-submit" type="submit" onClick={handleSearchButtonClick}>Search item</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
