
import { FaArrowRight } from 'react-icons/fa';
import Input from "../../../components/input/Input"
import Button from "../../../components/button/Button"
import { Link } from 'react-router-dom';
import "./Login.scss"

const Login = () => {

    return (
        <div className="auth-inner">

            <div className="alerts alert-error" role="alert">
                sfas
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