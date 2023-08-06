
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import Input from '../../../components/input/Input';
import Button from '../../../components/button/Button';
import { Link } from 'react-router-dom';
import "./ResetPassword.scss"
const ResetPassword = () => {
    return (
        <div className="container-wrapper">
            <div className="environment">DEV</div>
            <div className="container-wrapper-auth">
                <div className="tabs reset-password-tabs" >
                    <div className="tabs-auth">
                        <ul className="tab-group">
                            <li className="tab">
                                <div className="login reset-password">Reset Password</div>
                            </li>
                        </ul>
                        <div className="tab-item">
                            <div className="auth-inner">

                                <div className={`alerts`} role="alert">

                                </div>

                                <form className="reset-password-form" >
                                    <div className="form-input-container">
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"

                                            labelText="New Password"
                                            placeholder="New Password"

                                        />
                                        <Input
                                            id="cpassword"
                                            name="cpassword"
                                            type="password"

                                            labelText="Confirm Password"
                                            placeholder="Confirm Password"


                                        />
                                    </div>
                                    <Button
                                        label={`${false ? 'RESET PASSWORD IN PROGRESS...' : 'RESET PASSWORD'}`}
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

export default ResetPassword;