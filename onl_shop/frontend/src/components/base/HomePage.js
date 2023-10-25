import {useState, useEffect} from 'react'
import useAxios from "../../utils/useAxios"
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import AuthContext from '../../auth/AuthContext'
import { Link } from 'react-router-dom'

function HomePage() {
    const { authTokens } = useContext(AuthContext);

    const [sales, setSales] = useState([]);

    useEffect(() => {
       
        axios.get("http://127.0.0.1:8000/api/sales/list",)
        .then((response) => {
                setSales(response.data);
            })
            .catch((error) => {
                console.error('error while getting sales', error);
            });
    }, []);

  return (
    <div>
      {auctions.map((sale, index) => (
                 <Link to={`/sale_detail/${sale.id}`} key={index}>
                    <div className="card-body">
                        <h5 className="card-title">{sale.name}</h5>
                        <p className="card-text">{sale.description}</p>
                        <p className="card-text">Price: {sale.price}</p>
                        <p className="card-text">Price: {sale.seller}</p>
                    </div>
                  </Link>
        ))}

    </div>
  )
}

export default HomePage