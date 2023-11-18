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
      <div className="container">
      <section className="sale-list">
  {sales.map((sale, index) => (
    <div key={index}>
      {console.log(sale)} {/* Log the sale object to the console for debugging */}
      <Link to={`/sale_detail/${sale.id}`}>
        <div className='card'>
          <div className="card-body">
            <img src={sale.img} height={400} width={250} alt={sale.name} />
            <h5 className="card-title">{sale.name}</h5>
            <p className="card-text">{sale.description}</p>
            <p className="card-text">Price: {sale.price}</p>
            <p className="card-text">Seller: {sale.seller.username}</p>
          </div>
        </div>
      </Link>
    </div>
  ))}
</section>
      </div>
    </div>
  )
}

export default ShopCenter