import { useState, useEffect, useRef } from "react";
import logo from "@assets/images/logo.svg";
import {
  FaCaretDown,
  FaCaretUp,
  FaRegBell,
  FaRegEnvelope,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import MessageSidebar from "@components/message-sidebar/MessageSidebar";
import "@components/header/Header.scss";
import Avatar from "@components/avatar/Avatar";
import { Utils } from "@services/utils/utils.service";
import { NotificationUtils } from "@services/utils/notification-utils.service";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { sumBy } from "lodash";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import NotiDropdown from "@components/dropdown/NotiDropdown";

import useLocalStorage from "@hooks/useLocalStorage";
import useSessionStorage from "@hooks/useSessionStorage";
import { userService } from "@services/api/user/user.service";
import { useNavigate } from "react-router-dom";
import useEffectOnce from "@hooks/useEffectOnce";
import { ProfileUtils } from "@services/utils/profile-utils.service";
import HeaderSkeleton from "./HeaderSkeleton";
import { notificationService } from "@services/api/notification/notification.service";

import NotificationPreview from "@components/dialog/NotificationPreview";
import { socketService } from "@services/socket/socket.service";
const Header = () => {
  const [environment, setEnvironment] = useState("");
  const { profile } = useSelector((state) => state.user);
  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const settingsRef = useRef(null);
  const [isMesssageActive, setIsMessageActive] = useDetectOutsideClick(
    messageRef, false
  )
  const [isNotificationActive, setIsNotificationActive] = useDetectOutsideClick(notificationRef, false);
  const [isSettingActive, setIsSettingActive] = useDetectOutsideClick(settingsRef, false);
  const [messageCount, setMessageCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationDialogContent, setNotificationDialogContent] = useState({
    post: '',
    imgUrl: '',
    comment: '',
    reaction: '',
    senderName: ''
  })
  const dispatch = useDispatch();
  const location = useLocation();
  const backgroundColor = `${environment === "DEV" || environment === "LOCAL"
    ? "#50b5ff"
    : environment === "STG"
      ? "#e9710f"
      : ""
    }`;
  const [deleteStorageUsername] = useLocalStorage('username', 'delete');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [deleteSessionPageReload] = useSessionStorage('pageReload', 'delete');
  const navigate = useNavigate()
  const storedUsername = useLocalStorage("username", "get")
  const getUserNotification = async () => {
    try {
      const rs = await notificationService.getUserNotifications()
      const mapNotis = NotificationUtils.mapNotificationDropdownItems(rs.data.notifications,
        setNotificationCount
      )
      setNotifications(mapNotis)
      socketService?.socket.emit('setup', { userId: storedUsername })

    } catch (error) {
      Utils.dispatchNotification(error?.response?.data?.message, 'error', dispatch);
    }
  }
  const onMarkAsRead = async (notification) => {
    try {
      NotificationUtils.markMessageAsRead(notification._id, notification, setNotificationDialogContent)
    } catch (error) {

      Utils.dispatchNotification(error?.response?.data?.message, 'error', dispatch);
    }
  }

  const onDeleteNotification = async (notificationId) => {

    try {
      const response = await notificationService.deleteNotification(notificationId);
      Utils.dispatchNotification(response.data.message, 'success', dispatch);
    } catch (error) {
      Utils.dispatchNotification(error?.response?.data?.message, 'error', dispatch);
    }
  }

  const [settings, setSettings] = useState('')
  useEffectOnce(() => {
    Utils.mapSettingsDropdownItems(setSettings);
    getUserNotification()
  });

  useEffect(() => {
    NotificationUtils.socketIONotification(
      profile,
      notifications,
      setNotifications,
      "header",
      setNotificationCount
    )
  }, [notifications, profile])

  const openChatPage = async (notification) => {
    console.log("OPEN CHAT PAGE");

  };

  const onLogout = async () => {
    try {
      setLoggedIn(false);
      Utils.clearStore({ dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedin: setLoggedIn });
      await userService.logoutUser();
      navigate('/');
    } catch (error) {
      console.log(error);
      Utils.dispatchNotification(error?.response?.data?.message, 'error', dispatch);
    }
  };

  return (

    <>
      {!profile
        ? <HeaderSkeleton /> :
        <div className="header-nav-wrapper" data-testid="header-wrapper">
          {isMesssageActive &&
            <div ref={messageRef}>
              <div ref={messageRef}>
                <MessageSidebar
                  profile={profile}
                  messageCount={messageCount}
                  messageNotifications={[]}
                  openChatPage={openChatPage}
                />
              </div>
            </div>


          }


          {notificationDialogContent?.senderName &&
            <NotificationPreview
              title="Your post"
              post={notificationDialogContent?.post}
              imgUrl={notificationDialogContent?.imgUrl}
              comment={notificationDialogContent?.comment}
              reaction={notificationDialogContent?.reaction}
              senderName={notificationDialogContent?.senderName}
              secondButtonText="Close"
              secondBtnHandler={() => {
                setNotificationDialogContent({
                  post: '',
                  imgUrl: '',
                  comment: '',
                  reaction: '',
                  senderName: ''
                })
              }}


            />
          }

          <div className="header-navbar">
            <div className="header-image" data-testid="header-image"

              onClick={() => navigate('/app/social/streams')}
            >
              <img src={logo} className="img-fluid" alt="" />
              <div className="app-name">
                Chatty
                {environment && (
                  <span
                    className="environment"
                    style={{ backgroundColor: `${backgroundColor}` }}
                  >
                    {environment}
                  </span>
                )}
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
                onClick={() => {
                  setIsMessageActive(false);
                  setIsNotificationActive(true);
                  setIsSettingActive(false)
                }}
              >
                <span className="header-list-name">
                  <FaRegBell className="header-list-icon" />
                  {notificationCount > 0 && (
                    <span className="bg-danger-dots dots" data-testid="notification-dots">
                      {notificationCount}
                    </span>
                  )
                  }
                </span>
                {isNotificationActive && (
                  <ul className="dropdown-ul" ref={notificationRef}>
                    <li className="dropdown-li">
                      <NotiDropdown
                        height={300}
                        style={{ right: '250px', top: '20px' }}
                        data={notifications}
                        notificationCount={notificationCount}
                        title="Notifications"
                        onMarkAsRead={onMarkAsRead}
                        onDeleteNotification={onDeleteNotification}
                      />
                    </li>
                  </ul>
                )}
                &nbsp;
              </li>
              <li
                data-testid="message-list-item"
                className="header-nav-item active-item"

                onClick={() => {
                  setIsMessageActive(true)
                  setIsNotificationActive(false)
                  setIsSettingActive(false)
                }}
              >
                <span className="header-list-name">
                  <FaRegEnvelope className="header-list-icon" />

                  <span
                    className="bg-danger-dots dots"
                    data-testid="messages-dots"
                  ></span>
                </span>
                &nbsp;
              </li>
              <li data-testid="settings-list-item" className="header-nav-item"
                onClick={() => {
                  setIsMessageActive(false)
                  setIsNotificationActive(false)
                  setIsSettingActive(true)
                }}

              >
                <span className="header-list-name profile-image">
                  <Avatar
                    name={profile?.username}
                    bgColor={profile?.avatarColor}
                    textColor="#ffffff"
                    size={40}
                    avatarSrc=""
                  ></Avatar>
                </span>
                <span className="header-list-name profile-name">
                  {profile?.username}
                  {isSettingActive ?
                    <FaCaretDown className="header-list-icon caret" /> :
                    <FaCaretUp className="header-list-icon caret" />}

                </span>
                {
                  isSettingActive &&
                  <ul className="dropdown-ul" ref={settingsRef}>
                    <li className="dropdown-li">
                      <NotiDropdown
                        height={300}
                        style={{ right: '150px', top: '40px' }}
                        data={settings}
                        notificationCount={0}
                        title="Settings"
                        onLogout={onLogout}
                        onNavigate={() => {
                          ProfileUtils.navigateToProfile(profile, navigate)
                        }}
                      ></NotiDropdown>
                    </li>
                  </ul>
                }
                <ul className="dropdown-ul">
                  <li className="dropdown-li"></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>}

    </>
  );
};
export default Header;
