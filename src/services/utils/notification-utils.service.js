
import { notificationService } from "@services/api/notification/notification.service";
import { socketService } from "@services/socket/socket.service";
import { Utils } from "@services/utils/utils.service";
import { timeAgo } from "./time.ago.utils";
import { cloneDeep, find, findIndex, remove, sumBy } from 'lodash';
export default class NotificationUtils {
  // use for message noti in navbar
  static socketIONotification(
    profile,
    notifications,
    setNotifications,
    type,
    setNotificationsCount
  ) {

    socketService?.socket?.on("inserted notification", (allNotificationsToLoggedUser, userToData) => {


      // allNotificationsToLoggedUser(is list of current user's notification) and userToData from server
      if (profile?._id === userToData.userTo) {
        // if is notification to logged user

        if (type === "notificationPage") {
          // is on Notification Page
          setNotifications([...allNotificationsToLoggedUser]);
        } else {
          //if type is header
          const mappedNotifications = NotificationUtils.mapNotificationDropdownItems([...allNotificationsToLoggedUser], setNotificationsCount)

          setNotifications([...mappedNotifications]);
        }
      }
    });

    socketService?.socket?.on("updated notification", (notificationId) => {
      let newNotifications = [...notifications];

      const updatedIdx =
        newNotifications.findIndex(
          (notification) => notification._id === notificationId)

      if (updatedIdx !== -1) {
        // update deleted noti id in list 
        newNotifications[updatedIdx].read = true
        if (type === "notificationPage") {
          setNotifications([...newNotifications]);
        } else {
          const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(newNotifications, setNotificationsCount)
          setNotifications([...mappedNotifications]);
        }
      }
    });

    socketService?.socket?.on("deleted notification", (notificationId) => {
      // remove deleted noti id in list 
      let newNotifications = [...notifications].filter(item => item._id !== notificationId)
      if (type === "notificationPage") {
        setNotifications([...newNotifications]);
      } else {
        const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(newNotifications, setNotificationsCount)
        setNotifications([...mappedNotifications]);
      }
    });
  }



  static async markMessageAsRead(notification, setNotificationDialogContent) {

    if (notification.notificationType !== "follow") {
      const notiDialog = {
        createdAt: notification?.createdAt,
        post: notification?.post,
        imgUrl: notification?.imgId
          ? Utils.appImageUrl(notification?.imgVersion, notification?.imgId)
          : notification?.gifUrl
            ? notification?.gifUrl
            : notification?.imgUrl,
        comment: notification?.comment,
        reaction: notification?.reaction,
        senderName: notification?.userFrom ? notification?.userFrom.username : notification?.username,

      }
      setNotificationDialogContent(notiDialog)
    }

  }


  // * use to map from api data to NotiDropdown can use 
  static mapNotificationDropdownItems(notificationData, setNotificationsCount) {
    const items = [];
    for (const notification of notificationData) {
      const item = {
        _id: notification?._id,
        topText: notification?.topText ? notification?.topText : notification?.message,
        subText: timeAgo.transform(notification?.createdAt),
        createdAt: notification?.createdAt,
        username: notification?.userFrom ? notification?.userFrom.username : notification?.username,
        avatarColor: notification?.userFrom ? notification?.userFrom.avatarColor : notification?.avatarColor,
        profilePicture: notification?.userFrom ? notification?.userFrom.profilePicture : notification?.profilePicture,
        read: notification?.read,
        post: notification?.post,
        imgUrl: notification?.imgId
          ? Utils.appImageUrl(notification?.imgVersion, notification?.imgId)
          : notification?.gifUrl
            ? notification?.gifUrl
            : notification?.imgUrl,
        comment: notification?.comment,
        reaction: notification?.reaction,
        senderName: notification?.userFrom ? notification?.userFrom.username : notification?.username,
        notificationType: notification?.notificationType
      };
      items.push(item);
    }

    const readItemCnt = items.reduce((sum, item) => {
      if (item.read === false) {
        return sum + 1;
      } else {
        return sum;
      }
    }, 0);


    setNotificationsCount(readItemCnt)
    return items
  }

}
