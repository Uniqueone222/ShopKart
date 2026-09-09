import React from 'react'

import { useAuth } from '../context/AuthContext'

import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  //    navigate to home
  if (!user) {
    return <Navigate to='/login' />
  }

  // if not we stay on children - login signup or lanidng

  return children

}

export default ProtectedRoute