import axios from 'axios';
import
    {
        LOGIN_REQUEST,
        LOGIN_SUCCESS,
        LOGIN_FAIL,
        REGISTER_REQUEST,
        REGISTER_SUCCESS,
        REGISTER_FAIL,
         LOAD_REQUEST, 
        LOAD_SUCCESS, 
        LOAD_FAIL, 
        LOGOUT_SUCCESS,
        LOGOUT_FAIL,
         UPDATE_USER_PROFILE_REQUEST,
         UPDATE_USER_PROFILE_SUCCESS,
        UPDATE_USER_PROFILE_FAIL,
        UPDATE_PASSWORD_REQUEST,
        UPDATE_PASSWORD_SUCCESS,
        UPDATE_PASSWORD_FAIL,
         FORGOT_PASSWORD_REQUEST,
        FORGOT_PASSWORD_SUCCESS,
        FORGOT_PASSWORD_FAIL,
         NEW_PASSWORD_REQUEST,
        NEW_PASSWORD_SUCCESS,
        NEW_PASSWORD_FAIL,
         ALL_USERS_REQUEST,
        ALL_USERS_SUCCESS,
        ALL_USERS_FAIL,
         UPDATE_USER_REQUEST,
        UPDATE_USER_SUCCESS,
        UPDATE_USER_FAIL,
        USER_DETAIL_REQUEST,
        USER_DETAIL_SUCCESS,
        USER_DETAIL_FAIL,
         DELETE_USER_REQUEST,
        DELETE_USER_SUCCESS,
        DELETE_USER_FAIL,
        CLEAR_ERRORS
    } from "../constants/userConstant";

export const login = (email, password) => async (dispatch) =>
{
    try
    {
        dispatch({ type: LOGIN_REQUEST})
        
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/login', { email, password }, config)

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        })

    } catch(error){
        dispatch({
            type: LOGIN_FAIL,
            payload:error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        })
        console.log(error)
    }
}
export const register = (userData) => async (dispatch) =>
{
    try
    {
        dispatch({ type: REGISTER_REQUEST})
        
        const config = {
           headers: {
            'content-type': 'application/json'
        }
        }

        const { data } = await axios.post('/api/v1/register', userData, config)

        dispatch({
            type: REGISTER_SUCCESS,
            payload: data.user
        })

    } catch(error){
        dispatch({
            type: REGISTER_FAIL,
            payload: error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        })
    }
}
export const loadUser = () => async (dispatch) =>
{
    try
    {
        dispatch({ type: LOAD_REQUEST})
        
        const { data } = await axios.get('/api/v1/me')

        dispatch({
            type: LOAD_SUCCESS,
            payload: data.user
        })

    } catch(error){
        dispatch({
            type: LOAD_FAIL,
            payload: error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        })
    }
}

export const forgotPassword = (email) => async (dispatch) =>
{
    try
    {
        dispatch({ type:FORGOT_PASSWORD_REQUEST})
        
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/password/forgot', email, config)

        dispatch({
            type:FORGOT_PASSWORD_SUCCESS,
            payload: data.message
        })

    } catch(error){
        dispatch({
            type:FORGOT_PASSWORD_FAIL,
            payload: error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        })
    }
}

export const updateProfile = (userData) => async (dispatch) =>
{
    try
    {
        dispatch({ type: UPDATE_USER_PROFILE_REQUEST})
        
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        }

        const { data } = await axios.put('/api/v1/me/update', userData, config)

        dispatch({
            type: UPDATE_USER_PROFILE_SUCCESS,
            payload: data.success
        })

    } catch(error){
        dispatch({
            type: UPDATE_USER_PROFILE_FAIL,
            payload: error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        })
    }
}
export const updatePassword = (passwords) => async (dispatch) =>
{
    try
    {
        dispatch({ type:UPDATE_PASSWORD_REQUEST})
        
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        }

        const { data } = await axios.put('/api/v1/password/update', passwords, config)

        dispatch({
            type:UPDATE_PASSWORD_SUCCESS,
            payload: data.success
        })

    } catch(error){
        dispatch({
            type:UPDATE_PASSWORD_FAIL,
            payload: error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        })
    }
}

export const resetPassword = (token,passwords) => async (dispatch) =>
{
    try
    {
        dispatch({ type:NEW_PASSWORD_REQUEST})
        
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/password/reset/${token}`, passwords, config)

        dispatch({
            type:NEW_PASSWORD_SUCCESS,
            payload: data.success
        })

    } catch(error){
        dispatch({
            type:NEW_PASSWORD_FAIL,
            payload: error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        })
    }
}
export const allUsers = () => async (dispatch) =>
{
    try
    {
        dispatch({ type: ALL_USERS_REQUEST})
        
        const { data } = await axios.get('/api/v1/admin/users')

        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users
        })

    } catch(error){
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        })
    }
}

export const updateUser = (id,userData) => async (dispatch) =>
{
    try
    {
        dispatch({ type:UPDATE_USER_REQUEST})
        
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/user/${id}`, userData, config)

        dispatch({
            type:UPDATE_USER_SUCCESS,
            payload: data.success
        })

    } catch(error){
        dispatch({
            type:UPDATE_USER_FAIL,
            payload: error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        })
    }
}
export const getUserDetail = (id) => async (dispatch) =>
{
    try
    {
        dispatch({ type:USER_DETAIL_REQUEST})
        
        const { data } = await axios.get(`/api/v1/admin/user/${id}`)

        dispatch({
            type:USER_DETAIL_SUCCESS,
            payload: data.user
        })

    } catch(error){
        dispatch({
            type:USER_DETAIL_FAIL,
            payload: error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        })
    }
}
export const deleteUser = (id) => async (dispatch) =>
{
    try
    {
        dispatch({ type:DELETE_USER_REQUEST})
        
        const { data } = await axios.delete(`/api/v1/admin/user/${id}`)

        dispatch({
            type:DELETE_USER_SUCCESS,
            payload: data.success
        })

    } catch(error){
        dispatch({
            type:DELETE_USER_FAIL,
            payload: error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        })
    }
}

export const logout = () => async (dispatch) =>
{
    try
    { 
        await axios.get('/api/v1/logout')

        dispatch({
            type: LOGOUT_SUCCESS
        })

    } catch(error){
        dispatch({
            type: LOGOUT_FAIL,
            payload:error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        })
    }
}

export const clearError =  () => async (dispatch) =>
{
    dispatch({
        type:CLEAR_ERRORS
    })
}