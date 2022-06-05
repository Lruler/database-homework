import React from 'react'
import { Routes, Route } from 'react-router'
import Login from './pages/login'
import Home from './pages/home'
import User from './pages/user'
import Book from './pages/book'
import History from './pages/history'

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='home' element={<Home />}>
        <Route path='user' element={<User />} />
        <Route path='book' element={<Book />} />
        <Route path='history' element={<History />} />
      </Route>
    </Routes>)
}

export default Router
