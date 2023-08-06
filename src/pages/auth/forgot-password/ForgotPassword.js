import { FaArrowLeft } from 'react-icons/fa';
import Input from '../../../components/input/Input';
import Button from '../../../components/button/Button';
import { Link } from 'react-router-dom';
import "./ForgotPassword.scss"
const ForgotPassword = () => {


    return (
        <div className="container-wrapper" >
            <div className="environment">DEV</div>
            <div className="container-wrapper-auth">
                <div className="tabs forgot-password-tabs" >
                    <div className="tabs-auth">
                        <ul className="tab-group">
                            <li className="tab">
                                <div className="login forgot-password">Forgot Password</div>
                            </li>
                        </ul>

                        <div className="tab-item">
                            <div className="auth-inner">

                                <div className={`alerts`} role="alert">

                                </div>

                                <form className="forgot-password-form">
                                    <div className="form-input-container">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="text"
                                            labelText="Email"
                                            placeholder="Enter Email"

                                        />
                                    </div>
                                    <Button
                                        label={`${false ? 'FORGOT PASSWORD IN PROGRESS...' : 'FORGOT PASSWORD'}`}
                                        className="auth-button button"

                                    />

                                    <Link to={'/'}>
                                        <span className="login">
                                            <FaArrowLeft className="arrow-left" /> Back to Login
                                        </span>
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;