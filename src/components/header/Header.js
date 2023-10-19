import { useState, useEffect, useRef } from "react";
import logo from "@assets/images/logo.svg";
import { FaCaretDown, FaCaretUp, FaRegEnvelope } from "react-icons/fa";

import { RiNotification2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import MessageSidebar from "@components/message-sidebar/MessageSidebar";
import "@components/header/Header.scss";
import Avatar from "@components/avatar/Avatar";
import { Utils } from "@services/utils/utils.service";
import NotificationUtils from "@services/utils/notification-utils.service";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { sumBy } from "lodash";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import NotiDropdown from "@components/dropdown/NotiDropdown";

import useSessionStorage from "@hooks/useSessionStorage";
import { userService } from "@services/api/user/user.service";
import { useNavigate } from "react-router-dom";
import useEffectOnce from "@hooks/useEffectOnce";
import { ProfileUtils } from "@services/utils/profile-utils.service";
import HeaderSkeleton from "./HeaderSkeleton";
import { notificationService } from "@services/api/notification/notification.service";

import NotificationPreview from "@components/dialog/NotificationPreview";
import { socketService } from "@services/socket/socket.service";
import { ChatUtils } from "@services/utils/chat-utils.service.";

import { createSearchParams } from "react-router-dom";
import { chatService } from "@services/api/chat/chat.service";
import { updateConversationList } from "@redux/reducers/chat/chat.reducer";
import { followerService } from "@services/api/follow/follow.service";
import { imageService } from "@services/api/image/image.service";
import { postService } from "@services/api/post/post.service";
const Header = () => {
  const { profile } = useSelector((state) => state.user);
  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const settingsRef = useRef(null);
  const [isMesssageActive, setIsMessageActive] = useDetectOutsideClick(
    messageRef,
    false
  );
  const [isNotificationActive, setIsNotificationActive] = useDetectOutsideClick(
    notificationRef,
    false
  );
  const [isSettingActive, setIsSettingActive] = useDetectOutsideClick(
    settingsRef,
    false
  );
  const [messageCount, setMessageCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationDialogContent, setNotificationDialogContent] = useState({
    post: "",
    imgUrl: "",
    comment: "",
    reaction: "",
    senderName: "",
  });

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { conversationList } = useSelector((state) => state.chat);

  const initNotifications = async () => {
    try {
      const rs = await notificationService.getUserNotifications();
      const mapNotis = NotificationUtils.mapNotificationDropdownItems(
        rs.data.notifications,
        setNotificationCount
      );
      setNotifications(mapNotis);
    } catch (error) {

     Utils.displayError(error ,dispatch);
    }
  };
  const onMarkAsRead = async (notification) => {
    try {
      // to show dialog
      NotificationUtils.markMessageAsRead(
        notification,
        setNotificationDialogContent
      );
      await notificationService.markNotificationAsRead(notification._id);
    } catch (error) {
     Utils.displayError(error ,dispatch);
    }
  };

  const onDeleteNotification = async (notificationId) => {
    try {
      const response = await notificationService.deleteNotification(
        notificationId
      );
      Utils.displaySuccess(response.data.message, dispatch)
    } catch (error) {
     Utils.displayError(error ,dispatch);
    }
  };

  const [settings, setSettings] = useState("");
  useEffectOnce(() => {
    setSettings([
      {
        topText: "Profile",
        subText: "Your Profile",
      },
    ]);
    initNotifications();
  });

  const callUpdateConversationListAction = (data) => {
    dispatch(updateConversationList(data));
  };

  useEffect(() => {
    ChatUtils.socketIOConversations(
      profile,
      [...conversationList],
      callUpdateConversationListAction,
      dispatch
    );
    return () => {
      socketService.socket.off("chat list");
    };
  }, [conversationList]);
  useEffect(() => {
    NotificationUtils.socketIONotification(
      profile,
      notifications,
      setNotifications,
      "header",
      setNotificationCount
    );
    return () => {
      socketService.socket.off("inserted notification");
      socketService.socket.off("updated notification");
      socketService.socket.off("deleted notification");
    };
  }, [notifications, profile]);




  const openChatPage = async (notification) => {
    try {
      const params = ChatUtils.makeDetailConversationUrlParam(
        notification,
        profile
      );

      const receiverId =
        notification?.receiverUsername !== profile?.username
          ? notification?.receiverId
          : notification?.senderId;

      ChatUtils.joinConversation(profile, notification.conversationId);
      navigate(`/app/social/chat/messages?${createSearchParams(params)}`);

      if (
        notification?.receiverUsername === profile?.username &&
        !notification.isRead
      ) {
        await chatService.markMessagesAsRead(profile?._id, receiverId);
      }
    } catch (error) {
     Utils.displayError(error ,dispatch);
    }
  };

  const onLogout = async () => {
    try {
      Utils.clearStore( dispatch );
      await userService.logoutUser();
      navigate("/");
    } catch (error) {
     Utils.displayError(error ,dispatch);
    }
  };

  //  ? FOR MESSAGES SIDEBAR

  const [chatMessageNotifications, setChatMessageNotifications] = useState([]);

  //  ? END FOR MESSAGES SIDEBAR

  useEffect(() => {
    let newMessageNotifications = [...conversationList];
    newMessageNotifications = newMessageNotifications.filter(
      (el) => el.receiverUsername == profile.username && !el.isRead
    );
    setMessageCount(newMessageNotifications.length);
    setChatMessageNotifications([...newMessageNotifications]);
  }, [conversationList, profile]);

  useEffect(() => {
    if (profile) {
      socketService?.socket?.emit("join room", profile);
    }

  }, []);


  return (
    <>
      {!profile ? (
        <HeaderSkeleton />
      ) : (
        <div className="header-nav-wrapper" data-testid="header-wrapper">
          {isMesssageActive && (
            <div ref={messageRef}>
              <div ref={messageRef}>
                <MessageSidebar
                  profile={profile}
                  messageCount={messageCount}
                  messageNotifications={chatMessageNotifications}
                  openChatPage={openChatPage}
                />
              </div>
            </div>
          )}

          {notificationDialogContent?.senderName && (
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
                  post: "",
                  imgUrl: "",
                  comment: "",
                  reaction: "",
                  senderName: "",
                });
              }}
            />
          )}

          <div className="header-navbar">
            <div
              className="header-image"
              data-testid="header-image"
              onClick={() => {
                socketService?.socket?.emit("leave room", profile);
                navigate("/app/social/streams");
              }}
            >
              <div className="app-name">
                <span id="logo">Social App</span>
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
                  setIsSettingActive(false);
                }}
              >
                <span className="header-list-name">
                  <RiNotification2Line className="header-list-icon" />
                  {notificationCount > 0 && (
                    <span
                      className="bg-danger-dots dots"
                      data-testid="notification-dots"
                    >
                      {notificationCount}
                    </span>
                  )}
                </span>
                {isNotificationActive && (
                  <ul className="dropdown-ul" ref={notificationRef}>
                    <li className="dropdown-li">
                      <NotiDropdown
                        height={300}
                        style={{ right: "250px", top: "20px" }}
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
                  setIsMessageActive(true);
                  setIsNotificationActive(false);
                  setIsSettingActive(false);
                }}
              >
                <span className="header-list-name">
                  <FaRegEnvelope className="header-list-icon" />

                  {messageCount > 0 && (
                    <span
                      className="bg-danger-dots dots"
                      data-testid="messages-dots"
                    ></span>
                  )}
                </span>
                &nbsp;
              </li>
              <li
                data-testid="settings-list-item"
                className="header-nav-item"
                onClick={() => {
                  setIsMessageActive(false);
                  setIsNotificationActive(false);
                  setIsSettingActive(true);
                }}
              >
                <span className="header-list-name profile-image">
                  <Avatar
                    name={profile?.username}
                    bgColor={profile?.avatarColor}
                    textColor="#ffffff"
                    size={40}
                    avatarSrc={profile?.profilePicture}
                  ></Avatar>
                </span>
                <span className="header-list-name profile-name">
                  {profile?.username}
                  {isSettingActive ? (
                    <FaCaretDown className="header-list-icon caret" />
                  ) : (
                    <FaCaretUp className="header-list-icon caret" />
                  )}
                </span>
                {isSettingActive && (
                  <ul className="dropdown-ul" ref={settingsRef}>
                    <li className="dropdown-li">
                      <NotiDropdown
                        height={300}
                        style={{ right: "150px", top: "40px" }}
                        data={settings}
                        notificationCount={0}
                        title="Settings"
                        onLogout={onLogout}
                        onNavigate={() => {
                          ProfileUtils.navigateToProfile(profile, navigate);
                        }}
                      ></NotiDropdown>
                    </li>
                  </ul>
                )}
                <ul className="dropdown-ul">
                  <li className="dropdown-li"></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
