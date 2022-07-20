import React, { Fragment, useState, useEffect } from 'react';
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword,loadUser,clearError } from "../../actions/userAction.js";
import { useNavigate } from 'react-router-dom';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstant.js';


const UpdatePassword = () =>
{
     const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
   
    
    const alert = useAlert();
    const dispatch = useDispatch();

    
    const { error, isUpdated, loading } = useSelector(state => state.user);
    
    useEffect(() =>
    {
    
        if (error)
        {
            alert.error(error);
            dispatch(clearError())
        }

        if (isUpdated)
        {
            alert.success('Password updated successfully')
            dispatch(loadUser())
            navigate('/me')
            dispatch({type: UPDATE_PASSWORD_RESET})
        }


    }, [navigate,dispatch, alert, error,isUpdated])
    
    const handleSubmit = (e) =>
    {
        e.preventDefault();
           
        // const formData = new FormData()
        // formData.append('name',name)
        // formData.append('email',email)
        // formData.append('password',password)
        // formData.append('avatar',avatar)
        const newUser = {oldPassword,password}
        dispatch(updatePassword(newUser))
        
    }

  return (
      <Fragment>
          <div className="container-container-fluid">
		<div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={handleSubmit}>
                        <h1 className="mt-2 mb-5">Update Password</h1>
                        <div className="form-group">
                            <label for="old_password_field">Old Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                               className="form-control"
                                value={oldPassword}
                                onChange={(e)=> setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label for="new_password_field">New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                               className="form-control"
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading ? true : false}>Update Password</button>
                    </form>
                </div>
            </div>
        
    </div>
    </Fragment>
  )
}

export default UpdatePassword