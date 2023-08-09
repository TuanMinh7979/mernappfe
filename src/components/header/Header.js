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
const Header = () => {
  const [environment, setEnvironment] = useState("");
  const { profile } = useSelector((state) => state.user);
  const messageRef = useRef(null);
  const [messageCount, setMessageCount] = useState(0);
  const [messageNotifications, setMessageNotifications] = useState([]);
  const { chatList } = useSelector((state) => state.chat);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const dispatch = useDispatch();
  const location = useLocation();
  const backgroundColor = `${
    environment === "DEV" || environment === "LOCAL"
      ? "#50b5ff"
      : environment === "STG"
      ? "#e9710f"
      : ""
  }`;

  useEffect(() => {
    const env = Utils.appEnvironment();
    setEnvironment(env);
    const count = sumBy(chatList, (notification) => {
      return !notification.isRead &&
        notification.receiverUsername === profile?.username
        ? 1
        : 0;
    });
    setMessageCount(count);
    setMessageNotifications(chatList);
  }, [chatList, profile]);

  useEffect(() => {
    NotificationUtils.socketIONotification(
      profile,
      notifications,
      setNotifications,
      "header",
      setNotificationCount
    );
    NotificationUtils.socketIOMessageNotification(
      profile,
      messageNotifications,
      setMessageNotifications,
      setMessageCount,
      dispatch,
      location
    );
  }, [profile, notifications, dispatch, location, messageNotifications]);

  const openChatPage = async (notification) => {
    console.log("OPEN CHAT PAGE");
    // try {
    //   const params = ChatUtils.chatUrlParams(notification, profile);
    //   ChatUtils.joinRoomEvent(notification, profile);
    //   ChatUtils.privateChatMessages = [];
    //   const receiverId =
    //     notification?.receiverUsername !== profile?.username ? notification?.receiverId : notification?.senderId;
    //   if (notification?.receiverUsername === profile?.username && !notification.isRead) {
    //     await chatService.markMessagesAsRead(profile?._id, receiverId);
    //   }
    //   const userTwoName =
    //     notification?.receiverUsername !== profile?.username
    //       ? notification?.receiverUsername
    //       : notification?.senderUsername;
    //   await chatService.addChatUsers({ userOne: profile?.username, userTwo: userTwoName });
    //   navigate(`/app/social/chat/messages?${createSearchParams(params)}`);
    //   setIsMessageActive(false);
    //   dispatch(getConversationList());
    // } catch (error) {
    //   Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    // }
  };
  return (
    <>
      <div className="header-nav-wrapper" data-testid="header-wrapper">
        <div ref={messageRef}>
          <MessageSidebar
            profile={profile}
            messageCount={messageCount}
            messageNotifications={messageNotifications}
            openChatPage={openChatPage}
          />
        </div>

        <div className="header-navbar">
          <div className="header-image" data-testid="header-image">
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
            >
              <span className="header-list-name">
                <FaRegBell className="header-list-icon" />

                <span
                  className="bg-danger-dots dots"
                  data-testid="notification-dots"
                >
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

                <span
                  className="bg-danger-dots dots"
                  data-testid="messages-dots"
                ></span>
              </span>
              &nbsp;
            </li>
            <li data-testid="settings-list-item" className="header-nav-item">
              <span className="header-list-name profile-image">
                <Avatar
                  name="Danny"
                  bgColor="red"
                  textColor="#ffffff"
                  size={40}
                  avatarSrc=""
                ></Avatar>
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
