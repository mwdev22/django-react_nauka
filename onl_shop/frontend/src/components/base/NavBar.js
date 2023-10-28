import { useContext } from 'react';
import jwt_decode from "jwt-decode";
import AuthContext from '../../auth/AuthContext';
import { Link } from 'react-router-dom';

function Navbar() {
  // Authorization using context
  const { user, logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");
  let user_id = 0;

  // dekodowanie tokenu jeśli user jset zalogowany
  if (token) {
    const decoded = jwt_decode(token);
    user_id = decoded.user_id;
  }
  
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
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

                  <li>
                    <div id='search'>
                      <input type="search" id="nav-search" />
                      <button id="search-submit" type="submit"></button>
                    </div>
                  </li>
                </>
              }

              {token !== null &&
                <>
                  <li className="nav-item">
                    <Link to={`/profile/${user_id}`}>Profile</Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }}>Logout</a>
                  </li>
                </>
              }
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
