import Input from '@components/input/Input';
import Button from '@components/button/Button';
import './Register.scss';
import { useState } from 'react';
import { Utils } from '@services/utils/utils.service';
import { authService } from '@services/api/auth/auth.service';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ValidRegister } from '@services/utils/valid';
const Register = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        cf_password: ''
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

        const validErrors = ValidRegister(formData);
        if (validErrors.errLength > 0) {
            setErrorMessage(validErrors.errMsg[0])
            return
        }
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
            Utils.updToastsNewEle("Success", 'success', dispatch);


        } catch (error) {
            setLoading(false);
            setErrorMessage(error?.response?.data.message)
        }

    }

    // TODO: create global alert for success register
    return (
        <div className='signup'>




            <div class="split-screen">
                <div class="left">
                    <section class="copy">
                        <h1>Connect together</h1>
                        <p>with Social App</p>
                    </section>
                </div>
                <div class="right">
                    <form onSubmit={registerUser}>


                        <section class="copy title">
                            <h2>Sign Up</h2>
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
                            <Input
                                value={formData.cf_password}
                                id="cf_password"
                                name="cf_password"
                                type="password"
                                labelText="Confirm Password"
                                placeholder="Enter Confirm Password"
                                handleChange={onInputChange}

                            />

                        </div>



                        <Button
                            label={`${loading ? 'SIGN UP IN PROGRESS..' : 'SIGN UP'}`}
                            className="signup-btn"

                        />


                        <section class="copy">

                            <div class="login-container">
                                <p>Already have an account? <span className="link" onClick={() => navigate("/")}> <strong>Log In</strong></span></p>
                            </div>
                        </section>




                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;