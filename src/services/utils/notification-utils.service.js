
import { notificationService } from "@services/api/notification/notification.service";
import { socketService } from "@services/socket/socket.service";
import { Utils } from "@services/utils/utils.service";
import { cloneDeep, find, findIndex, remove, sumBy } from "lodash";
import { timeAgo } from "./time.ago.utils";

export class NotificationUtils {
  static socketIONotification(
    profile,
    notifications,
    setNotifications,
    type,
    setNotificationsCount
  ) {

    console.log("init", notifications);
    socketService?.socket?.on("insert notification", (data, userToData) => {
      // data(is list of current user's notification) and userToData from server
      if (profile?._id === userToData.userTo) {
        notifications = [...data];
        if (type === "notificationPage") {
          setNotifications(notifications);
        }
      } else {
        const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(notifications, setNotificationsCount)
        setNotifications(mappedNotifications);
      }
    });

    socketService?.socket?.on("update notification", (notificationId) => {
      let newNotifications = [...notifications];
      console.log(newNotifications);
      const updatedIdx =
        newNotifications.findIndex(
          (notification) => notification._id === notificationId)
      console.log(updatedIdx);
      if (updatedIdx !== -1) {
        newNotifications[updatedIdx].read = true
        if (type === "notificationPage") {
          setNotifications(newNotifications);
        } else {
          const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(notifications, setNotificationsCount)
          setNotifications(mappedNotifications);
        }
      }
    });

    socketService?.socket?.on("delete notification", (notificationId) => {

      let newNotifications = [...notifications].filter(item => item._id === notificationId)
      if (type === "notificationPage") {
        setNotifications(newNotifications);
      } else {
        const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(notifications, setNotificationsCount)
        setNotifications(mappedNotifications);
      }
    });
  }



  static async markMessageAsRead(messageId, notification, setNotificationDialogContent) {

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
    await notificationService.markNotificationAsRead(messageId);
  }


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
      if (item.read === true) {
        return sum + 1;
      } else {
        return sum;
      }
    }, 0);

    setNotificationsCount(readItemCnt)
    return items




  }



}
