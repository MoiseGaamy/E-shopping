import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({isAdmin,children}) =>
{
    const { isAuthenticated,loading,user } = useSelector(state => state.auth);
  
    if (loading) return null;
    if( isAdmin ===true && user.role !== 'admin') return <Navigate to='/' />

    return isAuthenticated ? children : <Navigate to='/login' replace />;
}

export default ProtectedRoute