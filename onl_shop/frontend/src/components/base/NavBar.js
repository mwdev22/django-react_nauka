import { useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import AuthContext from '../../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [searchInput, setSearchInput] = useState('');
  const { user, logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem('authTokens');
  let user_id = 0;

  if (token) {
    const decoded = jwt_decode(token);
    user_id = decoded.user_id;
  }

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const navigate = useNavigate();

  const handleSearchButtonClick = () => {
    navigate(`/shop_center?search=${searchInput}`);
    closeMenu();
  };

  const openMenu = () => {
    document.getElementById('resp-menu').style.width = '100%';
    document.getElementById('closeX').style.display = 'block';
    document.getElementById('ft').style.display = 'none';
  };

  const closeMenu = () => {
    document.getElementById('resp-menu').style.width = '0%';
    document.getElementById('closeX').style.display = 'none';
    document.getElementById('ft').style.display = 'flex';
    
    
  };

  

  return (
    <div>
      <div id="resp-menu">
        <a href="#" id="closeX" onClick={closeMenu}>
          &times;
        </a>
        <ul>
          <li>
            <a onClick={closeMenu} href="/">
              Home
            </a>
          </li>
          {token === null && (
            <>
              <li>
                <Link to="/login" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMenu}>
                  Register
                </Link>
              </li>
            </>
          )}
          {token !== null && (
            <>
              <li>
                <Link to={`/profile/${user_id}`} onClick={closeMenu}>
                  Profile
                </Link>
              </li>
              <li>
                <a onClick={logoutUser} style={{ cursor: 'pointer' }}>
                  Logout
                </a>
              </li>
              <li>
                <Link to={`/new_sale`} onClick={closeMenu}>
                  Sell item
                </Link>
              </li>
              <li id="search">
              <input type="search" id="nav-search" onChange={handleSearchInputChange} />
              <button id="search-submit" type="submit" onClick={handleSearchButtonClick}>
                Search item
              </button>
            </li>
            </>
          )}
        </ul>
      </div>

      <span id="burger" onClick={openMenu}>
        &#9776;
      </span>

      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          {token === null && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
          {token !== null && (
            <>
              <li>
                <Link to={`/profile/${user_id}`}>Profile</Link>
              </li>
              <li>
                <a onClick={logoutUser} style={{ cursor: 'pointer' }}>
                  Logout
                </a>
              </li>
              <li>
                <Link to={`/new_sale`}>Sell item</Link>
              </li>
            </>
          )}
          <li id="search">
            <input type="search" id="nav-search" onChange={handleSearchInputChange} />
            <button id="search-submit" type="submit" onClick={handleSearchButtonClick}>
              Search item
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
