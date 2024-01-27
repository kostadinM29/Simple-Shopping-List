import React from 'react';
import { Route, Routes } from 'react-router-dom';


import Home from './components/Home';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Register from './components/Register';

const App = () =>
{
  return (
    <main className='bg-gray-200 min-h-screen'>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </main>
  );
}

export default App;