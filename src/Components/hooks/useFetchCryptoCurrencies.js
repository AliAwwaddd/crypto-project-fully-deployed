import { useState } from 'react';
import axios from 'axios';

function useFetchCurrencies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async ({ dispatch }) => {
    try {
      setLoading(true);

      const response = await axios.get(
        'https://crypto-project-for-wits-lb.onrender.com/api/cryptos'
      );
      console.log(response.data.data.cryptos);
      setData(response.data.data.cryptos);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      dispatch({ type: 'dataReceived' });
    }
  };

  return { data, loading, error, fetchData };
}

export default useFetchCurrencies;
