
import { FaArrowRight } from 'react-icons/fa';
import Input from "@components/input/Input"
import Button from "@components/button/Button"
import { Link } from 'react-router-dom';
import "./Login.scss"
import { useState } from 'react';
import { useEffect } from 'react';
import { authService } from '@services/api/auth/auth.service';
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false)

    const [hasError, setHasError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [alertType, setAlertType] = useState('')
    const [user, setUser] = useState('')

    const loginUser = async (event) => {
        setLoading(true);
        event.preventDefault();
        try {
            const rs = await authService.signIn({
                username, password
            })
            setKeepLoggedIn(keepLoggedIn)
            // * set logged in local storage
            // * set usename in local storage
            // * dispatch user to redux
            setUser(rs.data.user)
            setHasError(false);
            setAlertType('alert-success')
        } catch (error) {
            setLoading(false);
            setHasError(true);
            setAlertType('alert-error')
            setErrorMessage(error?.response?.data.message)
        }

    }

    useEffect(() => {
        if (loading && !user) return;
        if (user) {
            console.log('navigate to streampage')
            setLoading(false)
        }
    }, [loading, user])
    return (
        <div className="auth-inner">

            {hasError && errorMessage && (
                <div className={`alerts ${alertType}`} role="alert">
                    {errorMessage}
                </div>
            )}

            <form className="auth-form" onSubmit={loginUser} >
                <div className="form-input-container">
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        labelText="Username"
                        placeholder="Enter Username"
                        style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
                        handleChange={(event) => setUsername(event.target.value)}
                    ></Input>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        labelText="Password"
                        placeholder="Enter Password"
                        style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
                        handleChange={(event) => setPassword(event.target.value)}
                    />
                    <label className="checkmark-container" htmlFor="checkbox">
                        <Input
                            id="checkbox"
                            name="checkbox"
                            type="checkbox"
                            handleChange={(event) => setKeepLoggedIn(!keepLoggedIn)}
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