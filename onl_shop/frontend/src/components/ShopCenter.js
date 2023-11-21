import {useState, useEffect, useContext} from 'react'
import AuthContext from '../auth/AuthContext'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom'

function ShopCenter() {
    const { authTokens } = useContext(AuthContext);

    const [sales, setSales] = useState([]);

    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('search'); // pobieranie parametrów filtrowania

// pobieranie wszystkich aukcji z api, uwzględniając filtry
    useEffect(() => {
        if (searchQuery){
          console.log(searchQuery)
        }
        axios.get(`http://127.0.0.1:8000/api/sales/list?search=${searchQuery}`)
        .then((response) => {
                console.log(response.data)
                setSales(response.data);
            })
            .catch((error) => {
                console.error('error while getting sales', error);
            });
    }, [searchQuery]);

  return (
    <div>
      
      <section className="sale-list">
  {sales.map((sale, index) => (
    <div key={index} style={{height: '40vh'}}>
      <Link to={`/sale_detail/${sale.id}`} style={{textDecoration: 'none', fontSize:'1.4rem', color:'black'}}>
        <div className='sale-card'>
          <div className="img-dv" style={{background: `url(${sale.img}) no-repeat center center`}}> 
          </div>
          <div className='sale-desc'>
            <h5 style={{fontSize: '3rem', color:'black'}}>{sale.name}</h5>
            <p className="card-text">Price: {sale.price}</p>
            <p className="card-text">Seller: {sale.seller.username}</p>
          </div>
        </div>
      </Link>
    </div>
  ))}
      </section>
      </div>

  )
}

export default ShopCenter