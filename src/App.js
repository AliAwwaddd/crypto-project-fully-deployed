import React from 'react';
import Header from './Components/Header';
import CurrencyConverterForm from './Components/CurrencyConverterForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="AppGlass">
        <Header />
        <CurrencyConverterForm />
      </div>
    </div>
  );
}

export default App;
