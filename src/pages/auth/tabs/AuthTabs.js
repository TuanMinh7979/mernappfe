
import React from 'react'
import './AuthTabs.scss'
import { useState } from 'react'
import backgroundImage from "../../../assets/images/background.jpg"
import Login from '../login/Login'
const AuthTabs = () => {
    const [type, setType] = useState('SignIn')
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
                                <Login></Login>
                            </div>
                        }


                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthTabs