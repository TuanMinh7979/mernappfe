
import "./Notification.scss"
import Avatar from "@components/avatar/Avatar";
import { FaCircle } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Utils } from "@services/utils/utils.service";
import { useDispatch, useSelector } from "react-redux";
import { notificationService } from "@services/api/notification/notification.service";
import useEffectOnce from "@hooks/useEffectOnce";
import { timeAgo } from "@services/utils/time.ago.utils";
import NotificationUtils from "@services/utils/notification-utils.service";
import NotificationPreview from "@components/dialog/NotificationPreview";
import { socketService } from "@services/socket/socket.service";
const Notification = () => {
  const { profile } = useSelector(state => state.user)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();
  const [notificationDialogContent, setNotificationDialogContent] = useState({
    post: '',
    imgUrl: '',
    comment: '',
    reaction: '',
    senderName: ''
  })
  const initNotifications = async () => {
    try {
      const rs = await notificationService.getUserNotifications()
      setNotifications(rs.data.notifications)

    } catch (error) {

      Utils.updToastsNewEle(error?.response?.data?.message, 'error', dispatch);
    }
  }

  useEffectOnce(() => {
    initNotifications()
  })

  const markAsRead = async (notification) => {
    try {
      // to show dialog
      NotificationUtils.markMessageAsRead(notification, setNotificationDialogContent)
      await notificationService.markNotificationAsRead(notification._id);
    } catch (error) {

      Utils.updToastsNewEle(error?.response?.data?.message, 'error', dispatch);
    }
  }

  const deleteNotification = async (event, notificationId) => {
    event.stopPropagation()
    try {
      const response = await notificationService.deleteNotification(notificationId);
      Utils.updToastsNewEle(response.data.message, 'success', dispatch);
    } catch (error) {
      Utils.updToastsNewEle(error?.response?.data?.message, 'error', dispatch);
    }
  }
  useEffect(() => {
    NotificationUtils.socketIONotification(
      profile,
      notifications,
      setNotifications,
      "notificationPage",

    )


    return (() => {
      // socketService.socket.off("inserted notification");
      // socketService.socket.off("updated notification");
      // socketService.socket.off("deleted notification");
    })
    // if notichanges , call init socket data
  }, [notifications, profile])

  return (
    <>
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
      <div className="notifications-container">
        <div className="notifications">Notifications</div>
        {notifications.length > 0 && <div className="notifications-box">
          {notifications.map((notification) => (
            <div
              className="notification-box"
              data-testid="notification-box"
              key={notification?._id}
              onClick={() => markAsRead(notification)}

            >
              <div className="notification-box-sub-card">
                <div className="notification-box-sub-card-media">
                  <div className="notification-box-sub-card-media-image-icon">
                    <Avatar
                      name={notification?.userFrom?.username}
                      bgColor={notification?.userFrom?.avatarColor}
                      textColor="#ffffff"
                      size={40}
                      avatarSrc={notification?.userFrom?.profilePicture}
                    />
                  </div>
                  <div className="notification-box-sub-card-media-body">
                    <h6 className="title">
                      {notification?.message}
                      <small
                        data-testid="subtitle"
                        className="subtitle"
                        onClick={(event) => deleteNotification(event, notification._id)}
                      >
                        <FaRegTrashAlt className="trash" />
                      </small>
                    </h6>
                    <div className="subtitle-body">
                      <small className="subtitle">
                        {!notification?.read ? <FaCircle className="icon" /> : <FaRegCircle className="icon" />}
                      </small>
                      <p className="subtext">{timeAgo.transform(notification?.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>}


        {loading && !notifications.length && <div className="notifications-box"></div>}
        {!loading && !notifications.length && <h3 className="empty-page" data-testid="empty-page">
          You have no notifications
        </h3>}
      </div>
    </>
  );
};
export default Notification;
