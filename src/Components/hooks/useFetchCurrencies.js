import { useState } from 'react';
import axios from 'axios';

function useFetchCryptoCurrencies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://crypto-project-for-wits-lb.onrender.com/api/cryptos/currencies'
      );
      console.log(response.data.data.currencies);
      setData(response.data.data.currencies);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
}

export default useFetchCryptoCurrencies;
