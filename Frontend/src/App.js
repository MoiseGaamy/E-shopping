import  { useEffect,useState } from 'react';
import './App.css';
import Header from './components/layouts/Header.js';
import Footer from './components/layouts/Footer.js';
import Home from './components/Home.js';
import '../src/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductDetail from './components/product/ProductDetail.js';
import Login from './components/user/Login.js';
import Register from './components/user/Register.js';
import axios from "axios";

import { loadUser } from './actions/userAction.js';
import store from './store.js';
import Profile from './components/user/Profile.js';
import ProtectedRoute from './components/route/ProtectedRoute.js';
import UpdateProfile from './components/user/UpdateProfile.js';
import UpdatePassword from './components/user/UpdatePassword.js';
import ForgotPassword from './components/user/ForgotPassword.js';
import NewPassword from './components/user/NewPassword.js';
import Cart from './components/cart/Cart.js';
import Shipping from './components/cart/Shipping.js';
import ConfirmOrder from './components/cart/ConfirmOrder.js';
import Payment from './components/cart/Payment.js';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe} from "@stripe/stripe-js"
import OrderSuccess from './components/cart/OrderSuccess.js';
import ListOrder from './components/order/ListOrder.js';
import OrderDetail from './components/order/OrderDetail.js';
import Dashboard from './components/admin/Dashboard.js';
import ProductList from './components/admin/ProductList.js';
import NewProduct from './components/admin/NewProduct.js';
import { useSelector } from 'react-redux';
import UpdateProduct from './components/admin/UpdateProduct.js';
import OrderList from './components/admin/OrderList.js';
import ProcessOrder from './components/admin/ProcessOrder.js';
import UserList from './components/admin/UserList.js';
import UpdateUser from './components/admin/UpdateUser.js';
import ProductReviews from './components/admin/ProductReviews.js';

function App()
{
  const[stripeApikey,setStripeApikey]=useState('')
  useEffect(() =>
{
    store.dispatch(loadUser())
    async function getStripeApikey()
    {
     const { data } = await axios.get('/api/v1/stripeapi');
      setStripeApikey(data.stripeApikey)
    }
    getStripeApikey()
  }, [])
  const { loading, user,isAuthenticated } = useSelector(state => state.auth);
  return (
      <BrowserRouter>
    <div>
        <Header />
        <div className="container container-fluid">
             <Routes>
               <Route path='/' element={<Home />}/>
               <Route path='/search/:keyword' element={<Home />}/>
               <Route path='/product/:id' element={<ProductDetail />}/>
               
               <Route path='/payment' element={stripeApikey && <Elements stripe={loadStripe(stripeApikey)}><ProtectedRoute><Payment /></ProtectedRoute></Elements>} />
               
                
               <Route path='/cart' element={<Cart />}/>
               <Route path='/shipping' element={<ProtectedRoute><Shipping/></ProtectedRoute>}/>
               <Route path='/order/confirm' element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute>}/>
               <Route path='/success' element={<ProtectedRoute><OrderSuccess></OrderSuccess></ProtectedRoute>} />   
            
               <Route path='/login' element={<Login/>}/>
               <Route path='/register' element={<Register/>}/>
               <Route path='/password/forgot' element={<ForgotPassword />}/>
               <Route path='/password/reset/:token' element={<NewPassword />} exact/>
               <Route path='/me' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
               <Route path='/me/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>}/>
               <Route path='/password/update' element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>}/>
               <Route path='/orders/me' element={<ProtectedRoute><ListOrder/></ProtectedRoute>}/>
               <Route path='/order/:id' element={<ProtectedRoute><OrderDetail/></ProtectedRoute>}/>
            </Routes>
        </div>
        <Routes>

               <Route path='/dashboard' isAdmin={true} element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
               <Route path='/admin/products' isAdmin={true} element={<ProtectedRoute><ProductList/></ProtectedRoute>}/>
               <Route path='/admin/orders' isAdmin={true} element={<ProtectedRoute><OrderList/></ProtectedRoute>}/>
               <Route path='/admin/product' isAdmin={true} element={<ProtectedRoute><NewProduct/></ProtectedRoute>}/>
               <Route path='/admin/product/:id' isAdmin={true} element={<ProtectedRoute><UpdateProduct/></ProtectedRoute>}/>
               <Route path='/admin/order/:id' isAdmin={true} element={<ProtectedRoute><ProcessOrder/></ProtectedRoute>}/>
               <Route path='/admin/user/:id' isAdmin={true} element={<ProtectedRoute><UpdateUser/></ProtectedRoute>}/>
               <Route path='/admin/reviews' isAdmin={true} element={<ProtectedRoute><ProductReviews/></ProtectedRoute>}/>
               <Route path='/admin/users' isAdmin={true} element={<ProtectedRoute><UserList/></ProtectedRoute>}/>
        </Routes>
        {!loading && isAuthenticated && user.role !=='admin' &&  ( <Footer />) }
    
    </div>
  </BrowserRouter>
  );
}

export default App;
