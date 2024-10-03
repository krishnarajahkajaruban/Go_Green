import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import Home from './pages/Home/Home';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/saga-green/theme.css";


function App() {
  const value = {
    ripple: true,
  };

  return (
    <PrimeReactProvider value={value}>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;
