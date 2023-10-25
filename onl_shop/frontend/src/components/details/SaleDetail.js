import React from 'react'

const SaleDetail = () => {

  const { authTokens } = useContext(AuthContext);

  const [sales, setSales] = useState([]);

  useEffect(() => {
     
      axios.get("http://127.0.0.1:8000/api/sales/sale_detail/",)
      .then((response) => {
              setSales(response.data);
          })
          .catch((error) => {
              console.error('error while getting sales', error);
          });
  }, []);


  return (
    <div>SaleDetail</div>
  )
}

export default SaleDetail