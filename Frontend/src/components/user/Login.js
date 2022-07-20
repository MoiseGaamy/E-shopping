import React, { Fragment, useState, useEffect } from 'react';
import Loader from '../layouts/Loader.js';
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { login, clearError } from "../../actions/userAction.js";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Login = () =>
{
    const navigate = useNavigate();
    const { search } = useLocation();
    const[email,setEmail]= useState('')
    const[password,setPassword]= useState('')
    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/'
    useEffect(() =>
    {
      if (error)
      {
        alert.error(error);
        dispatch(clearError())
      }
      if (isAuthenticated)
      { 
        alert.success('logged in successfully')
         navigate(redirect)
      } 
    }, [navigate,dispatch, alert, isAuthenticated, error,redirect])
    
    const handleSubmit = (e) =>
    {
        e.preventDefault();
        dispatch(login(email, password))
        console.log(email,password)
    }

  return (
      <Fragment>
          {loading ? <Loader /> : (
              <Fragment>
                <div className="container container-fluid">
                <div className="row wrapper-login wrapper"> 
                  <form onSubmit={handleSubmit} className="shadow-lg">
            <h1 className="mb-3">Login</h1>
            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
              />
            </div>

            <Link to='/password/forgot' className="float-right mb-4">Forgot Password?</Link>
  
            <button
              id="login_button"
              type="submit"
              className="btn btn-block py-3"
            >
              LOGIN
            </button>

            <Link to='/register' className="float-right mt-3">New User?</Link>
          </form>
          </div>
          </div>
          </Fragment>
          )}
    </Fragment>
  )
}

export default Login