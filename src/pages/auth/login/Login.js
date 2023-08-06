
import { FaArrowRight } from 'react-icons/fa';
import Input from "../../../components/input/Input"
import Button from "../../../components/button/Button"
import "./Login.scss"
const Login = () => {

    return (
        <div className="auth-inner">

            <div role="alert">
            </div>

            <form className="auth-form" >
                <div className="form-input-container">
                    <Input
                        id="username"
                        name="username"
                        type="text"

                        labelText="Username"
                        placeholder="Enter Username"

                    ></Input>
                    <Input
                        id="password"
                        name="password"
                        type="password" 

                        labelText="Password"
                        placeholder="Enter Password"
                    />
                    <label className="checkmark-container" htmlFor="checkbox">
                        <Input
                            id="checkbox"
                            name="checkbox"
                            type="checkbox"
                        />
                        Keep me signed in
                    </label>
                </div>

                <Button
                    label='SIGN IN'
                    className="auth-button button"
                  
                />
                <span className="forgot-password">
                    Forgot password? <FaArrowRight className="arrow-right" />
                </span>
            </form>
        </div>
    );
};

export default Login;