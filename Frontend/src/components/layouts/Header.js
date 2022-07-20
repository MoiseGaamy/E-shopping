import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Search from './Search.js';
import { logout } from '../../actions/userAction.js';

import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';


const Header = () =>
{
  const dispatch = useDispatch();
  const alert = useAlert();

  const { user, loading } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.cart);

  const logoutHandler = () =>
{
    dispatch(logout())
    alert.success('Logged out successfully')
}

  return (
    <Fragment>
        <nav className="navbar row">
            <div className="col-12 col-md-3">
               <div className="navbar-brand">
                   <Link to='/'><img src="/images/logoo.png" alt='logo' style={{width:'35%'}} /></Link> 
                </div>
            </div>
              
        <div className="col-12 col-md-6 mt-2 mt-md-0">
             <Search />
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          
          <Link to='/cart' style={{ textDecoration:'none'}}>
             <span id="cart" className="ml-3">Cart</span>
            <span className="ml-1" id="cart_count">{cartItems.length}</span>
          </Link>

          {user ? (<div className='ml-4 dropdown d-inline'>
            <Link to='#!' className='btn dropdown-toggle text-white mr-5' type='button' id='#dropDownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
              <figure className='avatar avatar-nav'>
                <img src={user.avatar && user.avatar.url} alt={user && user.name} className="rounded-circle" />
                <span style={{marginLeft:'0.5rem'}}>{user && user.name}</span>
              </figure>
            </Link>
            <div className='dropdown-menu' aria-labelledby='#dropDownMenuButton'>
              
              {user && user.role === 'admin' && ( <Link className='dropdown-item' to='/dashboard'>Dashboard</Link>)}
              <Link className='dropdown-item' to='/orders/me'>orders</Link>
              <Link className='dropdown-item' to='/me'>profile</Link>
              <Link className='dropdown-item text-danger ' to='/' onClick={logoutHandler}>
                logout
              </Link>
            </div>
          </div>): !loading && <Link to='/login' className="btn ml-4" id="login_btn">Login</Link>
          }

          

        </div>
    </nav>
    </Fragment>
  )
}

export default Header