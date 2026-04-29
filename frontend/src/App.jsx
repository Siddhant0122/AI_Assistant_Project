import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProductPage from './components/ProductPage.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Dashboard from './components/Dashboard.jsx'
import Chat from './components/Chat.jsx'
import Features from './components/Features.jsx'
import Expenses from './components/Expenses.jsx'
import Todo from './components/Todo.jsx'
import Reminders from './components/Reminders.jsx'
import api from './api.jsx'

export default function App(){
  const [user, setUser] = useState(null)
  const loc = useLocation()

  useEffect(() => {
    api.get('/me').then(r => setUser(r.data)).catch(() => setUser(null))
  }, [loc.pathname])

  const authed = !!user

  return (
    <div>
      <Navbar authed={authed} />
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login onAuth={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={authed ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/chat" element={authed ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/expenses" element={authed ? <Expenses /> : <Navigate to="/login" />} />
        <Route path="/todo" element={authed ? <Todo /> : <Navigate to="/login" />} />
        <Route path="/reminders" element={authed ? <Reminders /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}