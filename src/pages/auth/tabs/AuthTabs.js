
import React from 'react'
import './AuthTabs.scss'
import { useState } from 'react'
import backgroundImage from "../../../assets/images/background.jpg"
import { Login, Register } from "../index"
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '@hooks/useLocalStorage'
import { useEffect } from 'react'
import { Utils } from '@services/utils/utils.service'
const AuthTabs = () => {
    const [type, setType] = useState('SignIn')
    const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
    const [environment, setEnvironment] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const env = Utils.appEnvironment();
        setEnvironment(env);
        if (keepLoggedIn) navigate('/app/social/streams');
    }, [keepLoggedIn, navigate]);

    return (
        <div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="environment">DEV</div>
            <div className="container-wrapper-auth">
                <div className="tabs">
                    <div className="tabs-auth">
                        <ul className="tab-group">
                            <li className={`tab ${type === "SignIn" ? 'active' : ''}`} onClick={() => setType("SignIn")}>
                                <button className="login">Sign In</button>
                            </li>
                            <li className={`tab ${type === "SignUp" ? 'active' : ''}`} onClick={() => setType("SignUp")}>
                                <button className="signup">Sign Up</button>
                            </li>
                        </ul>

                        {type === "SignIn" && <div className="tab-item">
                            <Login></Login>
                        </div>
                        }
                        {
                            type === "SignUp" && <div className="tab-item">
                                <Register></Register>
                            </div>
                        }


                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthTabs