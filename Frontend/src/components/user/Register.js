import React, { Fragment, useState, useEffect } from 'react';
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../../actions/userAction.js";
import { useNavigate } from 'react-router-dom';

const Register = () =>
{
     const navigate = useNavigate();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const[avatar,setAvatar]= useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.png')
    
    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);
    
    useEffect(() =>
    {
        if (isAuthenticated)
        {
           navigate('/')
        } 
        if (error)
        {
            alert.error(error);
            dispatch(clearError())
        }
    }, [navigate,dispatch, alert, isAuthenticated, error])
    
    const handleSubmit = (e) =>
    {
        e.preventDefault();
           
        // const formData = new FormData()
        // formData.append('name',name)
        // formData.append('email',email)
        // formData.append('password',password)
        // formData.append('avatar',avatar)
        const newUser = {name,email,password,avatar}
        dispatch(register(newUser))
        
    }

    const onChange = (e) =>
    {
        if (e.target.name === "avatar")
        {
            const reader = new FileReader()
             
            reader.onload = () =>
            {
                if (reader.readyState === 2)
                {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])
        }
        
    }
  return (
      <Fragment>
           <div className="container container-fluid">
                <div className="row wrapper">
                <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={handleSubmit} >
                    <h1 className="mb-3">Register</h1>

                    <div className="form-group">
                    <label htmlFor="name_field">Name</label>
                    <input type="name"
                     id="name_field" 
                     className="form-control"
                     name="name" 
                    value={name} 
                    onChange={(e)=>setName(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                        type="email"
                        id="email_field"
                        className="form-control"
                        name="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                        type="password"
                        id="password_field"
                        className="form-control"
                        name="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='avatar_upload'>Avatar</label>
                        <div className='d-flex align-items-center'>
                            <div>
                                <figure className='avatar mr-3 item-rtl'>
                                    <img
                                        src={avatarPreview}
                                        className='rounded-circle'
                                        alt='rounded'
                                    />
                                </figure>
                            </div>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='avatar'
                                    className='custom-file-input'
                                    id='customFile'
                                    accept='images/*'
                                    onChange={onChange}
                                />
                                <label className='custom-file-label' htmlFor='customFile'>
                                    Choose Avatar
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        id="register_button"
                        type="submit"
                        className="btn btn-block py-3"
                        disabled={loading ? true : false}
                    >
                        REGISTER
                    </button>
                    </form>
                    </div>
            </div>
    </div>
    </Fragment>
  )
}

export default Register