import { useState } from 'react';
import axios from 'axios';

function useConvert() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (cryptocurrency, currency) => {
    try {
      // console.log({ cryptocurrency, currency });
      setLoading(true);
      const response = await axios.post(
        'https://crypto-project-for-wits-lb.onrender.com/api/cryptos/convert',
        {
          cryptocurrency,
          currency,
        }
      );
      // console.log(response.data.data);
      // setData(response.data.data.price);
      return response.data.data.price;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchData };
}

export default useConvert;
