import { useState, useEffect, useRef } from 'react';
import logo from '@assets/images/logo.svg';
import { FaCaretDown, FaCaretUp, FaRegBell, FaRegEnvelope } from 'react-icons/fa';

import '@components/header/Header.scss';
import Avatar from '@components/avatar/Avatar';
import { Utils } from '@services/utils/utils.service';

const Header = () => {
    const [environment, setEnvironment] = useState('')
    const backgroundColor = `${environment === 'DEV' || environment === 'LOCAL' ? '#50b5ff' : environment === 'STG' ? '#e9710f' : ''}`;
    useEffect(() => {
        const env = Utils.appEnvironment();
        setEnvironment(env);

    }, []);

    return (
        <>

            <div className="header-nav-wrapper" data-testid="header-wrapper">
                <div className="header-navbar">
                    <div className="header-image" data-testid="header-image">
                        <img src={logo} className="img-fluid" alt="" />
                        <div className="app-name">
                            Chatty
                            {environment &&
                                <span className="environment"
                                    style={{ backgroundColor: `${backgroundColor}` }}

                                >
                                    {environment}
                                </span>
                            }

                        </div>
                    </div>
                    <div className="header-menu-toggle">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                    {/* header nav */}
                    <ul className="header-nav">
                        <li
                            data-testid="notification-list-item"
                            className="header-nav-item active-item"

                        >
                            <span className="header-list-name">
                                <FaRegBell className="header-list-icon" />

                                <span className="bg-danger-dots dots" data-testid="notification-dots">
                                    noti
                                </span>

                            </span>

                            &nbsp;
                        </li>
                        <li
                            data-testid="message-list-item"
                            className="header-nav-item active-item"

                        >
                            <span className="header-list-name">
                                <FaRegEnvelope className="header-list-icon" />

                                <span className="bg-danger-dots dots" data-testid="messages-dots"></span>
                            </span>
                            &nbsp;
                        </li>
                        <li
                            data-testid="settings-list-item"
                            className="header-nav-item"

                        >
                            <span className="header-list-name profile-image">
                                <Avatar name="Danny"
                                    bgColor="red"
                                    textColor="#ffffff"
                                    size={40}
                                    avatarSrc=""
                                >

                                </Avatar>
                            </span>
                            <span className="header-list-name profile-name">
                                Username
                                <FaCaretUp className="header-list-icon caret" />

                            </span>

                            <ul className="dropdown-ul">
                                <li className="dropdown-li"></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

        </>
    );
};
export default Header;