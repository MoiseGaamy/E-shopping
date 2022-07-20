import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { productReducer,productDetail,newReviewReducer, newProductReducer, deleteProductReducer, productReviewsReducer, deleteReviewReducer } from './reducers/productReducer.js';
import { authReducer, userReducer, forgotPasswordReducer, allUsersReducer, userDetailReducer } from './reducers/userReducer.js';
import { cartReducer } from './reducers/cartReducer.js';
import { newOrderReducer,myOrdersReducer,orderDetailReducer, allOrderReducer, orderReducer } from './reducers/orderReducer.js';
//set up the reducer
const reducer = combineReducers({
    products: productReducer,
    productDetail: productDetail,
    newProduct: newProductReducer,
    deleteProduct: deleteProductReducer,
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetail: orderDetailReducer,
    allOrders: allOrderReducer,
    order: orderReducer,
    allUsers: allUsersReducer,
    userDetail : userDetailReducer,
    newReviewReducer: newReviewReducer,
    productReviews: productReviewsReducer,
    deleteReview: deleteReviewReducer
})
// initialize the state as an empty object
const initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
        shippingInfo: localStorage.getItem('shippingInfo')? JSON.parse(localStorage.getItem('shippingInfo')):{}
    }
}
// define middleware
const middleware = [thunk]
// create the store
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;