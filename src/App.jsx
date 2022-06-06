import React from 'react'
import { Routes, Route } from 'react-router'
import Login from './pages/login'
import Home from './pages/home'
import User from './pages/user'
import Book from './pages/book'
import History from './pages/history'
import Borrow from './pages/borrow'
import Mybook from './pages/mybook'
import BookList from './pages/booklist'

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/admin' element={<Home />}>
        <Route path='user' element={<User />} />
        <Route path='book' element={<Book />} />
        <Route path='history' element={<History />} />
      </Route>
      <Route path='/user' element={<Borrow />}>
        <Route path='mybook' element={<Mybook />} />
        <Route path='books' element={<BookList />} />
      </Route>
    </Routes>)
}

export default Router
