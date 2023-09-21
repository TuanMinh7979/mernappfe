
import { FaArrowRight } from 'react-icons/fa';
import Input from "@components/input/Input"
import Button from "@components/button/Button"
import { Link, useNavigate } from 'react-router-dom';
import "./Login.scss"
import { useState } from 'react';
import { useEffect } from 'react';
import { authService } from '@services/api/auth/auth.service';
import { updateLoggedUser } from '@redux/reducers/user/user.reducer';
import { useDispatch } from 'react-redux';
import useLocalStorage from '@hooks/useLocalStorage';
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
    const [setSessionStoreLogged] = useSessionStorage('logged', 'set')


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

            setSessionStoreLogged(true);
            // * set logged in local storage
            // * set usename in local storage
            // * dispatch user to redux
            setLoading(false)
            setUser(rs.data.user)
            dispatch(
                updateLoggedUser({ token: rs.data.token, profile: rs.data.user })
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
        <div className="auth-inner">

            {errorMessage && (
                <div className={`alerts alert-error}`} role="alert">
                    {errorMessage}
                </div>
            )}

            <form className="auth-form" onSubmit={loginUser} >
                <div className="form-input-container">
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
                    <label className="checkmark-container" htmlFor="checkbox">
                        <Input
                            id="checkbox"
                            name="checkbox"
                            type="checkbox"
                            handleChange={onInputChange}
                        />
                        Keep me signed in
                    </label>
                </div>

                <Button
                    label={`${loading ? 'SIGNIN IN PROGRESS..' : 'SIGNIN'}`}
                    className="auth-button button"

                />
                <Link to={'/forgot-password'}>
                    <span className="forgot-password">
                        Forgot password? <FaArrowRight className="arrow-right" />
                    </span>
                </Link>
            </form>
        </div>
    );
};

export default Login;