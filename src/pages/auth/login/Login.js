
import { FaArrowRight } from 'react-icons/fa';
import Input from "@root/base-components/input/Input"
import Button from "@root/base-components/button/Button"
import { Link, useNavigate } from 'react-router-dom';
import "./Login.scss"
import { useState } from 'react';
import { useEffect } from 'react';
import { authService } from '@services/api/auth/auth.service';
import { updateLoggedUserProfile } from '@redux/reducers/user/user.reducer';
import { useDispatch } from 'react-redux';

import useSessionStorage from '@hooks/useSessionStorage';
const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',

    });
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }


    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [user, setUser] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch();


    // true is logged in and get current user by jwt




    const loginUser = async (event) => {
        setErrorMessage('')
        setLoading(true);
        event.preventDefault();
        try {
            const rs = await authService.signIn({
                username: formData.username,
                password: formData.password
            })

            // set to localStorage

       
            sessionStorage.setItem('accessToken', rs.data.token)
    

            // * dispatch user to redux
            setLoading(false)
            setUser(rs.data.user)
        
            dispatch(
                updateLoggedUserProfile(rs.data.user)
            );
        } catch (error) {
            setLoading(false);
            setErrorMessage(error?.response?.data.message)
        }

    }

    useEffect(() => {
        if (loading && !user) return;
        if (user) {
            navigate('/app/social/streams')

        }
    }, [loading, user])
    return (
        <div className="signin">




            <div class="split-screen">
                <div class="left">
                    <section class="copy">
                        <h1>Connect together</h1>
                        <p>with Social App</p>
                    </section>
                </div>
                <div class="right">
                    <form onSubmit={loginUser}>


                        <section class="copy title">
                            <h2>Sign In</h2>
                        </section>


                        <div className="form-input">
                            
                                {errorMessage &&
                                    <div className={`alerts alert-error`} role='alert'>
                                        {errorMessage}
                                    </div>
                                }
                     

                            <Input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                labelText="Username"
                                placeholder="Enter Username"
                                style={{ border: `${errorMessage ? '1px solid #fa9b8a' : ''}` }}
                                handleChange={onInputChange}
                            ></Input>

                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                labelText="Password"
                                placeholder="Enter Password"
                                style={{ border: `${errorMessage ? '1px solid #fa9b8a' : ''}` }}
                                handleChange={onInputChange}
                            />



                        </div>



                        <Button
                            label={`${loading ? 'SIGN IN IN PROGRESS..' : 'SIGN IN'}`}
                            className="signup-btn"

                        />


                        <section class="copy">

                            <div class="login-container">
                                <p>New user,  Create an account? <span className='link' onClick={()=>navigate("/signup")}> <strong>Sign up</strong></span></p>
            
                            </div>
                        </section>




                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;