import React, { Fragment, useState, useEffect } from 'react';
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { clearError, getUserDetail, updateUser } from "../../actions/userAction.js";
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import { UPDATE_USER_RESET } from '../../constants/userConstant.js';


const UpdateUser = () =>
{
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('');
    
    const navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, isUpdated } = useSelector(state => state.user);
    const { user } = useSelector(state => state.userDetail);
    
    const { id } = useParams();
    useEffect(() =>
    {
        if (user && user._id !== id)
        {
            dispatch(getUserDetail(id))
           
        } else
        {
             setName(user.name)
            setEmail(user.email)
           setRole(user.role)
        }
        if (error)
        {
            alert.error(error);
            dispatch(clearError())
        }

        if (isUpdated)
        {
            alert.success('User updated successfully')
            navigate('/admin/users')
            dispatch({type: UPDATE_USER_RESET})
        }


    }, [navigate,dispatch, alert, error,isUpdated,id,user])
    
    const handleSubmit = (e) =>
    {
        e.preventDefault();
           
        // const formData = new FormData()
        // formData.append('name',name)
        // formData.append('email',email)
        // formData.append('password',password)
        // formData.append('avatar',avatar)
        const newUser = {name,email,role}
        dispatch(updateUser(user._id,newUser))
        
    }

  return (
     <Fragment>
          <div className='row'>
              <div className='col-12 col-md-2'>
                  <Sidebar />
              </div>
              <div className='col-12 col-md-10'>
                  <Fragment>
                      <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                        <form className="shadow-lg">
                            <h1 className="mt-2 mb-5">Update User</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input 
                                    type="name" 
                                    id="name_field" 
                                    className="form-control"
                                    name='name'
                                    value={name}
                                    onChange={(e)=>setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control"
                                    name='email'
                                value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                        <label htmlFor="role_field">Role</label>

                                        <select
                                            id="role_field"
                                            className="form-control"
                                            name='role'
                                        value={role}
                                    onChange={(e)=>setRole(e.target.value)}
                                        >
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </div>

                            <button type="submit" className="btn update-btn btn-block mt-4 mb-3" onClick={handleSubmit}>Update</button>
                        </form>
                    </div>
                          
                      </div>
                  </Fragment>
              </div>
          </div>
    </Fragment>
  )
}

export default UpdateUser