import React, { useState, useEffect } from 'react';
import './index.css';
import useFetchCryptoCurrencies from '../hooks/useFetchCryptoCurrencies';
import useFetchCurrencies from '../hooks/useFetchCurrencies';
import useConvert from '../hooks/useConvert';

function CurrencyConverterForm() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BTC');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [swapped, setSwap] = useState(false);

  let {
    data: cryptoData,
    loading,
    error: cryptoError,
    fetchData: FetchCurrneciesData,
  } = useFetchCryptoCurrencies();
  let {
    data: CurrenciesData,
    loading: currenciesLoading,
    error: CurrenciesError,
    fetchData,
  } = useFetchCurrencies();
  const {
    loading: CurrenciesExchangeLoading,
    error: CurrenciesExchangeError,
    fetchData: FetchCurrneciesExchangeData,
  } = useConvert();

  // const handleSwap = () => {};

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
    FetchCurrneciesData();
    if (cryptoError || CurrenciesError)
      setError(cryptoError || CurrenciesError);
  }, []);

  const handleConvert = async () => {
    if (isNaN(parseFloat(amount))) {
      setResult('');
      setError('Please enter a valid amount.');
      return;
    }

    // Check if cryptoData is empty
    if (cryptoData.length === 0) {
      setResult('');
      setError('Cryptocurrency data is not available.');
      return;
    }
    // console.log('fromCurrency', fromCurrency);
    // console.log('swapped', swapped);

    const selectedCrypto = cryptoData.find(
      (currency) => currency.symbol === (swapped ? fromCurrency : toCurrency)
    );

    if (!selectedCrypto) {
      setResult('');
      setError('Selected cryptocurrency does not exist.');
      return;
    }

    // console.log({ fromCurrency, amount, toCurrency });
    const CurrenciesExchangeData = await FetchCurrneciesExchangeData(
      swapped ? fromCurrency : toCurrency,
      swapped ? toCurrency : fromCurrency
    );

    let convertedAmount;
    swapped
      ? (convertedAmount = (
          parseFloat(amount) * CurrenciesExchangeData
        ).toFixed(8))
      : (convertedAmount = (
          parseFloat(amount) / CurrenciesExchangeData
        ).toFixed(8));

    setError('');
    setResult(`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}.`);

    // console.log('CurrenciesExchangeData', CurrenciesExchangeData);
    // console.log('data', convertedAmount);
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setSwap(!swapped);
  };

  return (
    <div className="container">
      <div className="img-placed">
        <img src="https://i.imgur.com/YgmULQP.png" alt="" />
      </div>
      <form>
        <input
          type="text"
          name="amount"
          placeholder="Amount to convert"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <div id="select-field">
          <select
            name={'fromCurrency'}
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {swapped
              ? cryptoData.map((currency) => (
                  <option key={currency.id} value={currency.symbol}>
                    {currency.name} ({currency.symbol})
                  </option>
                ))
              : CurrenciesData.map((currency) => (
                  <option key={currency.id} value={currency.symbol}>
                    {currency.name} ({currency.symbol}) - {currency.sign}
                  </option>
                ))}
          </select>
          <button className="subButt" type="button" onClick={handleSwap}>
            <i className="uil uil-exchange"></i>
          </button>

          {/* ##################### second select #####################  */}

          <select
            name={'toCurrency'}
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {swapped
              ? CurrenciesData.map((currency) => (
                  <option key={currency.id} value={currency.symbol}>
                    {currency.name} ({currency.symbol}) - {currency.sign}
                  </option>
                ))
              : cryptoData.map((currency) => (
                  <option key={currency.id} value={currency.symbol}>
                    {currency.name} ({currency.symbol})
                  </option>
                ))}
          </select>
        </div>
        <br />
        <button type="button" onClick={handleConvert} className="primary-btn">
          Convert
        </button>
      </form>
      {CurrenciesExchangeLoading === false && <p id="result">{result}</p>}
      <p style={{ textAlign: 'center', color: 'rgb(139, 0, 0)' }}>{error}</p>
    </div>
  );
}

export default CurrencyConverterForm;
