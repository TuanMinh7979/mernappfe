import Input from '@components/input/Input';
import Button from '@components/button/Button';
import './Register.scss';
import { useEffect, useState } from 'react';
import { Utils } from '@services/utils/utils.service';
import { authService } from '@services/api/auth/auth.service';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useSessionStorage from '@hooks/useSessionStorage';
const Register = () => {
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [alertType, setAlertType] = useState('')
    const [hasError, setHasError] = useState(false)
    const [user, setUser] = useState();
    const navigate= useNavigate()

    const dispatch= useDispatch();
    const [pageReload]= useSessionStorage('pageReload', 'set')

    const registerUser = async (event) => {
        setLoading(true)
        event.preventDefault();
        try {
            const avatarColor = Utils.avatarColor()
            const avatarImage = Utils.generateAvatar(username.charAt(0).toUpperCase(), avatarColor)
            const rs = await authService.signUp({
                username,
                email,
                password,
                avatarColor,
                avatarImage
            })
            console.log(rs);

            // * set logged in local storage
            // * set usename in local storage
            // * dispatch user to redux
            setLoading(false)
            setUser(rs.data.user)
            setHasError(false);
            setAlertType('alert-success')
            Utils.dispatchUser(rs, pageReload, dispatch,setUser)

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
            navigate('/app/social/streams')
            setLoading(false)
        }
    }, [loading, user])
    return (
        <div className="auth-inner">
            <div className={`alerts`} role="alert">
                {hasError && errorMessage &&
                    <div className={`alerts ${alertType}`} role='alert'>
                        {errorMessage}
                    </div>
                }
            </div>
            <form className="auth-form" onSubmit={registerUser}>
                <div className="form-input-container">
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        labelText="Username"
                        placeholder="Enter Username"
                        handleChange={(event) => setUserName(event.target.value)}
                        style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
                    />
                    <Input
                        value={email}
                        id="email"
                        name="email"
                        type="text"
                        labelText="Email"
                        placeholder="Enter Email"
                        handleChange={(event) => setEmail(event.target.value)}

                    />
                    <Input
                        value={password}
                        id="password"
                        name="password"
                        type="password"
                        labelText="Password"
                        placeholder="Enter Password"
                        handleChange={(event) => setPassword(event.target.value)}

                    />
                </div>
                <Button
                    label={`${loading ? 'SIGNUP IN PROGRESS...' : 'SIGNUP'}`}
                    className="auth-button button"
                    disabled={!username || !email || !password}
                />
            </form>
        </div>
    );
};

export default Register;