import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Register from './components/Register';
import Category from './components/Category';
import Product from './components/Product';
import ShoppingList from './components/ShoppingList';
import ShoppingListDetails from './components/ShoppingListDetails';

const App = () =>
{
  return (
    <main className='min-h-screen'>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/products" element={<Product />} />
        <Route path="/shopping-lists" element={<ShoppingList />} />
        <Route path="/shopping-lists/:id" element={<ShoppingListDetails />} />
      </Routes>
    </main>
  );
}

export default App;