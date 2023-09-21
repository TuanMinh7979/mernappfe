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



    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const registerUser = async (event) => {

        event.preventDefault();
        try {
            setErrorMessage("")
            setLoading(true)
            const avatarColor = Utils.avatarColor()
            const avatarImage = Utils.generateAvatar(formData.username.charAt(0).toUpperCase(), avatarColor)
            const rs = await authService.signUp({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                avatarColor,
                avatarImage
            })
            setLoading(false)
        } catch (error) {
            setLoading(false);
            setErrorMessage(error?.response?.data.message)
        }

    }

// TODO: create global alert for success register
    return (
        <div className="auth-inner">
            <div className={`alerts`} role="alert">
                {errorMessage &&
                    <div className={`alerts alert-error`} role='alert'>
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
                        value={formData.username}
                        labelText="Username"
                        placeholder="Enter Username"
                        handleChange={onInputChange}
                        style={{ border: `${errorMessage ? '1px solid #fa9b8a' : ''}` }}
                    />
                    <Input
                        value={formData.email}
                        id="email"
                        name="email"
                        type="text"
                        labelText="Email"
                        placeholder="Enter Email"
                        handleChange={onInputChange}

                    />
                    <Input
                        value={formData.password}
                        id="password"
                        name="password"
                        type="password"
                        labelText="Password"
                        placeholder="Enter Password"
                        handleChange={onInputChange}

                    />
                </div>
                <Button
                    label={`${loading ? 'SIGNUP IN PROGRESS...' : 'SIGNUP'}`}
                    className="auth-button button"
                    disabled={!formData.username || !formData.email || !formData.password}
                />
            </form>
        </div>
    );
};

export default Register;