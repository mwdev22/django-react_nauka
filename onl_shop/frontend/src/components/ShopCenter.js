import {useState, useEffect, useContext} from 'react'
import AuthContext from '../auth/AuthContext'
import axios from 'axios'
import { Link } from 'react-router-dom'

function ShopCenter() {
    const { authTokens } = useContext(AuthContext);

    const [sales, setSales] = useState([]);

// pobieranie aukcji z api
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
      <div className="container">
      <aside className="filters">
        <h1>Filters</h1>
        <h3>Categories:</h3>
        
        <h3>Price: </h3>
        <input type="range" name="" id=""/>
      </aside>

      <section className="sale-list">
      {/* listowanie wszystkich aukcji przy pomocy map */}

      {sales.map((sale, index) => (
                 <Link to={`/sale_detail/${sale.id}`} key={index}>
                  <div className='card'>
                    <div className="card-body">
                      <img src={sale.img} height={400} width={250} />
                        <h5 className="card-title">{sale.name}</h5>
                        <p className="card-text">{sale.description}</p>
                        <p className="card-text">Price: {sale.price}</p>
                        <p className="card-text">Price: {sale.seller}</p>
                    </div>
                  </div>
                  </Link>
        ))}
      </section>
      </div>
    </div>
  )
}

export default ShopCenter