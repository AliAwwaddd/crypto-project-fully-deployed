import React, { useState, useEffect, useReducer } from 'react';
import './index.css';
import useFetchCryptoCurrencies from '../hooks/useFetchCryptoCurrencies';
import useFetchCurrencies from '../hooks/useFetchCurrencies';
import useConvert from '../hooks/useConvert';
import Error from '../Error';
import Loader from '../Loader';

const initialState = {
  fromCurrency: 'USD',
  toCurrency: 'BTC',
  amount: '',
  result: '',
  status: 'loading',
  error: '',
  swapped: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'badRequest':
      return {
        ...state,
        error: action.payload,
        result: '',
      };
    case 'setFromCurrency':
      return {
        ...state,
        fromCurrency: action.payload,
      };
    case 'setToCurrency':
      return {
        ...state,
        toCurrency: action.payload,
      };
    case 'Result':
      return {
        ...state,
        result: `${state.amount} ${state.fromCurrency} = ${action.payload} ${state.toCurrency}.`,
        status: 'ready',
        error: '',
      };
    case 'swap':
      return {
        ...state,
        swapped: !state.swapped,
        fromCurrency: state.toCurrency,
        toCurrency: state.fromCurrency,
      };
    case 'setAmount':
      return {
        ...state,
        amount: action.payload,
      };
    default:
      throw new Error('Action unknown');
  }
}

function CurrencyConverterForm() {
  const [
    {
      status,
      error: error1,
      result: result1,
      swapped: swapped1,
      fromCurrency: fromCurrency1,
      toCurrency: toCurrency1,
      amount: amount1,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  let {
    data: cryptoData,
    error: cryptoError,
    fetchData: FetchCurrneciesData,
  } = useFetchCryptoCurrencies();
  let {
    data: CurrenciesData,
    error: CurrenciesError,
    fetchData,
  } = useFetchCurrencies();
  const {
    loading: CurrenciesExchangeLoading,
    fetchData: FetchCurrneciesExchangeData,
  } = useConvert();

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
    FetchCurrneciesData({ dispatch: dispatch });
    if (cryptoError || CurrenciesError) dispatch({ type: 'dataFailed' });
    console.log(cryptoError || CurrenciesError);
  }, []);

  const handleConvert = async () => {
    if (isNaN(parseFloat(amount1))) {
      dispatch({ type: 'badRequest', payload: 'Please enter a valid amount.' });
      return;
    }

    // Check if cryptoData is empty
    if (cryptoData.length === 0) {
      dispatch({
        type: 'badRequest',
        payload: 'Cryptocurrency data is not available.',
      });
      return;
    }

    const selectedCrypto = cryptoData.find(
      (currency) => currency.symbol === (swapped1 ? fromCurrency1 : toCurrency1)
    );

    if (!selectedCrypto) {
      dispatch({
        type: 'badRequest',
        payload: 'Selected cryptocurrency does not exist.',
      });
      return;
    }

    const CurrenciesExchangeData = await FetchCurrneciesExchangeData(
      swapped1 ? fromCurrency1 : toCurrency1,
      swapped1 ? toCurrency1 : fromCurrency1
    );

    let convertedAmount;
    swapped1
      ? (convertedAmount = (
          parseFloat(amount1) * CurrenciesExchangeData
        ).toFixed(8))
      : (convertedAmount = (
          parseFloat(amount1) / CurrenciesExchangeData
        ).toFixed(8));

    dispatch({
      type: 'Result',
      payload: convertedAmount,
    });
  };

  const handleSwap = () => {
    dispatch({ type: 'swap' });
  };

  return (
    <>
      {status === 'loading' && <Loader />}
      {status === 'error' && <Error />}
      {status === 'ready' && (
        <div className="container">
          <div className="img-placed">
            <img src="https://i.imgur.com/YgmULQP.png" alt="" />
          </div>
          <form>
            <input
              type="text"
              name="amount"
              placeholder="Amount to convert"
              value={amount1}
              onChange={(e) =>
                dispatch({ type: 'setAmount', payload: e.target.value })
              }
              required
            />
            <div id="select-field">
              <select
                name={'fromCurrency'}
                value={fromCurrency1}
                onChange={(e) =>
                  dispatch({ type: 'setFromCurrency', payload: e.target.value })
                }
              >
                {swapped1
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
                value={toCurrency1}
                onChange={(e) =>
                  dispatch({ type: 'setToCurrency', payload: e.target.value })
                }
              >
                {swapped1
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
            <button
              type="button"
              onClick={handleConvert}
              className="primary-btn"
            >
              Convert
            </button>
          </form>
          {CurrenciesExchangeLoading === false && <p id="result">{result1}</p>}
          <p style={{ textAlign: 'center', color: 'rgb(139, 0, 0)' }}>
            {error1}
          </p>
        </div>
      )}
    </>
  );
}

export default CurrencyConverterForm;
